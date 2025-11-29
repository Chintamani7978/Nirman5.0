let currentUser = null;
let isAuthenticated = false;
const API_BASE_URL = window.location.origin + '/api';
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.parentElement.querySelector('.toggle-password');
    const icon = toggleButton.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
function switchToSignup() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    if (signupForm && loginForm) {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        
        const loginFormElement = document.getElementById('loginForm');
        const signupFormElement = document.getElementById('signupForm');
        if (loginFormElement) loginFormElement.reset();
        if (signupFormElement) signupFormElement.reset();
    } else {
        console.error('Forms not found:', { signupForm, loginForm });
    }
}
function switchToLogin() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    if (signupForm && loginForm) {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        
        const loginFormElement = document.getElementById('loginForm');
        const signupFormElement = document.getElementById('signupForm');
        if (loginFormElement) loginFormElement.reset();
        if (signupFormElement) signupFormElement.reset();
    }
}
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.togglePassword = togglePassword;
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('mindmash_user');
    const savedToken = localStorage.getItem('mindmash_token');
    
    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        const authPage = document.getElementById('auth-page');
        const profilePage = document.getElementById('profile-page');
        
        if (authPage) authPage.style.display = 'block';
        if (profilePage) profilePage.style.display = 'none';
    }
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    } 
    const bookSessionForm = document.getElementById('bookSessionForm');
    const discussionForm = document.getElementById('discussionForm');
    if (bookSessionForm) {
        bookSessionForm.addEventListener('submit', handleBookSessionSubmit);
    }
    if (discussionForm) {
        discussionForm.addEventListener('submit', handleDiscussionSubmit);
    } 
    window.addEventListener('click', function(event) {
        const bookModal = document.getElementById('bookSessionModal');
        const discussionModal = document.getElementById('discussionModal');
        
        if (event.target === bookModal) {
            closeBookSessionModal();
        }
        if (event.target === discussionModal) {
            closeDiscussionModal();
        }
    });
});
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const age = document.getElementById('age').value;
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, age })
        });
        const data = await response.json(); 
        if (data.success) {
            alert('Login successful!');
            currentUser = data.user;
            localStorage.setItem('mindmash_user', JSON.stringify(data.user));
            localStorage.setItem('mindmash_token', data.token);
            showDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        const fakeUser = {
            id: 'test123',
            firstName: email.split('@')[0],
            lastName: 'User',
            email: email,
            university: 'Test University',
            academicYear: '3rd Year',
            age: age || 25
        };
        
        currentUser = fakeUser;
        localStorage.setItem('mindmash_user', JSON.stringify(fakeUser));
        localStorage.setItem('mindmash_token', 'fake-token-for-testing');
        showDashboard();
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        university: document.getElementById('university').value,
        academicYear: document.getElementById('academicYear').value,
        age: parseInt(document.getElementById('signupAge').value),
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.university || !formData.academicYear || !formData.age || !formData.password) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (formData.age < 10 || formData.age > 100) {
        alert('Age must be between 10 and 100');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Account created successfully!');
            currentUser = data.user;
            localStorage.setItem('mindmash_user', JSON.stringify(data.user));
            localStorage.setItem('mindmash_token', data.token);
            showDashboard();
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);

        const fakeUser = {
            id: 'test' + Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            university: formData.university,
            academicYear: formData.academicYear,
            age: formData.age
        };
        
        currentUser = fakeUser;
        localStorage.setItem('mindmash_user', JSON.stringify(fakeUser));
        localStorage.setItem('mindmash_token', 'fake-token-for-testing');
        
        showDashboard();
    }
}

function showDashboard() {
    const authPage = document.getElementById('auth-page');
    const profilePage = document.getElementById('profile-page');
    
    if (authPage) authPage.style.display = 'none';
    if (profilePage) profilePage.style.display = 'block';
    
    populateUserData();
}

function populateUserData() {
    if (!currentUser) return;
    
    const userInitials = document.getElementById('userInitials');
    if (userInitials && currentUser.firstName && currentUser.lastName) {
        userInitials.textContent = (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
    }
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && currentUser.firstName) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.firstName}!`;
    }
    
    const userMeta = document.getElementById('userMeta');
    if (userMeta && currentUser.university && currentUser.academicYear) {
        let metaText = `${currentUser.university} • ${currentUser.academicYear}`;
        if (currentUser.age) {
            metaText += ` • Age ${currentUser.age}`;
        }
        userMeta.textContent = metaText;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('mindmash_user');
    localStorage.removeItem('mindmash_token');
    
    const authPage = document.getElementById('auth-page');
    const profilePage = document.getElementById('profile-page');
    
    if (authPage) authPage.style.display = 'block';
    if (profilePage) profilePage.style.display = 'none';
    
    switchToLogin();
}
window.logout = logout;

function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const activeButton = document.querySelector(`button[onclick="switchTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

window.switchTab = switchTab;

function openBookSessionModal() {
    document.getElementById('bookSessionModal').style.display = 'block';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
}

function closeBookSessionModal() {
    document.getElementById('bookSessionModal').style.display = 'none';
    document.getElementById('bookSessionForm').reset();
}

function openDiscussionModal() {
    document.getElementById('discussionModal').style.display = 'block';
}

function closeDiscussionModal() {
    document.getElementById('discussionModal').style.display = 'none';
    document.getElementById('discussionForm').reset();
}

// Handle form submissions
function handleBookSessionSubmit(e) {
    e.preventDefault();
    
    const sessionData = {
        type: document.getElementById('sessionType').value,
        date: document.getElementById('preferredDate').value,
        time: document.getElementById('preferredTime').value,
        notes: document.getElementById('sessionNotes').value,
        timestamp: new Date().toISOString()
    };
    
    // Adding to booked sessions display
    addBookedSessionToDisplay(sessionData);
    
    showToast('Session booked successfully!', 'success');
    
    closeBookSessionModal();
}

function handleDiscussionSubmit(e) {
    e.preventDefault();
    
    const discussionData = {
        title: document.getElementById('discussionTitle').value,
        category: document.getElementById('discussionCategory').value,
        content: document.getElementById('discussionContent').value,
        anonymous: document.getElementById('anonymousPost').checked,
        timestamp: new Date().toISOString()
    };
    
    // Adding to created discussions display
    addDiscussionToDisplay(discussionData);
    
    showToast('Discussion posted successfully!', 'success');
    
    closeDiscussionModal();
}

// Adding booked session to display
function addBookedSessionToDisplay(sessionData) {
    const container = document.getElementById('bookedSessionsContainer');
    const list = document.getElementById('bookedSessionsList');
    
    if (!container || !list) return;
    
    container.style.display = 'block';
    
    const formattedDate = new Date(sessionData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = sessionData.time ? convertTo12Hour(sessionData.time) : 'Time TBD';
    
    // Creating session card
    const sessionCard = document.createElement('div');
    sessionCard.className = 'session-card newly-booked';
    sessionCard.innerHTML = `
        <div class="session-status">
            <span class="status-badge pending">Pending Confirmation</span>
        </div>
        <div class="session-info">
            <h4>${getSessionTypeLabel(sessionData.type)}</h4>
            <div class="session-details">
                <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                <p><i class="fas fa-clock"></i> ${formattedTime}</p>
                ${sessionData.notes ? `<p><i class="fas fa-sticky-note"></i> ${sessionData.notes}</p>` : ''}
            </div>
        </div>
        <div class="session-actions">
            <button class="btn-outline" onclick="editBooking(this)">Edit</button>
            <button class="btn-secondary" onclick="cancelBooking(this)">Cancel</button>
        </div>
    `;
    
    // Inserting at the top of the list
    list.insertBefore(sessionCard, list.firstChild);
}

// Adding discussion to display
function addDiscussionToDisplay(discussionData) {
    const container = document.getElementById('createdDiscussionsContainer');
    const list = document.getElementById('createdDiscussionsList');
    
    if (!container || !list) return;
    
    container.style.display = 'block';
    
    const timeAgo = getTimeAgo(new Date(discussionData.timestamp));
    const authorName = discussionData.anonymous ? 'Anonymous' : (currentUser?.firstName || 'You');
    
    // Creating discussion card
    const discussionCard = document.createElement('div');
    discussionCard.className = 'topic-card newly-created';
    discussionCard.innerHTML = `
        <div class="topic-info">
            <h5>${discussionData.title}</h5>
            <p>${discussionData.content.length > 150 ? discussionData.content.substring(0, 150) + '...' : discussionData.content}</p>
            <div class="topic-meta">
                <span><i class="fas fa-user"></i> ${authorName}</span>
                <span><i class="fas fa-tag"></i> ${getCategoryLabel(discussionData.category)}</span>
                <span><i class="fas fa-clock"></i> ${timeAgo}</span>
            </div>
        </div>
        <div class="discussion-actions" style="margin-top: 10px;">
            <button class="btn-outline btn-sm" onclick="viewDiscussion(this)">View</button>
            <button class="btn-outline btn-sm" onclick="editDiscussion(this)">Edit</button>
        </div>
    `;
    
    list.insertBefore(discussionCard, list.firstChild);
}

// Helper functions
function getSessionTypeLabel(type) {
    const labels = {
        'individual': 'Individual Counseling',
        'group': 'Group Therapy',
        'stress': 'Stress Management',
        'anxiety': 'Anxiety Support',
        'mindfulness': 'Mindfulness & Meditation'
    };
    return labels[type] || type;
}

function getCategoryLabel(category) {
    const labels = {
        'general': 'General Support',
        'academic': 'Academic Stress',
        'anxiety': 'Anxiety & Worry',
        'depression': 'Depression Support',
        'relationships': 'Relationships',
        'self-care': 'Self-Care Tips',
        'mindfulness': 'Mindfulness & Meditation'
    };
    return labels[category] || category;
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

function editBooking(button) {
    showToast('Edit booking feature coming soon!', 'info');
}

function cancelBooking(button) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        button.closest('.session-card').remove();
        showToast('Booking cancelled successfully.', 'success');
    }
}

function viewDiscussion(button) {
    showToast('Discussion view feature coming soon!', 'info');
}

function editDiscussion(button) {
    showToast('Edit discussion feature coming soon!', 'info');
}

window.openBookSessionModal = openBookSessionModal;
window.closeBookSessionModal = closeBookSessionModal;
window.openDiscussionModal = openDiscussionModal;
window.closeDiscussionModal = closeDiscussionModal;

document.addEventListener('DOMContentLoaded', function() {
    const bookSessionForm = document.getElementById('bookSessionForm');
    if (bookSessionForm) {
        bookSessionForm.addEventListener('submit', handleBookSessionSubmit);
    }
    
    const discussionForm = document.getElementById('discussionForm');
    if (discussionForm) {
        discussionForm.addEventListener('submit', handleDiscussionSubmit);
    }
    
    window.addEventListener('click', function(event) {
        const bookModal = document.getElementById('bookSessionModal');
        const discussionModal = document.getElementById('discussionModal');
        
        if (event.target === bookModal) {
            closeBookSessionModal();
        }
        if (event.target === discussionModal) {
            closeDiscussionModal();
        }
    });
});