export function getCurrentDoctorId() {
  if (typeof window === 'undefined') {
    throw new Error('Doctor id is only available in the browser');
  }

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.doctorId) {
      return user.doctorId as string;
    }
  }

  const storedProfile = localStorage.getItem('registered_doctor_profile');
  if (storedProfile) {
    const profile = JSON.parse(storedProfile);
    if (profile?.doctorId) {
      return profile.doctorId as string;
    }
  }

  throw new Error('Doctor id is missing. Please sign in again.');
}
