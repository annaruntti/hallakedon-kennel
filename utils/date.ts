export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("fi-FI");
}
