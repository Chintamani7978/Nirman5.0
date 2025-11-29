import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const SmartYatra = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);

 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = rgba(255, 255, 255, ${Math.random() * 0.4});
        this.originalSize = this.size;
      }
      
      update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            this.size = this.originalSize * 2;
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
          } else {
            this.size = this.originalSize;
          }
        }
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    
    const mouse = {
      x: null,
      y: null
    };
    
    canvas.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });
    
    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 0;
      particles.forEach(particle => {
        particle.update(mouse);
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    // You can add navigation logic here
    console.log(Selected mode: ${mode});
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      
      {/* Centered Main Content */}
      <main className="main-content-centered">
        {/* Logo Section */}
        <div className="logo-section">
          <div 
            className="logo-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={logo-icon ${isHovered ? 'hovered' : ''}}>
              🚌
            </div>
            <h1 className="main-logo">SMART YATRA</h1>
            <p className="tagline">Your Premium Travel Experience</p>
          </div>
        </div>

        {/* Mode Selection Section */}
        <div className="mode-selection-section">
          <div className="mode-selection-card">
            <h2 className="selection-title">Choose Your Journey</h2>
            <p className="selection-subtitle">Select how you want to travel with us</p>
            
            <div className="mode-buttons-container">
              <div 
                className={mode-card ${selectedMode === 'driver' ? 'selected' : ''}}
                onClick={() => handleModeSelect('driver')}
                onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
              >
                <div className="mode-icon">🚌</div>
                <h3 className="mode-title">DRIVER</h3>
                <p className="mode-description">Partner with us and earn on your schedule</p>
                <div className="mode-features">
                  <span>• Flexible hours</span>
                  <span>• Good earnings</span>
                  <span>• Weekly payments</span>
                </div>
                <div className="select-indicator">
                  {selectedMode === 'driver' ? '✓ SELECTED' : 'SELECT'}
                </div>
              </div>

              <div 
                className={mode-card ${selectedMode === 'user' ? 'selected' : ''}}
                onClick={() => handleModeSelect('user')}
                onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
              >
                <div className="mode-icon">👤</div>
                <h3 className="mode-title">PASSENGER</h3>
                <p className="mode-description">Travel comfortably with premium service</p>
                <div className="mode-features">
                  <span>• Safe rides</span>
                  <span>• Premium vehicles</span>
                  <span>• 24/7 availability</span>
                </div>
                <div className="select-indicator">
                  {selectedMode === 'user' ? '✓ SELECTED' : 'SELECT'}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            {selectedMode && (
              <button className="continue-btn">
                Continue as {selectedMode === 'driver' ? 'Driver' : 'Passenger'}
                <span className="arrow">→</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="minimal-footer">
        <p>© 2025 SMART YATRA • Premium Travel Services</p>
      </footer>
    </div>
  );
};

export default SmartYatra;