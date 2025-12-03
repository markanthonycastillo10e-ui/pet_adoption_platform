import { Validate } from "../helper/validateHelper";
export class SignupForm {
  constructor() {
    this.msgEl = null;
  }

  signupButton() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    this.createMessageElement(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(form);
    });
  }

  createMessageElement(form) {
    let msgEl = document.getElementById('signupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'signupMessage';
      msgEl.className = 'mt-3';
      form.parentNode.insertBefore(msgEl, form.nextSibling);
    }
    
    this.msgEl = msgEl;
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    
    const payload = {
      first_name: formData.get('adopter_first_name'),
      last_name: formData.get('adopter_last_name'),
      email: formData.get('adopter_email'),
      phone: formData.get('adopter_phone_number'),
      password: formData.get('adopter_password'),
      living_situation: formData.get('living_situation'),
      pet_experience: formData.getAll('pet_experience'),
      consents: formData.getAll('adopter_consents')
    };

    if (!this.validatePayload(payload)) {
      return;
    }

    await this.submitToBackend(payload, form);
  }

  validatePayload(payload) {
    // Create an instance of Validate and pass the message element to it.
    const validate = new Validate();
    validate.msgEl = this.msgEl;

    // Call the correct validation method and return its result.
    return validate.validatePayload(payload);
  }

  async submitToBackend(payload, form) {
    const messenger = new Validate();
    messenger.msgEl = this.msgEl;
    try {
      const response = await fetch('http://localhost:3000/api/auth/register/adopter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        messenger.showMessage(result.message || 'Registration successful!', 'success');
        form.reset();
        
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.href = 'login-form.html';
        }, 2000);
      } else {
        messenger.showMessage(result.message || result.error || 'Registration failed.', 'danger');
      }
    } catch (error) {
      console.error('Registration error:', error);
      messenger.showMessage('Unable to connect to server. Please try again later.', 'danger');
    }
  }

}