/**
 * Returns a puppy icon based on the puppy id.
 */
export default (puppyId: string) => {
  // Strip all non-numeric characters from the puppy id,
  // so that we can use it to index an array of icons.
  const puppyIdNumber = parseInt(puppyId.replace(/\D/g, ""));
  const puppyIcons = ["🐕", "🦮", "🐩", "🐾", "🐶", "🦴"];
  return puppyIcons[(puppyIdNumber - 1) % puppyIcons.length];
};
