export default function calculateDaysDifference(
    orderDateStr: string,
    refundDateStr: string,
    isTrendyol: boolean
): string {
    if (!isTrendyol) {
        return "";
    }

    const format = "dd.MM.yyyy HH:mm";

    // Extract date components using regex
    const orderMatch = orderDateStr.match(/\d+/g);
    const refundMatch = refundDateStr.match(/\d+/g);

    // Ensure matches exist and have the required components
    if (
        !orderMatch ||
        !refundMatch ||
        orderMatch.length < 5 ||
        refundMatch.length < 5
    ) {
        throw new Error(
            "Invalid date format. Expected format: dd.MM.yyyy HH:mm"
        );
    }

    // Convert extracted strings into numbers
    const [orderDay, orderMonth, orderYear, orderHour, orderMinute] =
        orderMatch.map(Number);
    const [refundDay, refundMonth, refundYear, refundHour, refundMinute] =
        refundMatch.map(Number);

    // Create Date objects
    const orderDate = new Date(
        orderYear,
        orderMonth - 1,
        orderDay,
        orderHour,
        orderMinute
    );
    const refundDate = new Date(
        refundYear,
        refundMonth - 1,
        refundDay,
        refundHour,
        refundMinute
    );

    // Calculate the difference in milliseconds
    const diffInMs = refundDate.getTime() - orderDate.getTime();

    // Convert milliseconds to days
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)).toString();
}
