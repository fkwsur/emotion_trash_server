module.exports = (sequelize, DataTypes) => {
  const et_user = sequelize.define(
    "et_user",
    {
      id: {
        type: DataTypes.STRING(11),
        primaryKey: true,
        allowNull: true,
        unique: true,
      },
      // 자체 및 소셜용
      oauth_id: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      // 닉네임
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      app_key: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
      },
      platform: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING(200),
        allowNull: true
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
      underscored: true,
      comment: "유저 정보",
    }
  );
  return et_user;
};
