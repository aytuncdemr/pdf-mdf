export default function removeExtraSpaces(input: string | null) {
    if (!input) {
        return;
    }

    return input.trim().replace(/\s{2,}/g, " ");
}
