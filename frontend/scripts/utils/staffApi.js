const BASE = 'http://localhost:3000/api';

export async function getStaffProfile(staffId) {
  const res = await fetch(`${BASE}/staff/${staffId}`);
  if (!res.ok) throw new Error('Failed to fetch staff profile');
  return res.json();
}

export async function updateStaffProfile(staffId, data) {
  const res = await fetch(`${BASE}/staff/${staffId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update staff profile');
  }
  return res.json();
}

export async function getStaffStats(staffId) {
  const res = await fetch(`${BASE}/staff/${staffId}/stats`);
  if (!res.ok) throw new Error('Failed to fetch staff stats');
  return res.json();
}
