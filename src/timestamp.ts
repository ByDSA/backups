// eslint-disable-next-line import/prefer-default-export
export function getDateTimestamp() {
  const NOW = new Date();

  return `${NOW.getFullYear()}-${(NOW.getMonth() + 1).toString().padStart(2, "0")}-${NOW.getDate().toString()
    .padStart(2, "0")}`;
}
