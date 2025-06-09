export default function parseScheduleText(text) {
  const lines = text.split('\n');
  const schedules = [];
  let current = [];

  for (const line of lines) {
    if (line.startsWith("Schedule")) {
      if (current.length) schedules.push(current);
      current = [];
    } else if (line.trim()) {
      current.push(line.trim());
    }
  }

  if (current.length) schedules.push(current);
  return schedules;
}
