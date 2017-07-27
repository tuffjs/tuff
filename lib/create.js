module.exports = function create(parent, definition) {
  if (!definition) {
    return Object.create(parent);

  } else {
    var properties = {};
    for (var propertyName in definition) {
      properties[propertyName] = {
        value: definition[propertyName],
        configurable: true,
        enumerable: true,
        writable: true,
      };
    }
    return Object.create(parent, properties);
  }
}
