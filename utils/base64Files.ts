export default async function base64Files(acceptedFiles: File[]) {
    return await Promise.all(
        acceptedFiles.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })
    );
}
