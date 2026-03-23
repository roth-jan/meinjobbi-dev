import { fetchWrapper } from '@/lib/fetchWrapper';
import { JobAd } from '@/types';
import { OfferContent } from './OfferContent';

interface OfferPageProps {
  params: Promise<{ offerid: string }>;
}

export async function generateStaticParams() {
  try {
    const jobAds = await fetchWrapper.get<JobAd[]>('/jobad/all/100/1');
    if (!Array.isArray(jobAds)) return [];
    return jobAds.map((job) => ({ offerid: String(job.id) }));
  } catch {
    return [];
  }
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { offerid } = await params;
  return <OfferContent offerId={offerid} />;
}
