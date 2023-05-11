export function getFullDate (timestamp ?: number) {
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = (date.getDate()).toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
