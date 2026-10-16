// Post dates are calendar days, so they're read and shown in UTC to keep the day the same everywhere.
const day = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDay = (date: string) => day.format(new Date(date));
export const formatMonth = (date: string) => month.format(new Date(date));
