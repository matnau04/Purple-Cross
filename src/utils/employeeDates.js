// Date functions used around the app.
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

// Checks if a date is before or after today.
const getDateStatus = (dateValue, futureLabel, pastLabel) => {
  if (!dateValue) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateValue);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate > today ? futureLabel : pastLabel;
};

// Employment status text.
export const getEmploymentStatus = (dateValue) =>
  getDateStatus(dateValue, 'Employed soon', 'Currently employed');

// Termination status text.
export const getTerminationStatus = (dateValue) =>
  getDateStatus(dateValue, 'To be terminated', 'Terminated');

// Employment chip colour.
export const getEmploymentStatusColor = (dateValue) =>
  getEmploymentStatus(dateValue) === 'Employed soon' ? 'info' : 'success';

// Termination chip colour.
export const getTerminationStatusColor = (dateValue) =>
  getTerminationStatus(dateValue) === 'To be terminated' ? 'warning' : 'error';

// Makes dates easier to read.
export const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not scheduled';
  }

  return dateFormatter.format(new Date(dateValue));
};
