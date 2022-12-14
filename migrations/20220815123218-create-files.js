module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(1024),
        allowNull: false,
        unique: true
      },
      path: {
        type: Sequelize.STRING(1024),
        allowNull: false,
        unique: true
      },
      file_key: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      s3_bucket: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Files');
  }
};
