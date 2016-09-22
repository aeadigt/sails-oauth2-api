/**
 * Roles.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    customer_id: {
        model: 'Customers'
    },
    app_id: {
        model: 'Apps'
    },
    user_id: {
        model: 'Users'
    },
    role: {
        type: 'string',
        required: true
    }
  }
};