import { useState } from "react";

export default function AppImage({ src, alt, className = "", fill, sizes, priority, style, width, height, ...props }: any) {
  const [error, setError] = useState(false);
  const finalSrc = error || !src ? "/assets/images/no_image.png" : src;
  
  return (
    <img 
      src={finalSrc} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
      style={fill ? { width: "100%", height: "100%", objectFit: "cover", ...style } : style}
      width={width}
      height={height}
      {...props} 
    />
  );
}