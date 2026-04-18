/**
 * Formats a time string (HH:MM) into a 12-hour format with Arabic AM/PM indicators.
 */
export function formatTime12h(timeStr: string | undefined): string {
  if (!timeStr) return '';
  
  try {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    if (isNaN(hours) || isNaN(minutes)) return timeStr;

    const period = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours12}:${formattedMinutes} ${period}`;
  } catch (error) {
    return timeStr;
  }
}

/**
 * Formats a Date object or timestamp into a full 12-hour time string (Western digits, Arabic AM/PM).
 * Example: "9:30 ص"
 */
export function formatDateTime12h(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const hours = d.getHours();
  const minutes = d.getMinutes();
  
  const h24 = hours.toString().padStart(2, '0');
  const m24 = minutes.toString().padStart(2, '0');
  
  return formatTime12h(`${h24}:${m24}`);
}

/**
 * Generates an array of time options for every 30 minutes in a 24h day (HH:mm format).
 */
export function generateTimeOptions(): string[] {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hours = h.toString().padStart(2, '0');
      const minutes = m.toString().padStart(2, '0');
      options.push(`${hours}:${minutes}`);
    }
  }
  return options;
}
