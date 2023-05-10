export function getLocalDate (timestamp ?: number) {
  const date = timestamp ? new Date(timestamp) : new Date();

  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}
