// Pakistan Standard Time (PKT) and Night Curfew Management

let testTimeOverrideMinutes: number | null = null; // for testing night curfew vs daytime

export function setTestCurfewOverride(minutesFromMidnight: number | null) {
  testTimeOverrideMinutes = minutesFromMidnight;
}

export function getTestCurfewOverride(): number | null {
  return testTimeOverrideMinutes;
}

export interface PktTimeInfo {
  dateObj: Date;
  pktHours: number;
  pktMinutes: number;
  pktSeconds: number;
  formattedTime: string;
  formattedDate: string;
  isNightCurfewActive: boolean;
  minutesUntilCurfew: number;
  curfewMessage: string;
}

export function getCurrentPktTime(
  morningStartHour: number = 6,
  nightCurfewHour: number = 22
): PktTimeInfo {
  // If test override is set, calculate based on that
  const now = new Date();
  
  // Calculate Pakistan Standard Time (UTC + 5 hours)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const pktDate = new Date(utc + 3600000 * 5);

  let hours = pktDate.getHours();
  let minutes = pktDate.getMinutes();
  let seconds = pktDate.getSeconds();

  if (testTimeOverrideMinutes !== null) {
    hours = Math.floor(testTimeOverrideMinutes / 60) % 24;
    minutes = testTimeOverrideMinutes % 60;
    seconds = 0;
  }

  // Curfew is active if hours >= 22 (10 PM) OR hours < 6 (6 AM)
  const isNightCurfewActive = hours >= nightCurfewHour || hours < morningStartHour;

  // Minutes until curfew (if before 10 PM)
  let minutesUntilCurfew = 0;
  if (!isNightCurfewActive) {
    const totalMinutesNow = hours * 60 + minutes;
    const curfewTotalMinutes = nightCurfewHour * 60;
    minutesUntilCurfew = Math.max(0, curfewTotalMinutes - totalMinutesNow);
  }

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const formattedTime = `${displayHours}:${formattedMinutes}:${formattedSeconds} ${ampm} PKT`;

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = pktDate.toLocaleDateString('en-PK', options);

  let curfewMessage = '';
  if (isNightCurfewActive) {
    curfewMessage = 'Night Safety Curfew Active (10:00 PM – 06:00 AM PKT). All bookings paused for women protection.';
  } else if (minutesUntilCurfew <= 60) {
    curfewMessage = `Notice: Safety Curfew in ${minutesUntilCurfew} mins (10:00 PM PKT). Please book short trips only.`;
  } else {
    curfewMessage = 'Service Active. All trips must conclude before 10:00 PM PKT.';
  }

  return {
    dateObj: pktDate,
    pktHours: hours,
    pktMinutes: minutes,
    pktSeconds: seconds,
    formattedTime,
    formattedDate,
    isNightCurfewActive,
    minutesUntilCurfew,
    curfewMessage,
  };
}

// Check if a ride duration would end past 10:00 PM PKT
export function willRideExceedCurfew(
  durationMinutes: number,
  nightCurfewHour: number = 22,
  morningStartHour: number = 6
): boolean {
  const current = getCurrentPktTime(morningStartHour, nightCurfewHour);
  if (current.isNightCurfewActive) return true;

  const currentMinutesFromMidnight = current.pktHours * 60 + current.pktMinutes;
  const endMinutesFromMidnight = currentMinutesFromMidnight + durationMinutes;
  const curfewMinutesFromMidnight = nightCurfewHour * 60;

  return endMinutesFromMidnight >= curfewMinutesFromMidnight;
}
