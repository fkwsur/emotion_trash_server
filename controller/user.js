const { handler } = require("../utils");
const util = require("../utils");
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
      return res.status(200).send(errorHandler(error));
    }
  },
  SignIn: async (req, res) => {
    try {
      let u = user.UserBind(req.body);
      const rows = await user.SignIn(u);
      const CheckFalseUser = await user.CheckFalseUser(u, rows);
      if (!CheckFalseUser) throw { code: 9 };
      let t = user.CreateTokenBind(rows);
      await user.UpdateRToken(t, rows.id);
      return r.ReturnBind(res, t);
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },
  // 아이디 중복검사, 자체 가입일 때만 사용
  CheckOauthID: async (req, res) => {
    try {
      let u = user.UserBind(req.query);
      await user.CheckOauthID(u);
      return r.ReturnBind(res, { result: true });
    } catch (error) {
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
      return r.ReturnBind(res, { auth_code: authCode });
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },
  // 활동 중 토큰 만료 재발급
  IssueToken: async (req, res) => {
    try {
      const issueId = user.VerifyRTokenBind(req.headers);
      const rows = await user.findById(issueId.refreshauthorization);
      let authorization = util.jwt.createToken(rows.id.toString());
      return r.ReturnBind(res, { authorization });
    } catch (error) {
      console.log(error);
      return res.status(200).send(errorHandler(error));
    }
  },

  GetUserInfo: async (req, res) => {
    try {
      let t = user.VerifyTokenBind(req.headers);
      const rows = await user.findById(t.authorization);
      console.log(rows)
      return r.ReturnBind(res, { result: rows });
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },

  UpdateUserInfo : async (req, res) => {
    try {
      let t = user.VerifyTokenBind(req.headers);
      let u = user.UpdateUserBind(req.body);
      await user.UpdateUserInfo(t.authorization, u);
      return r.ReturnBind(res,{ result: true});
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },

  ChangePassword : async (req, res) => {
    try {
      let t = user.VerifyTokenBind(req.headers);
      let u = user.UserBind(req.body);
      const rows = await user.findById(t.authorization);
      await user.CheckAppKey(u, rows);
      await user.UpdateNewAppKey(u.new_app_key, t.authorization);
      return r.ReturnBind(res,{ result: true});
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },

};
