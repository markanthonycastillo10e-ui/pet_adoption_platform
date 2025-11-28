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

      // Apply filters button
      const applyFiltersBtn = document.getElementById('applyFiltersBtn');
      if (applyFiltersBtn) {
          applyFiltersBtn.addEventListener('click', function() {
              applyPetFilters();
          });
      }

      // View pet details buttons
      const viewPetBtns = document.querySelectorAll('.viewPetBtn');
      viewPetBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const petId = this.getAttribute('data-pet-id');
              viewPetDetails(petId);
          });
      });

      // Search input (on enter key)
      const searchInput = document.getElementById('petSearchInput');
      if (searchInput) {
          searchInput.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                  applyPetFilters();
              }
          });
      }
  }

  function applyPetFilters() {
      const searchTerm = document.getElementById('petSearchInput').value;
      const petType = document.getElementById('petTypeFilter').value;
      const petStatus = document.getElementById('petStatusFilter').value;
      const vaccinatedOnly = document.getElementById('vaccinatedCheck').checked;

      // Here you would typically make an API call to filter pets
      console.log('Applying filters:', {
          searchTerm,
          petType,
          petStatus,
          vaccinatedOnly
      });

      // For now, just show an alert
      alert(`Filters applied!\nSearch: ${searchTerm}\nType: ${petType}\nStatus: ${petStatus}\nVaccinated Only: ${vaccinatedOnly}`);
  }

  function viewPetDetails(petId) {
      // Redirect to pet details page or show modal
      console.log('Viewing pet details for ID:', petId);
      // For now, just show an alert
      alert(`Viewing details for pet ID: ${petId}`);
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