/**
 * Roles.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    customer_id: 'Text',
    //customer_id: 'Customers',
    app_id: 'Text',
    //app_id: 'Apps',
    user_id: 'Text',
    //user_id: 'Users',
    role: {
        type: 'string',
        required: true
    }
  }
};