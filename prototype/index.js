const U = require("./user");


class R {}
R.prototype.ReturnBind = (res, data) => {
        try {
          return res.status(200).json(data);
        } catch (error) {
          throw error;
        }
};
      


module.exports = {
        U,
        R
};
      