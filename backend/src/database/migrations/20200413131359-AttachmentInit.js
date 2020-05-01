'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('attachment', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      originName: {
        type: Sequelize.STRING(255),
        defaultValue: ''
      },
      name: {
        type: Sequelize.STRING(255)
      },
      type: {
        type: Sequelize.STRING(50)
      },
      size: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
