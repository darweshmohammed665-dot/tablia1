import { UserProfile } from '../types';

export function isChefCurrentlyOpen(chef: UserProfile | null | undefined): boolean {
  if (!chef) return false;

  // If manually closed, then it's closed
  if (chef.isClosed) return false;

  // If no working hours defined, assume open
  if (!chef.workingHours || !chef.workingHours.shifts || chef.workingHours.shifts.length === 0) {
    return true;
  }

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours + currentMinutes / 60;

  for (const shift of chef.workingHours.shifts) {
    const [fromH, fromM] = shift.from.split(':').map(Number);
    const [toH, toM] = shift.to.split(':').map(Number);
    
    let fromTime = fromH + fromM / 60;
    let toTime = toH + toM / 60;

    if (toTime < fromTime) {
      // Shift goes over midnight (e.g., 22:00 to 02:00)
      if (currentTime >= fromTime || currentTime < toTime) {
        return true;
      }
    } else {
      // Normal shift
      if (currentTime >= fromTime && currentTime < toTime) {
        return true;
      }
    }
  }

  // If we have shifts defined and none matched, chef is closed
  return false;
}
