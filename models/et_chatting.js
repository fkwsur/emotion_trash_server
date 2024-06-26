module.exports = (sequelize, DataTypes) => {
  const et_chatting = sequelize.define(
    "et_chatting",
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: true,
        unique: true,
      },
      room_id: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
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
      comment: "채팅 로그",
    }
  );
  return et_chatting;
};
