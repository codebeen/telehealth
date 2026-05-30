import ConsultationDetailView from '@/modules/patient/medical-records/components/ConsultationDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ConsultationDetailView id={id} />;
}
