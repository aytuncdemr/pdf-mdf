import imageCompression from "browser-image-compression";
import { blobToBase64 } from "./blobToBase64";

export async function compressImage(base64Photo: string) {
    const { byteArray, type } = base64ToUint8Array(base64Photo);

    const blob = new Blob([byteArray], { type });
    const file = new File([blob], "compressed-image", { type });

    const options = {
        maxSizeMB: 0.5, // Compress to around 500KB
        maxWidthOrHeight: 1000, // Resize if larger than 1000px
        useWebWorker: true, // Improves performance
        initialQuality: 0.7, // JPEG/PNG quality
    };

    try {
        const compressedBlob = await imageCompression(file, options); // ✅ Now it works!
        const compressedBase64 = await blobToBase64(compressedBlob);
        return base64ToUint8Array(compressedBase64);
    } catch (error) {
        console.error("Image compression failed:", error);
        return { byteArray, type }; // Return original if compression fails
    }
}

function base64ToUint8Array(base64String: string) {
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
        throw new Error("Invalid Base64 format");
    }

    const type = matches[1]; // image/png, image/jpeg, etc.
    const base64Data = matches[2];

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const byteArray = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    return { byteArray, type };
}
