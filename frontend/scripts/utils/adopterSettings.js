document.addEventListener('DOMContentLoaded', function() {
      // Get user data from localStorage
      const userData = localStorage.getItem('currentUser');
      
      if (!userData) {
          // Redirect to login if no user data
          window.location.href = 'login-form.html';
          return;
      }

      const user = JSON.parse(userData);
      updateUserProfile(user);
      loadUserSettings(user);
      setupEventListeners();
  });

  function updateUserProfile(user) {
      // Update profile name and role
      const fullName = `${user.first_name} ${user.last_name}`;
      const userRole = getUserRoleDisplay(user.role || user.user_type);
      
      // Update navbar profile
      const navbarName = document.getElementById('navbarUserName');
      const navbarRole = document.getElementById('navbarUserRole');
      if (navbarName) navbarName.textContent = fullName;
      if (navbarRole) navbarRole.textContent = userRole;
      
      // Update dropdown profile
      const dropdownName = document.getElementById('dropdownUserName');
      const dropdownRole = document.getElementById('dropdownUserRole');
      if (dropdownName) dropdownName.textContent = fullName;
      if (dropdownRole) dropdownRole.textContent = userRole;
  }

  function loadUserSettings(user) {
      // Load saved settings from localStorage or use defaults
      const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
      
      // Set checkbox values
      document.getElementById('emailNotifications').checked = settings.emailNotifications || false;
      document.getElementById('pushNotifications').checked = settings.pushNotifications || false;
      document.getElementById('smsNotifications').checked = settings.smsNotifications !== false; // Default true
      document.getElementById('showContactInfo').checked = settings.showContactInfo !== false; // Default true
      document.getElementById('allowDirectMessages').checked = settings.allowDirectMessages !== false; // Default true
      document.getElementById('systemAlert').checked = settings.systemAlert !== false; // Default true
      document.getElementById('emergencyNotifications').checked = settings.emergencyNotifications !== false; // Default true
      document.getElementById('reportsReminders').checked = settings.reportsReminders !== false; // Default true
      document.getElementById('adminUpdates').checked = settings.adminUpdates !== false; // Default true
  }

  function saveUserSettings() {
      const settings = {
          emailNotifications: document.getElementById('emailNotifications').checked,
          pushNotifications: document.getElementById('pushNotifications').checked,
          smsNotifications: document.getElementById('smsNotifications').checked,
          showContactInfo: document.getElementById('showContactInfo').checked,
          allowDirectMessages: document.getElementById('allowDirectMessages').checked,
          systemAlert: document.getElementById('systemAlert').checked,
          emergencyNotifications: document.getElementById('emergencyNotifications').checked,
          reportsReminders: document.getElementById('reportsReminders').checked,
          adminUpdates: document.getElementById('adminUpdates').checked
      };
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Show success message
      alert('Settings saved successfully!');
      
      // Here you would typically send to your backend API
      console.log('Saving settings:', settings);
  }

  function setupEventListeners() {
      // Logout functionality
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
              e.preventDefault();
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('userType');
              window.location.href = 'login-form.html';
          });
      }

      // Save settings button
      const saveSettingsBtn = document.getElementById('saveSettingsBtn');
      if (saveSettingsBtn) {
          saveSettingsBtn.addEventListener('click', function() {
              saveUserSettings();
          });
      }

      // Export data button
      const exportDataBtn = document.getElementById('exportDataBtn');
      if (exportDataBtn) {
          exportDataBtn.addEventListener('click', function() {
              // Export user data functionality
              alert('Exporting user data... This would download your data file.');
              // Here you would typically call your backend API to export data
          });
      }

      // Delete account confirmation
      const confirmDeleteAccountBtn = document.getElementById('confirmDeleteAccountBtn');
      if (confirmDeleteAccountBtn) {
          confirmDeleteAccountBtn.addEventListener('click', function() {
              // Delete account functionality
              if (confirm('Are you absolutely sure? This cannot be undone!')) {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('userType');
                  localStorage.removeItem('userSettings');
                  alert('Account deleted successfully.');
                  window.location.href = 'login-form.html';
              }
          });
      }
  }

  function getUserRoleDisplay(role) {
      const roles = {
          'adopter': 'Pet Adopter',
          'volunteer': 'Volunteer',
          'staff': 'Staff Member',
          'coordinator': 'Coordinator'
      };
      return roles[role] || 'User';
  }