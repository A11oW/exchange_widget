/**
 * Format number to decimal
 * @example formatNumber(1.2345456) => 1.23
 * @param valueSource
 * @param pristine
 * @return {*}
 */
const formatNumber = (valueSource, pristine = 2) => {
  if (!valueSource) {
    return valueSource
  }

  if (pristine && pristine <= 0 || pristine == 0) {
    throw new RangeError('Attribute pristine must be more then 0');
  }

  const value = valueSource.toString();
  let onlyNums = value.replace(/[^\d|.]/g, "");

  // Check if first char is dot
  if (value.length === 1 && value === ".") {
    return "";
  }

  // Removing all extra dots
  if ((onlyNums.match(/\./g) || []).length > 1) {
    const dotIndex = onlyNums.indexOf(".");
    let temp = onlyNums.replace(/\./g, "").split("");
    temp.splice(dotIndex, 0, ".");
    onlyNums = temp.join("");
  }

  // Removing all extra numbers after dots
  if (
    onlyNums.replace(/[0]/g, "1") % 1 !== 0 &&
    onlyNums.split(".")[1].length > 2
  ) {
    const int = onlyNums.split(".")[0];
    const fraction = onlyNums.split(".")[1].slice(0, pristine);
    onlyNums = `${int}.${fraction}`;
  }

  return onlyNums;
};

export default formatNumber;
