/**
 * Returns a puppy icon based on the puppy id.
 */
export default (puppyId: number) => {
  const puppyIcons = ["🐕", "🦮", "🐩", "🐾", "🐶", "🦴"];
  return puppyIcons[(puppyId - 1) % puppyIcons.length];
};
