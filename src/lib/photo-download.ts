import type { Photo } from './mock-photo-data';

export type DownloadablePhoto = Pick<Photo, 'title' | 'url'>;

function getPhotoFileName(photo: DownloadablePhoto): string {
  const safeTitle = photo.title
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'photo';
  const extension = photo.url.match(/\.[a-z0-9]+(?:\?.*)?$/i)?.[0].split('?')[0] ?? '';

  return `${safeTitle}${extension}`;
}

export async function downloadPhoto(photo: DownloadablePhoto): Promise<void> {
  const response = await fetch(photo.url);

  if (!response.ok) {
    throw new Error(`Unable to prepare ${photo.title} for download.`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = getPhotoFileName(photo);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
