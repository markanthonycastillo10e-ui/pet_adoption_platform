import { Validate } from "../helper/validateHelper";

export class VolunteerSignUp {
  constructor() {
    this.msgEl = null;
  }

  volunteerSignUp() {
    const volunteerForm = document.querySelector('.js-volunteer-signup');
    if (!volunteerForm) return;

    this.createMessageElement(volunteerForm);

    volunteerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(volunteerForm);
    });
  }

  createMessageElement(form) {
    let msgEl = document.getElementById('volunteerSignupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'volunteerSignupMessage';
      msgEl.className = 'mt-3';
      form.parentNode.insertBefore(msgEl, form.nextSibling);
    }
    this.msgEl = msgEl;
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    
    const payload = {
      first_name: formData.get('volunteer_first_name'),
      last_name: formData.get('volunteer_last_name'),
      email: formData.get('volunteer_email'),
      phone: formData.get('volunteer_phone'),
      password: formData.get('volunteer_password'),
      availability: formData.getAll('availability'),
      interested_activities: formData.getAll('interested_activities'),
      consents: formData.getAll('volunteer_consents')
    };

    if (!this.validatePayload(payload)) {
      return;
    }

    await this.submitToBackend(payload, form);
  }

  validatePayload(payload) {
    const validate = new Validate();
    validate.msgEl = this.msgEl;

    // First, run the common validations from the helper.
    if (!validate.validatePayload(payload)) {
      return false;
    }

    // Validate availability (at least one selection)
    if (payload.availability.length === 0) {
      validate.showMessage('Please select at least one availability option.', 'danger');
      return false;
    }
    
    // Validate activities (at least one selection)
    if (payload.interested_activities.length === 0) {
      validate.showMessage('Please select at least one interested activity.', 'danger');
      return false;
    }

    return true;
  }

  async submitToBackend(payload, form) {
    const messenger = new Validate();
    messenger.msgEl = this.msgEl;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        messenger.showMessage(result.message || 'Volunteer registration successful!', 'success');
        form.reset();
        
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.href = 'login-form.html';
        }, 2000);
      } else {
        messenger.showMessage(result.message || result.error || 'Volunteer registration failed.', 'danger');
      }
    } catch (error) {
      console.error('Volunteer registration error:', error);
      messenger.showMessage('Unable to connect to server. Please try again later.', 'danger');
    }
  }
}