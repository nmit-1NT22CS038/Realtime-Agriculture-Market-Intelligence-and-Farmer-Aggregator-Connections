import React from "react";
import heroFarm from "../assets/hero-farm.jpg";
import farmerHands from "../assets/farmer-hands.jpg";
import freshProduce from "../assets/fresh-produce.jpg";

const LandingPage = ({ setView }) => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* 🌾 Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-extrabold text-green-700">AgriLink</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setView("login")}
            className="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-semibold transition"
          >
            Login
          </button>
          <button
            onClick={() => setView("signup")}
            className="px-5 py-2 rounded-lg border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold transition"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* 🌱 Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12">
        <div className="max-w-xl space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
            Connecting Farmers & Aggregators — <br /> Empowering Agriculture 🌾
          </h2>
          <p className="text-gray-600 text-lg">
            AgriLink helps farmers get better prices and aggregators source fresh produce efficiently. 
            Join our growing network and make agriculture smarter and sustainable.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setView("signup")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => setView("login")}
              className="px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="mt-10 md:mt-0 flex-shrink-0">
          <img
            src={heroFarm}
            alt="Farm Hero"
            className="w-full max-w-lg rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* 🥦 Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-8 md:px-16 py-12 bg-white">
        <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <img
            src={farmerHands}
            alt="Farmer Hands"
            className="rounded-lg mb-4 w-full h-48 object-cover"
          />
          <h3 className="text-lg font-bold text-green-800 mb-2">For Farmers</h3>
          <p className="text-gray-600">
            Sell your crops directly and predict prices easily using our smart AI tools.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <img
            src={freshProduce}
            alt="Fresh Produce"
            className="rounded-lg mb-4 w-full h-48 object-cover"
          />
          <h3 className="text-lg font-bold text-green-800 mb-2">For Aggregators</h3>
          <p className="text-gray-600">
            Buy directly from trusted farmers and track your purchases efficiently.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <img
            src={heroFarm}
            alt="Admin Dashboard"
            className="rounded-lg mb-4 w-full h-48 object-cover"
          />
          <h3 className="text-lg font-bold text-green-800 mb-2">For Admins</h3>
          <p className="text-gray-600">
            Manage users, monitor transactions, and ensure platform reliability with ease.
          </p>
        </div>
      </section>

      {/* 🌿 Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 bg-green-100 mt-auto">
        © {new Date().getFullYear()} AgriLink. Empowering agriculture for a better tomorrow.
      </footer>
    </div>
  );
};

export default LandingPage;
