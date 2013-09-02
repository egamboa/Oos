define(function (require) {

    "use strict";

    var $        = require('jquery'),
    Backbone     = require('backbone/backbone'),
    ShellView    = require('source/views/Shell'),
    HomeView     = require('source/views/Home'),
    RegisterView = require('source/views/Register'),
    UserView     = require('source/views/Register'),
    util         = require('source/utils'),

    $main = $('#main'),
    shellView = new ShellView({el: $main}).render(),
    $content = $("#content", shellView.el);

    Backbone.View.prototype.close = function () {
        if (this.beforeClose) {
            this.beforeClose();
        }
        this.remove();
        this.unbind();
    };

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "register" : "register",
            "user/:id" : "user"
        },

        initialize: function(){
        },

        showView:function (view) {
            if (this.currentView)
                this.currentView.close();
            $content.html(view.render().el);
            this.currentView = view;
            return view;
        },

        home: function () {
            var view = new HomeView();
            this.showView(view);
            shellView.selectMenuItem('home-menu');
        },

        register: function(){
            var self = this;
            require(["source/models/users"], function (model) {
                var $userModel = new model.User();
                var view = new RegisterView({model: $userModel});
                self.showView(view);
                shellView.selectMenuItem('register-menu');
            });
        },

        user: function (id) {
            require(["source/models/users"], function (model) {
                var $userModel = new model.User({_id: id});
                $userModel.fetch({
                    success: function(){
                        var view = new UserView({el: $content, model: $userModel});
                        self.showView(view);
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