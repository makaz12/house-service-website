function toDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function isWithinBusinessHours(date, startHour, endHour) {
  const hour = date.getHours();
  return hour >= startHour && hour < endHour;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function generateSlots(dateStr, startHour, endHour, stepMinutes, durationMin) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return [];
  }

  const slots = [];
  const cursor = new Date(date);
  cursor.setHours(startHour, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(endHour, 0, 0, 0);

  while (addMinutes(cursor, durationMin) <= endOfDay) {
    slots.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + stepMinutes);
  }

  return slots;
}

module.exports = {
  toDate,
  isWithinBusinessHours,
  addMinutes,
  generateSlots,
};
