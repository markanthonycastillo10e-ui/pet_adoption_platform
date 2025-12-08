const BASE = 'http://localhost:3000/api/auth/register/volunteer';

export async function getVolunteers() {
  // Fetch available volunteers from the backend
  const res = await fetch(BASE.replace('/register', ''));
  if (!res.ok) throw new Error('Failed to fetch volunteers');
  return res.json();
}

export async function getVolunteerById(id) {
  const res = await fetch(`${BASE.replace('/register', '')}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer');
  return res.json();
}
