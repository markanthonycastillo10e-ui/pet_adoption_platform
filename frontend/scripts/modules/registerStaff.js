import { valid } from "joi";
import { Validate } from "../helper/validateHelper";
import { validate } from "@babel/types";
export class RegisterStaff {
  constructor() {
    this.msgEl = null;
  }

  staffSignUp() {
    const staffForm = document.getElementById('js-staff-signup');
    if (!staffForm) return;

    this.createMessageElement(staffForm);

    staffForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(staffForm);
    });
  }

  createMessageElement(form) {
    let msgEl = document.getElementById('staffSignupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'staffSignupMessage';
      msgEl.className = 'mt-3';
      form.parentNode.insertBefore(msgEl, form.nextSibling);
    }
    this.msgEl = msgEl;
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    
    const payload = {
      first_name: formData.get('staff_first_name'),
      last_name: formData.get('staff_last_name'),
      email: formData.get('staff_email'),
      phone: formData.get('staff_phone'),
      password: formData.get('staff_password'),
      consents: formData.getAll('staff_consents')
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

    // Check required consents
    const requiredConsents = ['agreed_terms', 'consents_background_check'];
    const missingConsents = requiredConsents.filter(consent => 
      !payload.consents.includes(consent)
    );
    
    if (missingConsents.length > 0) {
      // Use the helper instance to show the message
      validate.showMessage('You must agree to the Terms of Service and consent to a background check.', 'danger');
      return false;
    }

    return true;
  }

  async submitToBackend(payload, form) {
    const messenger = new Validate();
    messenger.msgEl = this.msgEl;
    try {
      const response = await fetch('http://localhost:3000/api/auth/register/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        messenger.showMessage(result.message || 'Staff registration successful!', 'success');
        form.reset();
        
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.href = 'login-form.html';
        }, 2000);
      } else {
        messenger.showMessage(result.message || result.error || 'Staff registration failed.', 'danger');
      }
    } catch (error) {
      console.error('Staff registration error:', error);
        messenger.showMessage('Unable to connect to server. Please try again later.', 'danger');
    }
  }


}