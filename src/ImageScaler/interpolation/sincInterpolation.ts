import { createEmptyImage, getPixel, setPixel, sinc, type Image } from "./pixel";

export function sincInterpolation(image: Image, newWidth: number, newHeight: number, num: number = 3): Image & { time: number } {
    const startTime = performance.now(); // 记录开始时间
    const newImage = createEmptyImage(newWidth, newHeight);

    const xRatio = image.width / newWidth;
    const yRatio = image.height / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const xMapped = x * xRatio;
            const yMapped = y * yRatio;

            let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
            let weightSum = 0;

            for (let i = -num + 1; i <= num; i++) {
                for (let j = -num + 1; j <= num; j++) {
                    const xSample = Math.min(Math.max(Math.floor(xMapped) + i, 0), image.width - 1);
                    const ySample = Math.min(Math.max(Math.floor(yMapped) + j, 0), image.height - 1);

                    const weight = sinc(xMapped - xSample) * sinc(yMapped - ySample);
                    weightSum += weight;

                    const [r, g, b, aVal] = getPixel(image, xSample, ySample);
                    rSum += r * weight;
                    gSum += g * weight;
                    bSum += b * weight;
                    aSum += aVal * weight;
                }
            }

            const r = rSum / weightSum;
            const g = gSum / weightSum;
            const b = bSum / weightSum;
            const a = aSum / weightSum;

            setPixel(newImage, x, y, [r, g, b, a]);
        }
    }

    const endTime = performance.now(); // 记录结束时间
    return {...newImage, time: endTime - startTime};
}
