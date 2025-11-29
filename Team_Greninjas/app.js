// Sample hospital data
const hospitals = [
    {
        id: 1,
        name: "City General Hospital",
        location: "Downtown, City Center",
        beds: { available: 45, total: 100, status: "available" },
        icu: { available: 8, total: 15, status: "available" },
        oxygen: { available: 120, total: 150, status: "available" },
        opdQueue: 12,
        emergencyWait: 5,
        status: "live"
    },
    {
        id: 2,
        name: "Metro Medical Center",
        location: "North District",
        beds: { available: 12, total: 80, status: "limited" },
        icu: { available: 2, total: 12, status: "limited" },
        oxygen: { available: 45, total: 100, status: "available" },
        opdQueue: 28,
        emergencyWait: 15,
        status: "busy"
    },
    {
        id: 3,
        name: "Community Health Clinic",
        location: "East Side",
        beds: { available: 0, total: 50, status: "full" },
        icu: { available: 0, total: 8, status: "full" },
        oxygen: { available: 15, total: 60, status: "limited" },
        opdQueue: 45,
        emergencyWait: 30,
        status: "critical"
    },
    {
        id: 4,
        name: "Regional Hospital",
        location: "West End",
        beds: { available: 78, total: 150, status: "available" },
        icu: { available: 12, total: 20, status: "available" },
        oxygen: { available: 200, total: 250, status: "available" },
        opdQueue: 8,
        emergencyWait: 3,
        status: "live"
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('hospitalDashboard')) {
        renderHospitalDashboard();
        startRealTimeUpdates();
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Mode toggle
    const modeSwitch = document.getElementById('modeSwitch');
    if (modeSwitch) {
        modeSwitch.addEventListener('change', function() {
            const modeLabel = document.querySelector('.mode-label');
            if (modeLabel) {
                modeLabel.textContent = this.checked ? 'Animal Healthcare' : 'Human Healthcare';
            }
        });
    }

    // Initialize page-specific functions
    if (document.getElementById('hospitalSearch')) {
        initializeSearch();
    }
});

// Render hospital dashboard
function renderHospitalDashboard() {
    const dashboard = document.getElementById('hospitalDashboard');
    if (!dashboard) return;

    dashboard.innerHTML = hospitals.map(hospital => `
        <div class="hospital-card">
            <div class="hospital-header">
                <div>
                    <div class="hospital-name">
                        <span class="status-indicator ${hospital.status}"></span>
                        ${hospital.name}
                    </div>
                    <div class="hospital-location">
                        <i class="fas fa-map-marker-alt"></i> ${hospital.location}
                    </div>
                </div>
            </div>
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-icon"><i class="fas fa-bed"></i></div>
                    <div class="metric-label">Beds Available</div>
                    <div class="metric-value">${hospital.beds.available}/${hospital.beds.total}</div>
                    <span class="status-badge ${hospital.beds.status}">${hospital.beds.status}</span>
                </div>
                <div class="metric-item">
                    <div class="metric-icon"><i class="fas fa-procedures"></i></div>
                    <div class="metric-label">ICU Available</div>
                    <div class="metric-value">${hospital.icu.available}/${hospital.icu.total}</div>
                    <span class="status-badge ${hospital.icu.status}">${hospital.icu.status}</span>
                </div>
                <div class="metric-item">
                    <div class="metric-icon"><i class="fas fa-wind"></i></div>
                    <div class="metric-label">Oxygen (L)</div>
                    <div class="metric-value">${hospital.oxygen.available}/${hospital.oxygen.total}</div>
                    <span class="status-badge ${hospital.oxygen.status}">${hospital.oxygen.status}</span>
                </div>
                <div class="metric-item">
                    <div class="metric-icon"><i class="fas fa-users"></i></div>
                    <div class="metric-label">OPD Queue</div>
                    <div class="metric-value">${hospital.opdQueue}</div>
                    <span class="status-badge ${hospital.opdQueue > 30 ? 'full' : hospital.opdQueue > 15 ? 'limited' : 'available'}">
                        ${hospital.opdQueue > 30 ? 'Long' : hospital.opdQueue > 15 ? 'Moderate' : 'Short'}
                    </span>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--gray); font-size: 0.9rem;">
                        <i class="fas fa-clock"></i> Emergency Wait: ${hospital.emergencyWait} min
                    </span>
                    <button class="btn btn-primary" onclick="viewHospital(${hospital.id})" style="padding: 8px 20px; font-size: 0.9rem;">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        hospitals.forEach(hospital => {
            // Simulate real-time changes
            if (Math.random() > 0.7) {
                if (hospital.beds.available > 0 && Math.random() > 0.5) {
                    hospital.beds.available = Math.max(0, hospital.beds.available - 1);
                } else if (hospital.beds.available < hospital.beds.total) {
                    hospital.beds.available = Math.min(hospital.beds.total, hospital.beds.available + 1);
                }
                
                if (hospital.icu.available > 0 && Math.random() > 0.5) {
                    hospital.icu.available = Math.max(0, hospital.icu.available - 1);
                } else if (hospital.icu.available < hospital.icu.total) {
                    hospital.icu.available = Math.min(hospital.icu.total, hospital.icu.available + 1);
                }

                hospital.opdQueue = Math.max(0, hospital.opdQueue + Math.floor(Math.random() * 3) - 1);
                hospital.emergencyWait = Math.max(0, hospital.emergencyWait + Math.floor(Math.random() * 3) - 1);

                // Update status badges
                hospital.beds.status = hospital.beds.available === 0 ? 'full' : 
                                      hospital.beds.available < hospital.beds.total * 0.3 ? 'limited' : 'available';
                hospital.icu.status = hospital.icu.available === 0 ? 'full' : 
                                      hospital.icu.available < hospital.icu.total * 0.3 ? 'limited' : 'available';
                hospital.oxygen.status = hospital.oxygen.available < hospital.oxygen.total * 0.2 ? 'limited' : 'available';
            }
        });
        renderHospitalDashboard();
    }, 5000); // Update every 5 seconds
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('hospitalSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchHospitals();
            }
        });
    }
}

function searchHospitals() {
    const searchTerm = document.getElementById('hospitalSearch').value.toLowerCase();
    if (!searchTerm) {
        showAlert('Please enter a search term', 'warning');
        return;
    }
    
    const filteredHospitals = hospitals.filter(h => 
        h.name.toLowerCase().includes(searchTerm) || 
        h.location.toLowerCase().includes(searchTerm)
    );
    
    if (filteredHospitals.length === 0) {
        showAlert('No hospitals found matching your search', 'info');
        window.location.href = 'hospital-profiles.html?search=' + encodeURIComponent(searchTerm);
    } else {
        window.location.href = 'hospital-profiles.html?search=' + encodeURIComponent(searchTerm);
    }
}

// Navigation
function navigateTo(page) {
    window.location.href = page;
}

function viewHospital(id) {
    window.location.href = `hospital-profiles.html?id=${id}`;
}

// Alert system
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'danger' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Google Maps initialization
function initMap(lat = 28.6139, lng = 77.2090, zoom = 12) {
    // This function will be called when Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat, lng },
            zoom: zoom
        });

        // Add markers for hospitals
        hospitals.forEach(hospital => {
            const marker = new google.maps.Marker({
                position: { lat: lat + (Math.random() - 0.5) * 0.1, lng: lng + (Math.random() - 0.5) * 0.1 },
                map: map,
                title: hospital.name
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h3 style="margin: 0 0 10px 0; color: var(--primary-blue);">${hospital.name}</h3>
                        <p style="margin: 5px 0;"><strong>Beds:</strong> ${hospital.beds.available}/${hospital.beds.total}</p>
                        <p style="margin: 5px 0;"><strong>ICU:</strong> ${hospital.icu.available}/${hospital.icu.total}</p>
                        <p style="margin: 5px 0;"><strong>Emergency Wait:</strong> ${hospital.emergencyWait} min</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        });
    } else {
        // Fallback if Google Maps API is not loaded
        document.getElementById('map').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: var(--light-gray); color: var(--gray);">
                <div style="text-align: center;">
                    <i class="fas fa-map" style="font-size: 3rem; margin-bottom: 10px; color: var(--primary-blue);"></i>
                    <p>Map will load here. Please add your Google Maps API key.</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">To enable maps, add: &lt;script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"&gt;&lt;/script&gt;</p>
                </div>
            </div>
        `;
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--danger)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 3000);
        }
    });

    return isValid;
}

// Local storage helpers
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

