module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define(
      'Files',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        name: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          unique: true
        },
        path: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          unique: true
        },
        file_key: {
          type: DataTypes.STRING(1024),
          allowNull: false
        },
        s3_bucket: {
          type: DataTypes.STRING(1024),
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        }
      },
      {}
  );
  // Folder.associate = function(models) {
  //   Folder.belongsToMany(models.Video, {
  //     through: models.FolderVideo,
  //     foreignKey: 'folderId',
  //     otherKey: 'videoId',
  //     onDelete: 'cascade',
  //     hooks: true,
  //   });
  // };
  return Files;
};
