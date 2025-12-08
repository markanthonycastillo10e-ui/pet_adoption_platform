import { getStaffProfile, updateStaffProfile, getStaffStats } from '../utils/staffApi.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Try to get staff ID from localStorage, fallback to email
  let staffId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  
  if (!staffId && userEmail) {
    console.warn('Staff ID not found, using email as fallback');
    staffId = userEmail;
  }

  if (!staffId) {
    alert('Error: Staff information not found. Please login again.');
    window.location.href = '/frontend/pages/login-form.html';
    return;
  }

  let isEditMode = false;

  // DOM Elements
  const editBtn = document.getElementById('editProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const profileForm = document.getElementById('profileForm');

  // Profile elements
  const profileNameEl = document.getElementById('profileName');
  const profileRoleEl = document.getElementById('profileRole');
  const memberSinceEl = document.getElementById('memberSince');
  const profilePicEl = document.getElementById('profilePic');

  // View elements
  const viewFirstName = document.getElementById('viewFirstName');
  const viewMiddleName = document.getElementById('viewMiddleName');
  const viewLastName = document.getElementById('viewLastName');
  const viewPhone = document.getElementById('viewPhone');
  const viewEmail = document.getElementById('viewEmail');
  const viewAddress = document.getElementById('viewAddress');
  const viewBio = document.getElementById('viewBio');

  // Edit elements
  const editFirstName = document.getElementById('editFirstName');
  const editMiddleName = document.getElementById('editMiddleName');
  const editLastName = document.getElementById('editLastName');
  const editPhone = document.getElementById('editPhone');
  const editEmail = document.getElementById('editEmail');
  const editAddress = document.getElementById('editAddress');
  const editBio = document.getElementById('editBio');

  // Stats elements
  const animalsHelpedCount = document.getElementById('animalsHelpedCount');
  const adoptionsApprovedCount = document.getElementById('adoptionsApprovedCount');
  const serviceDuration = document.getElementById('serviceDuration');

  // Load staff profile data
  async function loadStaffProfile() {
    try {
      if (!staffId) {
        console.error('Staff ID not found');
        return;
      }

      const response = await getStaffProfile(staffId);
      const staff = response.data || response;

      // Update profile header
      profileNameEl.textContent = `${staff.firstName} ${staff.lastName}`;
      profileRoleEl.textContent = 'Staff Member';
      
      // Calculate member duration
      const createdDate = new Date(staff.createdAt);
      const duration = calculateDuration(createdDate);
      memberSinceEl.textContent = `Member since ${duration}`;

      // Update view fields
      viewFirstName.textContent = staff.firstName || '-';
      viewMiddleName.textContent = staff.middleName || '-';
      viewLastName.textContent = staff.lastName || '-';
      viewPhone.textContent = staff.phone || '-';
      viewEmail.textContent = staff.email || '-';
      viewAddress.textContent = staff.address || '-';
      viewBio.textContent = staff.bio || 'No bio yet.';

      // Fill edit fields with current values
      editFirstName.value = staff.firstName || '';
      editMiddleName.value = staff.middleName || '';
      editLastName.value = staff.lastName || '';
      editPhone.value = staff.phone || '';
      editEmail.value = staff.email || '';
      editAddress.value = staff.address || '';
      editBio.value = staff.bio || '';

      if (staff.profilePic) {
        if (profilePicEl) {
          profilePicEl.src = staff.profilePic;
        }
        const navbarPic = document.getElementById('navbarProfilePic');
        if (navbarPic) {
          navbarPic.src = staff.profilePic;
        }
      }

      // Load stats
      await loadStaffStats();
    } catch (error) {
      console.error('Error loading staff profile:', error);
      alert('Failed to load profile');
    }
  }

  // Load staff statistics
  async function loadStaffStats() {
    try {
      const response = await getStaffStats(staffId);
      const stats = response.data || response;

      // Update stats
      animalsHelpedCount.textContent = stats.animalsHelped || 0;
      adoptionsApprovedCount.textContent = stats.adoptionsApproved || 0;
      serviceDuration.textContent = `${stats.serviceDuration || '0'} days`;
    } catch (error) {
      console.error('Error loading stats:', error);
      // Stats are optional, don't fail the whole page
    }
  }

  // Calculate duration (days, months, or years)
  function calculateDuration(createdDate) {
    const now = new Date();
    const diff = now - createdDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }

  // Toggle edit mode
  function toggleEditMode() {
    isEditMode = !isEditMode;

    // Toggle visibility
    document.querySelectorAll('[id^="view"]').forEach(el => {
      el.classList.toggle('d-none', isEditMode);
    });

    document.querySelectorAll('[id^="edit"]').forEach(el => {
      el.classList.toggle('d-none', !isEditMode);
    });

    editBtn.classList.toggle('d-none', isEditMode);
    saveBtn.classList.toggle('d-none', !isEditMode);
    cancelBtn.classList.toggle('d-none', !isEditMode);
  }

  // Save profile changes
  async function saveProfile() {
    try {
      const updatedData = {
        firstName: editFirstName.value,
        middleName: editMiddleName.value,
        lastName: editLastName.value,
        phone: editPhone.value,
        address: editAddress.value,
        bio: editBio.value
      };

      const response = await updateStaffProfile(staffId, updatedData);
      
      alert('Profile updated successfully!');
      toggleEditMode();
      await loadStaffProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + error.message);
    }
  }

  // Event listeners
  editBtn.addEventListener('click', toggleEditMode);
  cancelBtn.addEventListener('click', () => {
    toggleEditMode();
    loadStaffProfile(); // Reset to original values
  });
  saveBtn.addEventListener('click', saveProfile);

  // Profile picture change
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const profileImageInput = document.getElementById('profileImageInput');
  
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => {
      if (profileImageInput) {
        profileImageInput.click();
      }
    });
  }

  if (profileImageInput) {
    profileImageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        
        try {
          const response = await updateStaffProfile(staffId, {
            profilePic: base64
          });
          
          if (profilePicEl) {
            profilePicEl.src = base64;
          }
          const navbarPic = document.getElementById('navbarProfilePic');
          if (navbarPic) {
            navbarPic.src = base64;
          }
          alert('Profile picture updated!');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          alert('Failed to update profile picture');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Load profile on page load
  loadStaffProfile();
});
