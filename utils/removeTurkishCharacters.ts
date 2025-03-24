export function removeTurkishChars(input: string): string {
    const turkishToEnglishMap: { [key: string]: string } = {
        ç: "c",
        Ç: "C",
        ğ: "g",
        Ğ: "G",
        ı: "i",
        I: "I",
        İ: "i",
        i: "i",
        ö: "o",
        Ö: "O",
        ş: "s",
        Ş: "S",
        ü: "u",
        Ü: "U",
    };

    return input
        .split("")
        .map((char) => turkishToEnglishMap[char] || char)
        .join("");
}
