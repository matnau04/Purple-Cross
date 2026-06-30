const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

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

export const getEmploymentStatus = (dateValue) =>
  getDateStatus(dateValue, 'Employed soon', 'Currently employed');

export const getTerminationStatus = (dateValue) =>
  getDateStatus(dateValue, 'To be terminated', 'Terminated');

export const getEmploymentStatusColor = (dateValue) =>
  getEmploymentStatus(dateValue) === 'Employed soon' ? 'info' : 'success';

export const getTerminationStatusColor = (dateValue) =>
  getTerminationStatus(dateValue) === 'To be terminated' ? 'warning' : 'error';

export const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not scheduled';
  }

  return dateFormatter.format(new Date(dateValue));
};
