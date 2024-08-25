type ImageDataType = Uint8ClampedArray;

export interface Image {
    width: number;
    height: number;
    data: ImageDataType;
}

export type Algorithm = "nearest" | "bilinear" | "bicubic" | "lanczos" | "sinc";

export function getPixel(image: Image, x: number, y: number): [number, number, number, number] {
    const index = (y * image.width + x) * 4;
    return [
        image.data[index],     // R
        image.data[index + 1], // G
        image.data[index + 2], // B
        image.data[index + 3], // A
    ];
}

export function setPixel(image: Image, x: number, y: number, color: [number, number, number, number]): void {
    const index = (y * image.width + x) * 4;
    image.data[index] = color[0];     // R
    image.data[index + 1] = color[1]; // G
    image.data[index + 2] = color[2]; // B
    image.data[index + 3] = color[3]; // A
}

export function createEmptyImage(width: number, height: number): Image {
    return {
        width,
        height,
        data: new Uint8ClampedArray(width * height * 4),
    };
}

export function sinc(x: number): number {
    if (x === 0) {
        return 1;
    }
    return Math.sin(Math.PI * x) / (Math.PI * x);
}
