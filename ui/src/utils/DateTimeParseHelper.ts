/**
 * Default: "Aug 19, 2026, 10:56 PM"
 * formatIsoDate(rawDate); 
 * 
 * Custom options for Date Only: "August 19, 2026"
 * formatIsoDate(rawDate, { dateStyle: "long" }); 
 * 
 * Custom options for Relative/Short: "08/19/2026"
 * formatIsoDate(rawDate, { month: "2-digit", day: "2-digit", year: "numeric" });
 */
export const formatIsoDate = (
    isoString?: string | null,
    options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    },
): string => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", options).format(date);
};