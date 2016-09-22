/**
 * Invites.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    invite_id: {
        type: 'string',
        required: true,
        unique: true
    },
    email: {
        type: 'string',
        email: true,
        required: true,
        unique: true
    },
    customer_id: {
        model: 'Customers'
    },
    app_id: {
        model: 'Apps'
    },
    invite_code: {
        type: 'string',
        required: true,
        unique: true
    }
  }
};

