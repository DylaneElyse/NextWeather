export const militaryTimeToStandard = (militaryTime: number): string => {
  if (militaryTime === 0) return '12AM';
  if (militaryTime === 12) return '12PM';
  const period = militaryTime < 12 ? 'AM' : 'PM';
  const standardHour = militaryTime % 12 || 12;
  return `${standardHour}${period}`;
};