import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  crop: Crop;
  setCrop: (crop: Crop) => void;
  onCropComplete: (crop: PixelCrop) => void;
  aspectRatio?: number;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

export default function ImageCropper({ imageSrc, crop, setCrop, onCropComplete, aspectRatio = 4/5, imgRef }: ImageCropperProps) {
  
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (crop.width && crop.height) return;
    const { width, height } = e.currentTarget;
    
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  return (
    <div className="flex flex-col items-center">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={onCropComplete}
        aspect={aspectRatio}
        className="max-h-[60vh] object-contain rounded-xl"
      >
        <img
          ref={imgRef as any}
          alt="Crop me"
          src={imageSrc}
          onLoad={onImageLoad}
          className="max-h-[60vh] object-contain"
        />
      </ReactCrop>
    </div>
  );
}