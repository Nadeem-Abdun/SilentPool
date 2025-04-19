export const messageTimeFormat = (timestamp: Date): string => {
    const date = new Date(timestamp);

    // Get local time values
    let hours: number = date.getHours(); // Local hours
    let minutes: number = date.getMinutes(); // Local minutes

    // Convert to 12-hour format and determine AM/PM
    const ampm: string = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const minutesStr: string = minutes.toString().padStart(2, '0'); // Ensure two-digit minutes

    return `${hours}:${minutesStr}${ampm}`;
};
