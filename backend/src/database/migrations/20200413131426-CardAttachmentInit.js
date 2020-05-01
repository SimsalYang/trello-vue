'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('cardAttachment', {
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
      boardListCardId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'boardListCard',
          key: 'id'
        }
      },
      attachmentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'attachment',
          key: 'id'
        }
      },
      isCover: {
        type: Sequelize.BOOLEAN,
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
