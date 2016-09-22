/**
 * Clients.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    client_id: {
        type: 'string',
        required: true,
        unique: true
    },
    client_secret: {
        type: 'string',
        required: true,
        unique: true
    },
    callback: {
        type: 'string'
    },
    redirect: {
        type: 'string',
        required: true
    }
  }
};