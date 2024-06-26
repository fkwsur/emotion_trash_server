const shortid = require("shortid");
module.exports = (sequelize, DataTypes) => {
  const et_chatting_room = sequelize.define(
    "et_chatting_room",
    {
      id: {
        type: DataTypes.STRING(11),
        primaryKey: true,
        allowNull: true,
        unique: true,
      },
      user_id: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING(300),
        allowNull: false
      },
      // 상담중, 상담종료
      talking: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      counselor: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE(6),
        allowNull: false,
        field: "createdAt",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updatedAt",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      comment: "대화방 정보",
    }
  );
  et_chatting_room.beforeCreate((et_chatting_room, options) => {
    const pri_id = shortid.generate();
    idok = shortid.isValid(pri_id);
    if (!idok) {
      pri_id = pri_id + Math.random().toString(36).substring(2, 4);
    }
    return (et_chatting_room.id = pri_id);
  });
  return cw_chatting_room;
};
