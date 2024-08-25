import {
  bicubicInterpolation,
  bilinearInterpolation,
  lanczosInterpolation,
  nearestNeighborInterpolation,
  sincInterpolation,
} from "./interpolation";
import { Image, Algorithm } from "./interpolation/pixel";

async function fetchImageData(
  input: string | ArrayBuffer | null
): Promise<Uint8ClampedArray> {
  if (input === null) throw new Error("Input is null");

  let imageBitmap: ImageBitmap;

  if (typeof input === "string") {
    const response = await fetch(input);
    const blob = await response.blob();
    imageBitmap = await createImageBitmap(blob);
  } else {
    const blob = new Blob([input]);
    imageBitmap = await createImageBitmap(blob);
  }

  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not get Canvas 2D context");

  ctx.drawImage(imageBitmap, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data; // Uint8ClampedArray
}

export async function scaleImage(
  {
    width,
    height,
    input,
  }: { width: number; height: number; input: string | ArrayBuffer | null },
  newWidth: number,
  newHeight: number,
  algorithm: Algorithm
): Promise<Image & { time: number } | null> {
  if (input === null) return null;

  const imageData = await fetchImageData(input);
  // return {
  //   width: newWidth,
  //   height: newHeight,
  //   data: imageData,
  // };
  let scaledImageData: Image & { time: number };
  switch (algorithm) {
    case "nearest":
      scaledImageData = nearestNeighborInterpolation(
        {
          width,
          height,
          data: imageData,
        },
        newWidth,
        newHeight
      );
      break;
    case "bilinear":
      scaledImageData = bilinearInterpolation(
        {
          width,
          height,
          data: imageData,
        },
        newWidth,
        newHeight
      );
      break;
    case "bicubic":
      scaledImageData = bicubicInterpolation(
        {
          width,
          height,
          data: imageData,
        },
        newWidth,
        newHeight
      );
      break;
    case "lanczos":
      scaledImageData = lanczosInterpolation(
        {
          width,
          height,
          data: imageData,
        },
        newWidth,
        newHeight
      );
      break;
    case "sinc":
      scaledImageData = sincInterpolation(
        {
          width,
          height,
          data: imageData,
        },
        newWidth,
        newHeight
      );
      break;
    default:
      throw new Error("Unsupported algorithm");
  }

  return scaledImageData; // Return as ArrayBuffer
}
