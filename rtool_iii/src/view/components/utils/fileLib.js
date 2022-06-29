const illegalRe = /[/?<>\\:*|"]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;

function sanitize(input, replacement) {
  if (typeof input !== 'string') return input;
  let result = input
    .replace(illegalRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return result;
}

function sanitizeFileName(input, replacement) {
  return sanitize(input, replacement || '');
}

export { sanitizeFileName };
