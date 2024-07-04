const error_code = require("./error_code.json");

module.exports = {
  errorHandler: (err) => {
    let code = 1;
    if (err.code) {
      code = err.code;
    } else {
      if (err.name) {
        if (err.name.includes("TokenExpiredError")) {
          return { expired: true };
        } else if (err.name.includes("JsonWebTokenError")) {
          code = 5;
        } else {
          return { error: err.toString() };
        }
      }
    }
    if (err.code == 13) {
      return {
        error: error_code[code],
        platform: err.platform,
      };
    } else if (err.code == "ERR_BAD_REQUEST") {
      return {
        error: err.response.data.errors[0].toString(),
      };
    }
    return {
      error: error_code[code],
    };
  },
  responseHandler: () => {
    return {};
  },
};
