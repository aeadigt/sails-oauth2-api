/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
/*
module.exports = {

  attributes: {

  }
};
*/

/**
 * Users.js
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
        login: {
            type: 'string',
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true,
            email: true,
            unique: true
        },
        hashedPassword: {
            type: 'string',
        },
        activated_code: {
          type: 'string',
          unique: true
        },
        activeted: {
          type: 'boolean'
        },
        created_by: {
          type: 'string'
        },
        updated_by: {
          type: 'string'
        },
        // Override toJSON method to remove password from API
        toJSON: function() {
          var obj = this.toObject();
          delete obj.password;
          return obj;
        }
  },

  beforeCreate: function(values, next) {
    bcrypt.hash(values.password, null, null, function(err, hash) {
      if(err) return next(err);
      values.hashedPassword = hash;
      delete values.password;
      next();
    });
  }
};