export const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const formatDate = (date) => {
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2);
  const month = months[date.getMonth()];
  return `${day} ${month} '${year}`;
};
