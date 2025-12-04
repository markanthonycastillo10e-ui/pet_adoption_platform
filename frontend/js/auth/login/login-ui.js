document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        adopter: document.getElementById('loginFormAdopters'),
        volunteer: document.getElementById('loginFormVolunteer'),
        staff: document.getElementById('loginFormStaff')
    };

    const buttons = {
        // Buttons in Adopter section
        adopter: [document.getElementById('loginBtnAdopters'), document.getElementById('loginBtnAdopters2'), document.getElementById('loginBtnAdopters3')],
        volunteer: [document.getElementById('loginBtnVolunteer'), document.getElementById('loginBtnVolunteer2'), document.getElementById('loginBtnVolunteer3')],
        staff: [document.getElementById('loginBtnStaff'), document.getElementById('loginBtnStaff2'), document.getElementById('loginBtnStaff3')]
    };

    function showSection(userType) {
        // Hide all sections
        Object.values(sections).forEach(section => {
            if (section) section.classList.add('d-none');
        });

        // Show the selected section
        if (sections[userType]) {
            sections[userType].classList.remove('d-none');
        }
    }

    function setupButtonListeners(userType) {
        if (buttons[userType]) {
            buttons[userType].forEach(button => {
                if (button) {
                    button.addEventListener('click', () => showSection(userType));
                }
            });
        }
    }

    setupButtonListeners('adopter');
    setupButtonListeners('volunteer');
    setupButtonListeners('staff');
});