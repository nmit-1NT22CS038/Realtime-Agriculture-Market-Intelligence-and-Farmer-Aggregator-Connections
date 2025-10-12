import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Define styles and wrappers locally or import them
const COLOR_PRIMARY = 'bg-green-600'; 
const COLOR_PRIMARY_HOVER = 'hover:bg-green-700';

const AuthPageWrapper = ({ children, setView, title }) => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-sm p-6 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <button 
                onClick={() => setView('home')} 
                className="flex items-center text-gray-600 hover:text-green-600 transition text-sm font-medium"
            >
                {/* SVG for Back to Home Arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>
            <h2 className={`text-2xl font-bold text-green-800 text-center`}>{title}</h2>
            {children}
        </div>
    </div>
);

const SignUpForm = ({ auth, db, setView, showNotification }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'farmer' });
    const [isLoading, setIsLoading] = useState(false);
    const appId = '1:586273255769:web:e6402eee543e86c602dc48'; // Use a placeholder for local testing

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleRoleChange = (role) => setFormData({ ...formData, role });

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { name, email, password, role } = formData;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/user_profile`, 'profile');
            await setDoc(userDocRef, {
                uid: user.uid, name, email, role, createdAt: new Date().toISOString()
            });

            showNotification("Account created successfully! You are now logged in.", 'success');
            setView('dashboard'); 

        } catch (error) {
            console.error("Sign Up Error:", error);
            showNotification(`Sign up failed: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        { key: 'farmer', title: 'Farmer', description: 'Sell your produce' },
        { key: 'aggregator', title: 'Aggregator', description: 'Buy from farmers' },
        { key: 'admin', title: 'Admin', description: 'Manage platform' },
    ];

    return (
        <AuthPageWrapper setView={setView} title="Create Account">
            <p className="text-sm text-gray-500 text-center -mt-4">Join our farm marketplace platform</p>
            <form onSubmit={handleSignUp} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mt-2">I am a:</label>
                <div className="space-y-3">
                    {roleOptions.map((option) => (
                        <label 
                            key={option.key} 
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                                formData.role === option.key 
                                ? 'border-green-600 bg-green-50 shadow-sm' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="radio" name="role" value={option.key} checked={formData.role === option.key} 
                                onChange={() => handleRoleChange(option.key)} 
                                className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                                style={{ accentColor: '#10B981' }} 
                                required
                            />
                            <div className="ml-3">
                                <span className="text-base font-semibold text-gray-800">{option.title}</span>
                                <p className="text-xs text-gray-500">{option.description}</p>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Input fields for name, email, password */}
                {['name', 'email', 'password'].map((field) => (
                    <input
                        key={field}
                        type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                        name={field}
                        placeholder={field === 'name' ? 'Full Name' : field === 'email' ? 'Email' : 'Password'}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
                        required
                    />
                ))}

                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white transition duration-300 shadow-md ${COLOR_PRIMARY} ${COLOR_PRIMARY_HOVER} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p className="text-sm text-center text-gray-500">
                Already have an account? <button onClick={() => setView('login')} className="text-green-600 hover:text-green-700 font-bold transition">Sign in</button>
            </p>
        </AuthPageWrapper>
    );
};

export default SignUpForm;
