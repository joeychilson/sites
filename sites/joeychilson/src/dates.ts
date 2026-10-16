// Post dates are calendar days, so they're read and written in UTC.
const day = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Sep 18, 2026" */
export const formatDay = (date: string) => day.format(new Date(date));

/** "Sep 2026" */
export const formatMonth = (date: string) => month.format(new Date(date));
