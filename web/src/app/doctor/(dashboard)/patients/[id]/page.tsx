import PatientRecordDetail from '@/modules/doctor/patients/components/PatientRecordDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <PatientRecordDetail patientId={id} />;
}
