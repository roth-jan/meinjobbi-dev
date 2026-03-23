import { getFullApiUrl } from "./api-config";

export async function uploadImage(file: File): Promise<string> {
  const trustedFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.png`;
  const apiUrl = getFullApiUrl(`/bucket/${trustedFileName}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) throw new Error('Upload failed');

  return `https://jobbi-bucket.s3.eu-central-1.amazonaws.com/${trustedFileName}`;
}