import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import FarmerDashboard from "./components/FarmerDashboard"; // Add this import
import SubsidyCalculator from "./components/SubsidyCalculator";
import ProductsManager from "./components/ProductsManager";
import ProductUpload from "./components/ProductUpload";
import Marketplace from "./components/Marketplace";
import AISchemes from "./components/AISchemes";
import Modal from "./components/Modal";
import { User, ModalContent } from "./types";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = () => {
      try {
        const farmerName = sessionStorage.getItem("farmerName");
        const farmerData = sessionStorage.getItem("farmerData");
        const aadhaar = sessionStorage.getItem('aadhaars');

        if (farmerName && aadhaar) {
          const userData = farmerData
            ? JSON.parse(farmerData)
            : {
                name: farmerName,
                landSize: 3.2,
                annualIncome: 250000,
                cropType: "wheat",
                aadhaar: aadhaar,
              };

          setCurrentUser(userData);
          setIsAuthenticated(true);
          
          // Store aadhaar for FarmerDashboard
          localStorage.setItem('farmerAadhaar', aadhaar);
        } else {
          // If not authenticated, redirect to login.html
          window.location.href = "/login.html";
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        window.location.href = "/login.html";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Create floating particles only after authentication
    if (isAuthenticated) {
      createParticles();
    }
  }, [isAuthenticated]);

  const createParticles = () => {
    const particles = document.getElementById("particles");
    if (!particles) return;

    // Clear existing particles
    particles.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.width = particle.style.height =
        Math.random() * 10 + 5 + "px";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.animationDuration = Math.random() * 3 + 3 + "s";
      particles.appendChild(particle);
    }
  };

  const showModal = (content: ModalContent) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      localStorage.removeItem('farmerAadhaar');
      // Redirect to login page after logout
      window.location.href = "/login.html";
    }
  };

  // Update the renderTabContent function to include FarmerDashboard
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case "dashboard":
        return <Dashboard currentUser={currentUser} />;
      case "orders-revenue": // New tab for FarmerDashboard
        return <FarmerDashboard />;
      case "subsidy":
        return (
          <SubsidyCalculator currentUser={currentUser} showModal={showModal} />
        );
      case "products":
        return (
          <ProductsManager
            currentUser={currentUser}
            showModal={showModal}
          />
        );
      case "upload":
        return (
          <ProductUpload
            currentUser={currentUser}
            onSuccess={() => setActiveTab("products")}
          />
        );
      case "marketplace":
        return <Marketplace showModal={showModal} />;
      case "ai-schemes":
        return <AISchemes currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

 // Show loading while checking authentication
if (isLoading) {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"   // <-- put your loading image in /public folder
        alt="Loading..."
        className="w-20 h-20"
      />
      <p className="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  );
}


  // If not authenticated, this won't render as we redirect to login.html
  return (
    <div className="app">
      <div id="particles"></div>

      {currentUser && (
        <Header currentUser={currentUser} onLogout={handleLogout} />
      )}

      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        currentUser={currentUser} 
      />

      <main className="main-content">{renderTabContent()}</main>

      {modalContent && <Modal content={modalContent} onClose={closeModal} />}
    </div>
  );
}

export default App;