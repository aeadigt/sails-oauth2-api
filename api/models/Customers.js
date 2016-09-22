/**
 * Customers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    customer_id: {
        type: 'string',
        required: true,
        unique: true
    },
    name: {
        type: 'string',
        required: true,
        unique: true
    },
    owner: {
        type: 'string',
        required: true,
        unique: true
    },
    apps: {
        model: 'Apps'
    },
    created_by: {
        type: 'string'
    },
    updated_by: {
        type: 'string'
    }
  }
};