import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

export interface UploadProgressCallback {
  (progress: number): void;
}

export async function uploadPolaroid(
  file: File,
  dateId: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!file) throw new Error('No se seleccionó ningún archivo');

  // Opciones de compresión para polaroid: calidad artesanal nítida pero ligera (<800KB)
  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1400,
    useWebWorker: true,
    fileType: 'image/webp',
    onProgress: onProgress
  };

  let fileToUpload: File | Blob = file;

  try {
    fileToUpload = await imageCompression(file, options);
  } catch (compErr) {
    console.warn('Compresión en worker no disponible, usando archivo original:', compErr);
    fileToUpload = file;
  }

  // Generar nombre único para Supabase Storage
  const safeDateId = dateId || 'temp';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileName = `${safeDateId}/${timestamp}-${randomSuffix}.webp`;

  const { data, error } = await supabase.storage
    .from('polaroids')
    .upload(fileName, fileToUpload, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true
    });

  if (error) {
    console.error('Error al subir a Supabase Storage:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('polaroids')
    .getPublicUrl(data.path);

  if (!publicUrlData?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen');
  }

  return publicUrlData.publicUrl;
}
