import api from '@/lib/api';

export async function login(payload: any) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function registerPatient(payload: any) {
  const response = await api.post('/auth/register/patient', payload);
  return response.data;
}

export async function registerDoctor(payload: any) {
  const response = await api.post('/auth/register/doctor', payload);
  return response.data;
}

export async function getSpecializations() {
  const response = await api.get('/doctors/specializations');
  return response.data;
}
