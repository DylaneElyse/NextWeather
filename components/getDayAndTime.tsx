export const formatMonthDate = (dateString: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const datePart = dateString.split(' ')[0];
  const [year, month, day] = datePart.split('-');
  return `${months[parseInt(month) - 1]} ${parseInt(day)}`;
};

export const formatHour = (dateString: string): string => {
  const datePart = dateString.split(' ')[1];
  const [hour, minute] = datePart.split(':');
  return `${parseInt(hour)}`;
};

export const formatDay = (dateString: string): string => {
  const datePart = dateString.split(' ')[0];
  const [year, month, day] = datePart.split('-');
  return `${parseInt(day)}`;
};