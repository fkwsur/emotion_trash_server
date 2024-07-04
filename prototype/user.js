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


U.prototype.UpdateUserBind = (data) => {
  return {
    nickname: data.nickname,
    birth: data.birth,
    gender: data.gender,
    email: data.email,
  };
};


U.prototype.CreateTokenBind = (data) => {
  return {
    authorization: jwt.createToken(data.id),
    refreshauthorization: jwt.createRefreshToken(data.id),
  };
};

U.prototype.VerifyTokenBind = (headers) => {
  try {
    let decoded = jwt.verifyToken(headers.authorization);
    if (decoded.id == undefined) {
      throw {code :27};
    }
    return {
      authorization: decoded.id,
    };
  } catch (error) {
    throw error;
  }
};

U.prototype.UpdateRToken = async (t, id) => {
  try {
    await et_user.update(
      { refresh_token: t.refreshauthorization},
      { where: { id: id } }
    );
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.VerifyRTokenBind = (headers) => {
  try {
    let decoded = jwt.verifyRefreshToken(headers.refreshauthorization);
    if (decoded.id == undefined) {
      throw {code :27};
    }
    return {
      refreshauthorization: decoded.id,
    };
  } catch (error) {
    throw error;
  }
};


U.prototype.findById = async (t) => {
  try {
    const find_user = await et_user.findOne({
      where: { id: t },
    });
    if (!find_user) {
      throw { code: 1 };
    }
    return find_user;
  } catch (error) {
    throw error;
  }
};

U.prototype.Create = async (u) => {
  try {
    await et_user.create(u);
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.CheckFalseUser = async (u, rows) => {
  try {
    const checking = hash.compareHash(u.app_key, rows.app_key);
    return checking;
  } catch (error) {
    return false;
  }
};

U.prototype.SignIn = async (u) => {
  try {
    const rows = await et_user.findOne({
      where: { oauth_id: u.oauth_id },
    });
    if (!rows) throw {code : 11};
    return rows;
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

U.prototype.CheckOauthID = async (u) => {
  try {
    const check_oauth = await et_user.findOne({ where: { oauth_id: u.oauth_id} });
    if (check_oauth) throw {code: 12};
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.UpdateUserInfo = async (id, u) => {
  try {
    await et_user.update(u,
      {
        where: { id: id },
      }
    );
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.CheckAppKey = async (u, rows) => {
  try {
    const checking = hash.compareHash(u.app_key, rows.app_key);
    if (!checking) throw { code: 9 };
    return;
  } catch (error) {
    throw error;
  }
};

U.prototype.UpdateNewAppKey = async (authCode, id) => {
  try {
    let hashing = hash.generateHash(authCode)
    await et_user.update(
      {
        app_key: hashing,
      },
      {
        where: { id: id },
      }
    );
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = U;
