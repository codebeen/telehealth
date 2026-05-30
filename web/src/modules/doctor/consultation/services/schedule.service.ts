import api from '@/lib/api';

export async function getScheduleSlots(startDate: string, endDate: string) {
  const response = await api.get('/consultation/schedule/slots', {
    params: { startDate, endDate },
  });
  return response.data;
}

export async function saveScheduleSlots(slots: Record<string, any>) {
  const response = await api.post('/consultation/schedule/slots', { slots });
  return response.data;
}
