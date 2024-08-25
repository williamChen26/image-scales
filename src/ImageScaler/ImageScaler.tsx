import React, { useState, ChangeEvent, MouseEvent } from "react";
import "./ImageScaler.css";
import { type Algorithm } from "./interpolation/pixel";
import { scaleImage } from "./scaleController";

const ImageScaler: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [targetImage, setTargetImage] = useState<{
    width: number;
    height: number;
    data: Uint8ClampedArray
  } | null>(null);
  const [scale, setScale] = useState<number>(1.5);
  const [algorithm, setAlgorithm] = useState<Algorithm>();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            setImageSrc(reader.result);
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (event: MouseEvent<HTMLButtonElement>) => {
    const newScale = parseFloat(event.currentTarget.dataset.scale || "1.5");
    setScale(newScale);
  };

  const handleAlgorithmChange = async (type: Algorithm) => {
    setAlgorithm(type);
    const width = imageSize?.width || 0;
    const height = imageSize?.height || 0;
    const res = await scaleImage(
      { width, height, input: imageSrc },
      width * scale,
      height * scale,
      type
    );
    console.log(type, res?.time);
    setTargetImage(res);
    return null;
  };

  const renderCanvas = () => {
    if (targetImage) {
      const imageData = new ImageData(targetImage.data, targetImage.width, targetImage.height);
      const canvas = document.getElementById(
        "imageCanvas"
      ) as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (context) {
        // console.log(context.getImageData(0, 0, imageSize?.width || 0, imageSize?.height || 0));
        canvas.width = targetImage.width;
        canvas.height = targetImage.height;
        context.putImageData(imageData, 0, 0);
      }
    }
  };

  React.useEffect(() => {
    renderCanvas();
  }, [imageSrc, scale, algorithm, targetImage]);

  return (
    <div className="image-scaler">
      <div className="image-upload">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageSrc && imageSize && (
          <div className="image-preview">
            <img src={imageSrc as string} alt="Preview" />
            <div className="image-size">
              {imageSize.width} * {imageSize.height}
            </div>
          </div>
        )}
        <div className="controls">
        {/* "nearest" | "bilinear" | "bicubic" | "lanczos" | "sinc"; */}
          <button data-scale="1.5" onClick={handleScaleChange}>
            1.5x
          </button>
          <button data-scale="2" onClick={handleScaleChange}>
            2x
          </button>
          <button data-algorithm="nearest" onClick={() => handleAlgorithmChange('nearest')}>
            Nearest
          </button>
          <button data-algorithm="bilinear" onClick={() => handleAlgorithmChange('bilinear')}>
            Bilinear
          </button>
          <button data-algorithm="bicubic" onClick={() => handleAlgorithmChange('bicubic')}>
            Bicubic
          </button>
          <button data-algorithm="lanczos" onClick={() => handleAlgorithmChange('lanczos')}>
            Lanczos
          </button>
          <button data-algorithm="sinc" onClick={() => handleAlgorithmChange('sinc')}>
            Sinc
          </button>
        </div>
      </div>
      <canvas id="imageCanvas" className="canvas"></canvas>
    </div>
  );
};

export default ImageScaler;
