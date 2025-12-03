export class Validate{
     constructor() {
    this.msgEl = null;
    }
    validatePayload(payload) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;

    if (!payload.first_name?.trim() || !payload.last_name?.trim()) {
      this.showMessage('Please enter your full name.', 'danger');
      return false;
    }

    if (!emailRegex.test(payload.email)) {
      this.showMessage('Please enter a valid email address.', 'danger');
      return false;
    }

    if (!payload.password || payload.password.length < 6) {
      this.showMessage('Password must be at least 6 characters.', 'danger');
      return false;
    }

    if (!phoneRegex.test(payload.phone)) {
      this.showMessage('Phone number must start with 09 and have exactly 11 digits.', 'danger');
      return false;
    }

    return true;
  }
    showMessage(text, type) {
    if (!this.msgEl) return;

    this.msgEl.textContent = text;
    this.msgEl.className = `alert alert-${type} mt-3`;
    this.msgEl.setAttribute('role', 'alert');

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.msgEl.textContent = '';
        this.msgEl.className = '';
      }, 5000);
    }
  }
}