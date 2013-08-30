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
        },

        events: {
            "change"        : "change",
            "click .music-menu"   : "musicToggleMenu"
        },
        
        selectMenuItem: function (menuItem) {
            $('.nav li').removeClass('active current-menu-item');
            if (menuItem) {
                $('.' + menuItem).addClass('active current-menu-item');
            }
        },

        musicToggleMenu: function (menuItem) {
            if($('.music-menu').hasClass('active')){
                $('.current-menu-item').addClass('active');
                $('.music-menu').removeClass('active');
                return;
            }
            $('.nav li').removeClass('active');
            $('.music-menu').addClass('active');
        },

    });

});