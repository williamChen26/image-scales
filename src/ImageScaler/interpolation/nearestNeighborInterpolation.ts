import { createEmptyImage, getPixel, setPixel, type Image } from "./pixel";

export function nearestNeighborInterpolation(image: Image, newWidth: number, newHeight: number): Image & { time: number } {
    const startTime = performance.now(); // 记录开始时间
    const newImage = createEmptyImage(newWidth, newHeight);
    
    const xRatio = image.width / newWidth;
    const yRatio = image.height / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const nearestX = Math.floor(x * xRatio);
            const nearestY = Math.floor(y * yRatio);

            const pixel = getPixel(image, nearestX, nearestY);
            setPixel(newImage, x, y, pixel);
        }
    }

    const endTime = performance.now(); // 记录结束时间
    return {...newImage, time: endTime - startTime};
}
