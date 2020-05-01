'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('boardListCard', {
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
      boardListId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'boardList',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING(255)
      },
      description: {
        type: Sequelize.STRING(2000)
      },
      order: {
        type: Sequelize.FLOAT
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
