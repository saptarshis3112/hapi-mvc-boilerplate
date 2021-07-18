const authCodes = require("../status_codes");

const success = (h, code, data) => {
  const responseObject = { status: authCodes[code] };
  if (data)
    responseObject.data = data;
  return h.response(responseObject).code(responseObject.status.status_code);
}

const error = (h, code, ex) => {
  const responseObject = { status: authCodes[code] };
  if (ex) {
    console.log(ex);
    responseObject.status.message = ex.message;
  }
  return h.response(responseObject).code(responseObject.status.status_code);
}

module.exports = {
  success,
  error,
};
