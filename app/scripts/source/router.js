define(function (require) {

    "use strict";

    var $       = require('jquery'),
    Backbone    = require('backbone/backbone'),
    ShellView   = require('source/views/Shell'),
    HomeView    = require('source/views/Home'),

    $main = $('#main'),
    shellView = new ShellView({el: $main}).render(),
    $content = $("#content", shellView.el),
    homeView = new HomeView({el: $content});

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "register" : "register"
        },

        home: function () {
            require(["source/views/Home"], function (HomeView) {
                var view = new HomeView({el: $content});
                view.render();
            });
        },

        register: function(){
            require(["source/views/Register", "source/models/users"], function (RegisterView, model) {
                var $userModel = new model.User();
                var view = new RegisterView({el: $content, model: $userModel});
                view.render();
            });
        }

    });

});