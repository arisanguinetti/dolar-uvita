const sortObject = (a, b) => {
  const keyA = new Date(a.date);
  const keyB = new Date(b.date);
  if (keyA < keyB) return 1;
  if (keyA > keyB) return -1;
  return 0;
};

const isEquivalent = (a, b) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (const propName of aProps) {
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
};

const uniqueCount = scrapes =>
  scrapes
    .filter((item, i, arr) => {
      if (i === 0) return true;
      const lastItem = arr[i - 1];
      return !(item.value === lastItem.value);
    })
    .sort(sortObject);

const uniqueCountObjects = scrapes =>
  scrapes
    .filter((item, i, arr) => {
      if (i === 0) return true;
      const lastItem = arr[i - 1];
      return !isEquivalent(item.value, lastItem.value);
    })
    .sort(sortObject);

module.exports = { sortObject, uniqueCount, uniqueCountObjects, isEquivalent };
