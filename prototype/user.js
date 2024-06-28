const shortid = require("shortid");
const { et_user, cw_company, sequelize, QueryTypes } = require("../models");
const { jwt, hash } = require("../utils");

class U {}

U.prototype.SignUpBind = (data) => {
  const beforeId = shortid.generate();
  return {
    id: beforeId,
    oauth_id: data.oauth_id,
    nickname: data.nickname,
    app_key: hash.generateHash(data.app_key),
    phone: data.phone,
    birth: data.birth,
    gender: data.birth,
    email: data.email,
    platform: data.platform,
    refresh_token: jwt.createRefreshToken(beforeId.toString()),
  };
};


U.prototype.UserBind = (data) => {
  return {
    oauth_id: data.oauth_id,
    nickname: data.nickname,
    app_key: data.app_key,
    new_app_key: data.new_app_key,
    phone: data.phone,
    birth: data.birth,
    gender: data.gender,
    email: data.email,
    platform: data.platform,
    refreshauthorization: data.refreshauthorization,
  };
};

U.prototype.Create = async (u) => {
  try {
    await et_user.create(u);
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.CheckPhone = async (u) => {
  try {
    const check_phone = await et_user.findOne({ where: { phone: u.phone} });
    if (check_phone) throw { platform: check_phone.platform, code: 13 };
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = U;
