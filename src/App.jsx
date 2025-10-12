import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';


// --- Constants and Utility Functions ---

// Updated Placeholder URL for a soft, aesthetic farm image
const HERO_IMAGE_URL = "https://placehold.co/1920x800/C8E6C9/4A4A4A?text=Pastel+Green+Farm+Aesthetic";

// Helper function for exponential backoff (retry API calls) - Kept for best practice
const exponentialBackoffFetch = async (url, options, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error("Fetch failed after multiple retries:", error);
        throw error;
      }
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// --- Firebase Initialization and Auth Setup ---
const useFirebaseSetup = () => {
    const [userId, setUserId] = useState('Authenticating...');
    const [dbInstance, setDbInstance] = useState(null);
    const [authInstance, setAuthInstance] = useState(null);

    useEffect(() => {
        const appId = 'my-local-test-app'; 
        let firebaseConfig = {
            apiKey: "AIzaSyAsDvecPuivZ4WK2NjAJakw363_w7Ao22o",
            authDomain: "agrilink-pro-52d43.firebaseapp.com",
            projectId: "agrilink-pro-52d43",
            storageBucket: "agrilink-pro-52d43.firebasestorage.app",
            messagingSenderId: "586273255769",
            appId: "1:586273255769:web:e6402eee543e86c602dc48",
            measurementId: "G-K5ZVZ3R52D"
        };
        try {
            firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        } catch(e) {
            console.error("Firebase config parsing error:", e);
            return;
        }

        if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);
            const analytics = getAnalytics(app);

            setDbInstance(db);
            setAuthInstance(auth);

            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else if (initialAuthToken) {
                    try {
                        const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                        setUserId(userCredential.user.uid);
                    } catch (error) {
                        console.error("Error signing in with custom token. Attempting anonymous sign-in:", error);
                        const anonymousCredential = await signInAnonymously(auth);
                        setUserId(anonymousCredential.user.uid);
                    }
                } else {
                    const anonymousCredential = await signInAnonymously(auth);
                    setUserId(anonymousCredential.user.uid);
                }
            });

            return () => unsubscribe();
        }
    }, []);

    return { userId, dbInstance, authInstance };
};


// --- Components ---

const Notification = ({ message, type, onClose }) => {
    // Pastel colors for notifications
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-xl shadow-xl transition-opacity duration-300 transform hover:scale-[1.03]";
    const typeClasses = type === 'error' ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800";

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            <div className="flex justify-between items-center font-medium">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 font-extrabold text-xl opacity-70 hover:opacity-100 transition duration-150">
                    &times;
                </button>
            </div>
        </div>
    );
};

// --- Sign Up Component ---
const SignUpForm = ({ auth, db, setView, showNotification }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'farmer' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { name, email, password, role } = formData;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        if (!name || !email || !password || !role) {
            showNotification("Please fill in all fields.", 'error');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Store user profile data in Firestore
            const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/user_profile`, 'profile');
            await setDoc(userDocRef, {
                uid: user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString()
            });

            showNotification("Account created successfully! You are now logged in.", 'success');
            setView('home'); // Go back to the home view after successful sign-up

        } catch (error) {
            console.error("Sign Up Error:", error);
            let errorMessage = "An unknown error occurred during sign up.";
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use': errorMessage = "Email address is already in use."; break;
                    case 'auth/invalid-email': errorMessage = "Invalid email format."; break;
                    case 'auth/weak-password': errorMessage = "Password should be at least 6 characters."; break;
                    default: errorMessage = `Authentication failed: ${error.message}`;
                }
            }
            showNotification(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-extrabold text-gray-800 text-center tracking-tighter">Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-5">
                {/* Role Selector */}
                <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-600">I am a:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700"
                        required
                    >
                        <option value="farmer">🧑‍🌾 Farmer</option>
                        <option value="aggregator">🛒 Aggregator</option>
                        <option value="admin">⚙️ Admin</option>
                    </select>
                </div>

                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700 placeholder:text-gray-400"
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700 placeholder:text-gray-400"
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700 placeholder:text-gray-400"
                    required
                />

                {/* Create Account Button - Pastel Pink CTA */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 shadow-md transform hover:scale-[1.01] ${isLoading ? 'bg-pink-400 opacity-80 cursor-not-allowed' : 'bg-pink-400 hover:bg-pink-500 shadow-pink-200'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <p className="text-sm text-center text-gray-500">
                Already have an account? <button onClick={() => setView('login')} className="text-pink-400 hover:text-pink-600 font-bold transition duration-150">Log In</button>
            </p>
        </div>
    );
};


// --- Login Component ---
const LoginForm = ({ auth, setView, showNotification }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { email, password } = formData;

        if (!email || !password) {
            showNotification("Please enter both email and password.", 'error');
            setIsLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showNotification("Login successful!", 'success');
            setView('home'); // Go back to the home view after successful login
        } catch (error) {
            console.error("Login Error:", error);
            let errorMessage = "Login failed. Check your email and password.";
            if (error.code === 'auth/invalid-credential') {
                 errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/invalid-email') {
                 errorMessage = "Invalid email format.";
            } else {
                 errorMessage = `Login failed: ${error.message}`;
            }

            showNotification(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-extrabold text-gray-800 text-center tracking-tighter">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email/Username */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700 placeholder:text-gray-400"
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-pink-300 focus:border-pink-300 transition duration-200 ease-in-out bg-green-50 text-gray-700 placeholder:text-gray-400"
                    required
                />

                {/* Login Button - Pastel Mint CTA */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-gray-800 transition duration-300 shadow-md transform hover:scale-[1.01] ${isLoading ? 'bg-green-300 opacity-80 cursor-not-allowed' : 'bg-green-300 hover:bg-green-400 shadow-green-200'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <p className="text-sm text-center text-gray-500">
                Need an account? <button onClick={() => setView('signup')} className="text-pink-400 hover:text-pink-600 font-bold transition duration-150">Sign Up</button>
            </p>
        </div>
    );
};

// --- Home Component (Landing Page) ---
const Home = ({ setView }) => (
    <div
        className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden p-4"
        style={{
            backgroundImage: `url(${HERO_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    >
        {/* Soft Lilac Overlay */}
        <div className="absolute inset-0 bg-purple-100 opacity-50"></div>

        {/* Hero Content */}
        <div className="relative text-center max-w-4xl p-8 md:p-12 bg-white bg-opacity-90 rounded-[2.5rem] shadow-2xl shadow-purple-200 backdrop-blur-sm transform transition duration-500 hover:scale-[1.02]">
            <h1 className="text-6xl md:text-7xl font-extrabold text-green-700 mb-4 tracking-tight leading-tight">
                Harvesting the Future
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium">
                Your integrated platform for **real-time market insights** and **direct farmer-aggregator connections.**
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Sign Up Button - Soft Pink */}
                <button
                    onClick={() => setView('signup')}
                    className="px-8 py-4 bg-pink-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-500 transition duration-300 transform hover:scale-105 active:scale-95"
                >
                    Start Your Journey (Sign Up)
                </button>
                {/* Log In Button - Soft Mint */}
                <button
                    onClick={() => setView('login')}
                    className="px-8 py-4 bg-green-300 text-gray-800 text-lg font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-400 transition duration-300 transform hover:scale-105 active:scale-95"
                >
                    Already Connected? (Log In)
                </button>
            </div>
        </div>
    </div>
);


// --- Main Application Component ---
const App = () => {
    // view can be 'home', 'login', or 'signup'
    const [view, setView] = useState('home');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const { userId, dbInstance, authInstance } = useFirebaseSetup();
    const isLoggedIn = authInstance && authInstance.currentUser && !authInstance.currentUser.isAnonymous;

    const showNotification = useCallback((message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    }, []);

    const handleLogout = async () => {
        if (authInstance) {
            try {
                await authInstance.signOut();
                showNotification("Logged out successfully.", 'success');
                setView('home'); // Navigate to home/landing page
                // The useFirebaseSetup hook will automatically handle signing back in anonymously
            } catch (error) {
                console.error("Logout Error:", error);
                showNotification("Error logging out.", 'error');
            }
        }
    };

    const renderView = () => {
        // Ensure Firebase instances are ready before rendering Auth forms
        if (view !== 'home' && (!authInstance || !dbInstance)) {
            return (
                <div className="flex justify-center items-center min-h-screen pt-16">
                    <div className="text-xl font-semibold text-gray-600">Loading platform services...</div>
                </div>
            );
        }

        switch (view) {
            case 'login':
                // Center the form on the screen
                return (
                    <div className="flex justify-center items-center min-h-screen-minus-header p-4">
                        <LoginForm auth={authInstance} setView={setView} showNotification={showNotification} />
                    </div>
                );
            case 'signup':
                // Center the form on the screen
                return (
                    <div className="flex justify-center items-center min-h-screen-minus-header p-4">
                        <SignUpForm auth={authInstance} db={dbInstance} setView={setView} showNotification={showNotification} />
                    </div>
                );
            case 'home':
            default:
                return <Home setView={setView} />;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-inter">
            {/* Header / Navigation Bar - Pastel Green Background */}
            <header className="fixed top-0 left-0 right-0 bg-green-100 shadow-md z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <button onClick={() => setView('home')} className="text-3xl font-extrabold text-green-700 hover:text-green-800 transition duration-150 tracking-tighter">
                        🌱 AgriConnect
                    </button>
                    <div className="flex items-center space-x-4 text-sm">
                        {isLoggedIn ? (
                            <>
                                <span className="text-gray-700 font-medium p-2 bg-white rounded-lg shadow-sm">
                                    Hello, {authInstance.currentUser.email || 'User'}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-pink-300 text-gray-800 rounded-xl hover:bg-pink-400 font-bold transition duration-150 shadow-md"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setView('login')} className="text-gray-700 hover:text-green-600 font-medium transition duration-150">
                                    Log In
                                </button>
                                <button onClick={() => setView('signup')} className="px-4 py-2 bg-pink-300 text-white rounded-xl hover:bg-pink-400 font-bold transition duration-150 shadow-md">
                                    Sign Up
                                </button>
                            </>
                        )}
                        {/* Display User ID (required for collaborative environment) */}
                        <span className="text-xs text-gray-400 p-1 bg-white rounded-lg font-mono hidden sm:inline">
                            UID: {userId}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-16">
                {renderView()}
            </main>

            {/* Notification System */}
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        </div>
    );
};

export default App;

