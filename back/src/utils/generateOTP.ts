export const generateOTP = (length = 5): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};
