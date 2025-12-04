// Dashboard page locations - UPDATED FOR YOUR FOLDER STRUCTURE
const DASHBOARD_PATHS = {
    // Assuming the dashboard pages are inside their respective folders
    adopter: 'adopters/adopter-dashboard.html',
    volunteer: 'volunteer/volunteer-dashboard.html',
    staff: 'staff/staff-dashboard.html'
};

// Form switching logic
document.addEventListener('DOMContentLoaded', function() {
    // --- LOGIN FORM SWITCHING ---
    // Map of all role switching buttons
    const roleButtons = {
        'Adopters': ['loginBtnAdopters', 'loginBtnAdopters2', 'loginBtnAdopters3'],
        'Volunteer': ['loginBtnVolunteer', 'loginBtnVolunteer2', 'loginBtnVolunteer3'],
        'Staff': ['loginBtnStaff', 'loginBtnStaff2', 'loginBtnStaff3']
    };
    
    // Switch between login forms
    function showForm(formType) {
        // Hide all forms
        document.getElementById('loginFormAdopters').classList.add('d-none');
        document.getElementById('loginFormVolunteer').classList.add('d-none');
        document.getElementById('loginFormStaff').classList.add('d-none');
        
        // Show selected form
        document.getElementById(`loginForm${formType.charAt(0).toUpperCase() + formType.slice(1)}`).classList.remove('d-none');
        
        // Update button styles for all button groups
        updateButtonStyles(formType);
    }
    
    function updateButtonStyles(activeType) {
        const buttonConfigs = [
            { adopters: 'loginBtnAdopters', volunteer: 'loginBtnVolunteer', staff: 'loginBtnStaff' },
            { adopters: 'loginBtnAdopters2', volunteer: 'loginBtnVolunteer2', staff: 'loginBtnStaff2' },
            { adopters: 'loginBtnAdopters3', volunteer: 'loginBtnVolunteer3', staff: 'loginBtnStaff3' }
        ];
        
        buttonConfigs.forEach(buttons => {
            Object.keys(buttons).forEach(type => {
                const btn = document.getElementById(buttons[type]);
                if (btn) {
                    if (type === activeType.toLowerCase()) {
                        btn.classList.remove('btn-outline-dark');
                        btn.classList.add('btn-dark');
                    } else {
                        btn.classList.remove('btn-dark');
                        btn.classList.add('btn-outline-dark');
                    }
                }
            });
        });
    }
    
    // Add event listeners to all role switching buttons
    Object.entries(roleButtons).forEach(([role, buttonIds]) => {
        buttonIds.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => showForm(role));
            }
        });
    });
    
    // --- LOGIN FORM SUBMISSION ---
    document.getElementById('loginFormAdopter')?.addEventListener('submit', handleAdopterLogin);
    document.getElementById('loginFormVolunteer')?.addEventListener('submit', handleVolunteerLogin);
    document.getElementById('loginFormStaff')?.addEventListener('submit', handleStaffLogin);

    // --- REGISTRATION FORM SUBMISSION ---
    document.getElementById('signupForm')?.addEventListener('submit', handleAdopterRegistration);
    document.querySelector('.js-volunteer-signup')?.addEventListener('submit', handleVolunteerRegistration);
    document.getElementById('js-staff-signup')?.addEventListener('submit', handleStaffRegistration);
});

// =================================================================================
// REGISTRATION HANDLERS
// =================================================================================

async function handleAdopterRegistration(e) {
    e.preventDefault();
    await handleRegistration(e.target, 'adopter', 'signupMessage');
}

async function handleVolunteerRegistration(e) {
    e.preventDefault();
    await handleRegistration(e.target, 'volunteer', 'volunteerSignupMessage');
}

async function handleStaffRegistration(e) {
    e.preventDefault();
    await handleRegistration(e.target, 'staff', 'staffSignupMessage');
}

/**
 * Generic function to handle registration for all user types.
 * @param {HTMLFormElement} form - The form element being submitted.
 * @param {string} userType - The type of user ('adopter', 'volunteer', 'staff').
 * @param {string} messageDivId - The ID of the div to display messages in.
 */
async function handleRegistration(form, userType, messageDivId) {
    const messageDiv = document.getElementById(messageDivId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Consolidate checkbox values into arrays
    data.pet_experience = formData.getAll('pet_experience');
    data.adopter_consents = formData.getAll('adopter_consents');
    data.availability = formData.getAll('availability');
    data.interested_activities = formData.getAll('interested_activities');
    data.volunteer_consents = formData.getAll('volunteer_consents');
    data.staff_consents = formData.getAll('staff_consents');

    // Add user_type to the data payload
    data.user_type = userType;

    // Rename fields to match a consistent backend API if needed
    // Example: backend expects 'first_name', but form has 'adopter_first_name'
    data.first_name = data[`${userType}_first_name`] || data.first_name;
    data.last_name = data[`${userType}_last_name`] || data.last_name;
    data.email = data[`${userType}_email`] || data.email;
    data.password = data[`${userType}_password`] || data.password;
    data.phone_number = data[`${userType}_phone_number`] || data.volunteer_phone || data.staff_phone;

    try {
        showMessage(messageDiv, 'Registering...', 'loading');

        const response = await fetch('/api/auth/register', { // Assuming this is your registration endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Registration successful! Please log in.', 'success');
            form.reset();
            // Optional: Redirect to login page after a delay
            setTimeout(() => {
                window.location.href = '/frontend/pages/login-form.html';
            }, 2000);
        } else {
            // Display the specific error from the backend (e.g., "Email already in use")
            showMessage(messageDiv, result.error || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(messageDiv, 'An unexpected error occurred. Please check the console.', 'error');
    }
}


// =================================================================================
// LOGIN HANDLERS
// =================================================================================

// Login handlers
async function handleAdopterLogin(e) {
    e.preventDefault();
    await handleLogin('adopter', 'adopterEmail', 'adopterPassword', 'loginMessageAdopter');
}

async function handleVolunteerLogin(e) {
    e.preventDefault();
    await handleLogin('volunteer', 'volunteerEmail', 'volunteerPassword', 'loginMessageVolunteer');
}

async function handleStaffLogin(e) {
    e.preventDefault();
    await handleLogin('staff', 'staffEmail', 'staffPassword', 'loginMessageStaff');
}

// Main login function
async function handleLogin(userType, emailFieldId, passwordFieldId, messageDivId) {
    const email = document.getElementById(emailFieldId).value;
    const password = document.getElementById(passwordFieldId).value;
    const messageDiv = document.getElementById(messageDivId);
    
    // Simple validation
    if (!email || !password) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }
    
    try {
        // Show loading state
        showMessage(messageDiv, 'Logging in...', 'loading');
        
        // Call your backend login API
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                user_type: userType
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save user data to localStorage
            localStorage.setItem('authToken', data.token || 'demo-token');
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            localStorage.setItem('userType', userType);
            
            showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = DASHBOARD_PATHS[userType];
            }, 1000);
            
        } else {
            showMessage(messageDiv, data.error || 'Login failed', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        
        // DEMO MODE: If backend is not available, use demo login
        showMessage(messageDiv, 'Using demo mode...', 'loading');
        
        // Create demo user data
        const demoUser = {
            id: 'demo-' + Date.now(),
            first_name: email.split('@')[0],
            last_name: 'User',
            email: email,
            role: userType,
            user_type: userType
        };
        
        // Save demo data
        localStorage.setItem('authToken', 'demo-token');
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('userType', userType);
        
        showMessage(messageDiv, 'Demo login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = DASHBOARD_PATHS[userType];
        }, 1000);
    }
}

// Helper function to show messages
function showMessage(messageDiv, text, type) {
    if (!messageDiv) return;
    
    const colors = {
        error: 'danger',
        success: 'success',
        loading: 'info'
    };
    
    messageDiv.innerHTML = `
        <div class="alert alert-${colors[type] || 'info'} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}