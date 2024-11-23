const { v4: uuidv4 } = require('uuid');

const GenerateUniquId = () => {
  let value = uuidv4().split("-");
  value = value.join("");
  return value;
};

module.exports = { GenerateUniquId };
