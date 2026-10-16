// A post's dates are calendar days, so they're read and shown in UTC to stay on the same day.
const day = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const formatDay = (date: string) => day.format(new Date(date));

export const formatMonth = (date: string) => month.format(new Date(date));
