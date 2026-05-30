export function getCurrentPatientId(): string {
  if (typeof window === 'undefined') {
    throw new Error('Patient id is only available in the browser');
  }

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.patientId) {
      return user.patientId;
    }
  }

  const storedProfile = localStorage.getItem('registered_patient_profile');
  if (storedProfile) {
    const profile = JSON.parse(storedProfile);
    if (profile?.patientId) {
      return profile.patientId;
    }
  }

  throw new Error('Patient profile id was not found. Please sign in again.');
}
