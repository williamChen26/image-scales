import { createEmptyImage, getPixel, setPixel, sinc, type Image } from "./pixel";

function lanczosKernel(x: number, a: number): number {
    if (x < -a || x > a) {
        return 0;
    }
    const sincX = sinc(x);
    const sincXOverA = sinc(x / a);
    return sincX * sincXOverA;
}

export function lanczosInterpolation(image: Image, newWidth: number, newHeight: number, num: number = 3): Image & { time: number } {
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

            const xFloor = Math.floor(xMapped);
            const yFloor = Math.floor(yMapped);

            for (let i = -num + 1; i <= num; i++) {
                for (let j = -num + 1; j <= num; j++) {
                    const xSample = xFloor + i;
                    const ySample = yFloor + j;

                    if (xSample >= 0 && xSample < image.width && ySample >= 0 && ySample < image.height) {
                        const weight = lanczosKernel(xMapped - xSample, num) * lanczosKernel(yMapped - ySample, num);
                        weightSum += weight;

                        const [r, g, b, aVal] = getPixel(image, xSample, ySample);
                        rSum += r * weight;
                        gSum += g * weight;
                        bSum += b * weight;
                        aSum += aVal * weight;
                    }
                }
            }

            const r = weightSum > 0 ? rSum / weightSum : 0;
            const g = weightSum > 0 ? gSum / weightSum : 0;
            const b = weightSum > 0 ? bSum / weightSum : 0;
            const a = weightSum > 0 ? aSum / weightSum : 0;

            setPixel(newImage, x, y, [r, g, b, a]);
        }
    }

    const endTime = performance.now(); // 记录结束时间
    return {...newImage, time: endTime - startTime};
}

