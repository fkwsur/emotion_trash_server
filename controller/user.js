const { handler } = require("../utils");
const util = require('../utils');
const { errorHandler } = handler;
const { U, R } = require("../prototype");
const user = new U();
const r = new R();

module.exports = {
  SignUp: async (req, res) => {
    try {
      let u = user.SignUpBind(req.body);
      await user.Create(u);
      return r.ReturnBind(res, { result: true });
    } catch (error) {
      // r.SendErrorChannel(error, "user -/signup");
      return res.status(200).send(errorHandler(error));
    }
  },
  // 아이디 중복검사, 자체 가입일 때만 사용
  CheckID: async (req, res) => {
    try {
      let u = user.UserBind(req.query);
      await user.CheckPhone(u);
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const authCode = String(randomNum);
      await util.sms.sendAuth(u.phone, authCode);
      return r.ReturnBind(res,{ auth_code : authCode });
    } catch (error) {
      r.SendErrorChannel(error, "user -/check/phone");
      return res.status(200).send(errorHandler(error));
    }
  },
  CheckPhone: async (req, res) => {
    try {
      let u = user.UserBind(req.query);
      await user.CheckPhone(u);
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const authCode = String(randomNum);
      await util.sms.sendAuth(u.phone, authCode);
      return r.ReturnBind(res,{ auth_code : authCode });
    } catch (error) {
      // r.SendErrorChannel(error, "user -/check/phone");
      return res.status(200).send(errorHandler(error));
    }
  },
};
