import React from "react";
import heroFarm from "../assets/hero-farm.jpg";
import freshProduce from "../assets/fresh-produce.jpg";
import farmerHands from "../assets/farmer-hands.jpg";

const LandingPage = ({ setView }) => {
  return (
    <div className="w-full font-sans text-gray-800">

      {/* --- Hero Section --- */}
      <section
        className="relative h-screen flex items-center justify-center text-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${heroFarm})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            Empowering Farmers,<br />Connecting Markets
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-100 drop-shadow-md">
            Sell your produce directly to buyers and access real-time market insights.
          </p>
          <button
            onClick={() => setView("signup")}
            className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🌱", title: "For Farmers", desc: "List your produce, set prices, and connect with buyers in your area." },
              { icon: "👥", title: "For Aggregators", desc: "Browse available produce, negotiate deals, and streamline your supply chain." },
              { icon: "📈", title: "Smart Pricing", desc: "Access price predictions and market insights to make informed decisions." },
            ].map((step, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-20">

          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="h-96 w-full rounded-xl shadow-2xl bg-gray-200 bg-cover bg-center"
              style={{ backgroundImage: `url(${freshProduce})` }}
            ></div>
            <div className="space-y-4 p-4 lg:p-0">
              <h3 className="text-4xl font-bold text-green-800">Fresh, Quality Produce</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Farmers can showcase their best produce, and buyers can source exactly what they need.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 p-4 lg:p-0 lg:order-2">
              <h3 className="text-4xl font-bold text-green-800">Empowering Farmers</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fair prices, transparent transactions, and lasting relationships between farmers and buyers.
              </p>
            </div>
            <div
              className="h-96 w-full rounded-xl shadow-2xl bg-gray-200 bg-cover bg-center lg:order-1"
              style={{ backgroundImage: `url(${farmerHands})` }}
            ></div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 bg-green-600 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-5xl font-extrabold">Ready to Get Started?</h2>
          <p className="text-xl text-green-100">
            Join our community of farmers and aggregators today!
          </p>
          <button
            onClick={() => setView("signup")}
            className="mt-6 px-10 py-4 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform transition duration-300 hover:scale-105"
          >
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
