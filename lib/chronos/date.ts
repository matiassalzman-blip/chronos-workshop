export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Monday-start week range (inclusive) containing `date`. */
export function getWeekRange(date: Date): { start: string; end: string } {
  const day = date.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const start = new Date(date);
  start.setDate(date.getDate() + mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start: toISODate(start), end: toISODate(end) };
}

export function isWithinRange(
  dateISO: string,
  range: { start: string; end: string }
): boolean {
  return dateISO >= range.start && dateISO <= range.end;
}
