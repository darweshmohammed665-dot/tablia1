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
 * Formats a Date object or timestamp into a full 12-hour time string for Arabic locale.
 */
export function formatDateTime12h(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  return d.toLocaleTimeString('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
