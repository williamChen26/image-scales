import { createEmptyImage, getPixel, setPixel, type Image } from "./pixel";

export function bilinearInterpolation(image: Image, newWidth: number, newHeight: number): Image & { time: number } {
    const startTime = performance.now(); // 记录开始时间
    const newImage = createEmptyImage(newWidth, newHeight);

    const xRatio = (image.width - 1) / newWidth;
    const yRatio = (image.height - 1) / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const xL = Math.floor(x * xRatio);
            const yT = Math.floor(y * yRatio);
            const xH = Math.min(xL + 1, image.width - 1);
            const yB = Math.min(yT + 1, image.height - 1);

            const xWeight = (x * xRatio) - xL;
            const yWeight = (y * yRatio) - yT;

            const topLeft = getPixel(image, xL, yT);
            const topRight = getPixel(image, xH, yT);
            const bottomLeft = getPixel(image, xL, yB);
            const bottomRight = getPixel(image, xH, yB);

            const r = (topLeft[0] * (1 - xWeight) * (1 - yWeight)) +
                      (topRight[0] * xWeight * (1 - yWeight)) +
                      (bottomLeft[0] * (1 - xWeight) * yWeight) +
                      (bottomRight[0] * xWeight * yWeight);

            const g = (topLeft[1] * (1 - xWeight) * (1 - yWeight)) +
                      (topRight[1] * xWeight * (1 - yWeight)) +
                      (bottomLeft[1] * (1 - xWeight) * yWeight) +
                      (bottomRight[1] * xWeight * yWeight);

            const b = (topLeft[2] * (1 - xWeight) * (1 - yWeight)) +
                      (topRight[2] * xWeight * (1 - yWeight)) +
                      (bottomLeft[2] * (1 - xWeight) * yWeight) +
                      (bottomRight[2] * xWeight * yWeight);

            const a = (topLeft[3] * (1 - xWeight) * (1 - yWeight)) +
                      (topRight[3] * xWeight * (1 - yWeight)) +
                      (bottomLeft[3] * (1 - xWeight) * yWeight) +
                      (bottomRight[3] * xWeight * yWeight);

            setPixel(newImage, x, y, [r, g, b, a]);
        }
    }

    const endTime = performance.now(); // 记录结束时间
    return {...newImage, time: endTime - startTime};
}
