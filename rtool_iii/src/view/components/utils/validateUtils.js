import moment from 'moment';

const validateDate = (date) => {
  return (
    moment(date)
      .format('dddd')
      .toString()
      .toUpperCase() !== 'INVALID DATE'
  );
};

export const validateUtils = { validateDate };
