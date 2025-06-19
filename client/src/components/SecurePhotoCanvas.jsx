import { useEffect, useRef } from "react";

export default function SecurePhotoCanvas({ src, alt }) {
  const canvasRef = useRef();

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto max-w-full rounded shadow"
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      style={{
        userSelect: "none",
        pointerEvents: "auto",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
      }}
      title={alt}
    />
  );
}
