import { fetchWrapper } from '../../../lib/fetchWrapper';
import { TVPageClient } from './TVPageClient';

interface TVPageProps {
  params: Promise<{ schoolCode: string }>;
}

export async function generateStaticParams() {
  try {
    const schools =
      await fetchWrapper.get<{ code?: string; schoolCode?: string; id?: string }[]>('/schools');
    if (!Array.isArray(schools)) return [];
    return schools
      .map((s) => ({ schoolCode: String(s.schoolCode || s.code || (s as any).id || '') }))
      .filter((p) => p.schoolCode);
  } catch {
    console.error('Failed to fetch schools for static params generation.');
    return [];
  }
}

export default async function TVPage({ params }: TVPageProps) {
  const { schoolCode } = await params;
  return <TVPageClient schoolCode={schoolCode} />;
}
