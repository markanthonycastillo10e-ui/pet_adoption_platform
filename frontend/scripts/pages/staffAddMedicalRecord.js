import { createActivityLog, getActivityLogsForPet } from '../utils/activityLogsApi.js';

// This module wires the Add Record button and modal on staff-view-details.html
document.addEventListener('DOMContentLoaded', async () => {
  const addBtn = document.getElementById('addRecordBtn');
  const modalEl = document.getElementById('addMedicalRecordModal');
  const submitBtn = document.getElementById('submitAddRecordBtn');
  const form = document.getElementById('addMedicalRecordForm');
  const medicalList = document.getElementById('medicalHistoryList');

  const bsModal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

  // Attempt to read current pet id from page (if staffViewPet.js sets it)
  const petId = window.currentPetId || document.body.dataset.petId || null;

  async function refreshMedicalList() {
    if (!petId) return;
    try {
      const logs = await getActivityLogsForPet(petId);
      if (!logs || logs.length === 0) {
        medicalList.innerHTML = '<p class="text-muted">No records yet.</p>';
        return;
      }
      medicalList.innerHTML = logs.map(l => `
        <div class="mb-3 border rounded-3 p-3">
          <div class="d-flex justify-content-between">
            <div><strong>${l.title}</strong><div class="small text-muted">${new Date(l.dueDate).toLocaleDateString()}</div></div>
            <div class="small text-muted">${l.location}</div>
          </div>
          <div class="mt-2">${l.description || ''}</div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load medical logs:', err);
    }
  }

  if (addBtn && bsModal) {
    addBtn.addEventListener('click', () => bsModal.show());
  }

  if (submitBtn && form) {
    submitBtn.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const payload = {
        recordType: document.getElementById('recordType').value,
        date: document.getElementById('recordDate').value,
        description: document.getElementById('recordDescription').value,
        veterinarian: document.getElementById('recordVeterinarian').value,
        notes: document.getElementById('recordNotes').value,
        pet_id: petId
      };

      try {
        await createActivityLog(payload);
        if (bsModal) bsModal.hide();
        form.reset();
        await refreshMedicalList();
        alert('Medical record added');
      } catch (err) {
        console.error('Failed to create medical record:', err);
        alert('Failed to add record: ' + err.message);
      }
    });
  }

  // Refresh when page loads
  refreshMedicalList();
});
