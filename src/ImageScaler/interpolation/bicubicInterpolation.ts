import { createEmptyImage, getPixel, setPixel, type Image } from "./pixel";

function cubicInterpolate(p0: number, p1: number, p2: number, p3: number, t: number): number {
    return (
        p1 + 0.5 * t * (
            p2 - p0 +
            t * (2 * p0 - 5 * p1 + 4 * p2 - p3 +
            t * (3 * (p1 - p2) + p3 - p0))
        )
    );
}

export function bicubicInterpolation(image: Image, newWidth: number, newHeight: number): Image & { time: number } {
    const startTime = performance.now(); // 记录开始时间
    const newImage = createEmptyImage(newWidth, newHeight);

    const xRatio = (image.width - 1) / newWidth;
    const yRatio = (image.height - 1) / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const xMapped = x * xRatio;
            const yMapped = y * yRatio;

            const xL = Math.floor(xMapped);
            const yT = Math.floor(yMapped);

            const xDiff = xMapped - xL;
            const yDiff = yMapped - yT;

            const r = new Array(4);
            const g = new Array(4);
            const b = new Array(4);
            const a = new Array(4);

            for (let i = -1; i <= 2; i++) {
                const yPos = Math.min(Math.max(yT + i, 0), image.height - 1);

                const p0 = getPixel(image, Math.min(Math.max(xL - 1, 0), image.width - 1), yPos);
                const p1 = getPixel(image, Math.min(Math.max(xL, 0), image.width - 1), yPos);
                const p2 = getPixel(image, Math.min(Math.max(xL + 1, 0), image.width - 1), yPos);
                const p3 = getPixel(image, Math.min(Math.max(xL + 2, 0), image.width - 1), yPos);

                r[i + 1] = cubicInterpolate(p0[0], p1[0], p2[0], p3[0], xDiff);
                g[i + 1] = cubicInterpolate(p0[1], p1[1], p2[1], p3[1], xDiff);
                b[i + 1] = cubicInterpolate(p0[2], p1[2], p2[2], p3[2], xDiff);
                a[i + 1] = cubicInterpolate(p0[3], p1[3], p2[3], p3[3], xDiff);
            }

            const rValue = cubicInterpolate(r[0], r[1], r[2], r[3], yDiff);
            const gValue = cubicInterpolate(g[0], g[1], g[2], g[3], yDiff);
            const bValue = cubicInterpolate(b[0], b[1], b[2], b[3], yDiff);
            const aValue = cubicInterpolate(a[0], a[1], a[2], a[3], yDiff);

            setPixel(newImage, x, y, [rValue, gValue, bValue, aValue]);
        }
    }
    const endTime = performance.now(); // 记录结束时间
    return {...newImage, time: endTime - startTime};
}
