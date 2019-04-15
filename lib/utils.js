const uniqueCount = scrapes =>
  scrapes.filter((item, i, arr) => {
    if (i === 0) return true;
    const lastItem = arr[i - 1];
    return !(item.value === lastItem.value);
  });

const uniqueCountObjects = scrapes =>
  scrapes.filter((item, i, arr) => {
    if (i === 0) return true;
    const lastItem = arr[i - 1];
    return !(
      item.comprador === lastItem.comprador &&
      item.vendedor === lastItem.vendedor
    );
  });

module.exports = { uniqueCount, uniqueCountObjects };
