define(function (require) {

    "use strict";

    var $       = require('jquery'),
    Backbone    = require('backbone/backbone'),
    ShellView   = require('source/views/Shell'),
    HomeView    = require('source/views/Home'),
    util        = require('source/utils'),

    $main = $('#main'),
    shellView = new ShellView({el: $main}).render(),
    $content = $("#content", shellView.el),
    homeView = new HomeView({el: $content});

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "register" : "register",
            "user/:id" : "user"
        },

        home: function () {
            require(["source/views/Home"], function (HomeView) {
                var view = new HomeView({el: $content});
                view.render();
                shellView.selectMenuItem('home-menu');
            });
        },

        register: function(){
            require(["source/views/Register", "source/models/users"], function (RegisterView, model) {
                var $userModel = new model.User();
                var view = new RegisterView({el: $content, model: $userModel});
                view.render();
            });
        },

        user: function (id) {
            require(["source/views/User", "source/models/users"], function (UserView, model) {
                var $userModel = new model.User({_id: id});
                $userModel.fetch({
                    success: function(){
                        var view = new UserView({el: $content, model: $userModel});
                        view.render();
                        shellView.selectMenuItem('play-menu');
                        utils.hideAlert();
                    },
                    error: function () {
                        utils.showAlert('Error', 'An error occurred while trying to fetch this item', 'alert-error');
                    }
                });
            });
        }

    });

});