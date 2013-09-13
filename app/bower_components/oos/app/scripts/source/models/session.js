define(function (require) {
 
    "use strict";
 
    var $           = require('jquery'),
        Backbone    = require('backbone/backbone'),
        Session = Backbone.Model.extend({
 
            urlRoot: "/session",
            idAttribute: "_id",

            defaults: {
                _id: null,
                userid: ""
            },

            initialize: function () {
                
            }
        }),
 
        SessionCollection = Backbone.Collection.extend({
 
            model: Session,
 
            url: "/sessions"
 
        });
    return {
        Session: Session
    };
 
});