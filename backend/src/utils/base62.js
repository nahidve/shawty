const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function encodeBase62(num) {
  if (num === 0) return "0";
  let result = "";
  while (num > 0) {
    result = CHARSET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

export function decodeBase62(str) {
  let result = 0;
  for (const char of str) {
    result = result * 62 + CHARSET.indexOf(char);
  }
  return result;
}