export async function getCroppedImg(
  image: HTMLImageElement,
  crop: { width: number; height: number; x: number; y: number }
): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  // Establecer el tamaño del canvas basado en la resolución original (natural)
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.imageSmoothingQuality = 'high';

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Return as a Promise resolving to a File
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(new File([blob], 'cropped-image.webp', { type: 'image/webp' }));
    }, 'image/webp', 1);
  });
}