import AuthService from '../components/authService.js';

class AdopterProfile {
    constructor() {
        this.user = null;

        // DOM Elements
        this.profilePic = document.getElementById('profilePic');
        this.navbarProfilePic = document.getElementById('navbarProfilePic');

        this.initialize();
    }

    async initialize() {
        // Check for user authentication
        const token = AuthService.getToken();
        if (!token) {
            window.location.href = '/frontend/pages/login-form.html';
            return;
        }

        try {
            // Fetch user data from backend (or get from localStorage)
            // For now, we'll use localStorage as a fallback
            this.user = JSON.parse(localStorage.getItem('currentUser'));
            if (!this.user) throw new Error('User not found');

            this.populateProfileData();
        } catch (error) {
            console.error('Initialization failed:', error);
            // Redirect to login if user data is corrupt or missing
            AuthService.logout();
            window.location.href = '/frontend/pages/login-form.html';
        }
    }

    populateProfileData() {
        if (!this.user) return;

        // Populate text and input fields
        document.getElementById('profileDisplayName').textContent = `${this.user.first_name} ${this.user.last_name}`;
        document.getElementById('navbarUserName').textContent = `${this.user.first_name} ${this.user.last_name}`;
        document.getElementById('dropdownUserName').textContent = `${this.user.first_name} ${this.user.last_name}`;

        // View mode elements
        document.getElementById('viewUserFirstName').textContent = this.user.first_name || 'N/A';
        document.getElementById('viewUserLastName').textContent = this.user.last_name || 'N/A';
        document.getElementById('viewUserEmail').textContent = this.user.email || 'N/A';
        document.getElementById('viewUserPhone').textContent = this.user.phone || 'N/A';
        document.getElementById('viewUserAddress').textContent = this.user.address || 'Not provided';
        document.getElementById('viewUserBio').textContent = this.user.bio || 'No bio yet.';
        document.getElementById('viewLivingSituation').textContent = this.user.living_situation?.replace('_', ' ') || 'N/A';

        // Profile picture
        const profileImageUrl = this.user.profile_image || '/frontend/assets/image/photo/BoyIcon.jpg';
        this.profilePic.src = profileImageUrl;
        this.navbarProfilePic.src = profileImageUrl;
    }
}

new AdopterProfile();