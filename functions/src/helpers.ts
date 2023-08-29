export default {
  json: (value: string) => JSON.stringify(value, null, 2),
  upperCase(value: string) {
    return value?.toUpperCase();
  },
};
