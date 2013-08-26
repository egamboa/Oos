define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore/underscore'),
        Backbone            = require('backbone/backbone'),
        tpl                 = require('text!tpl/Shell.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function () {
        },

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});