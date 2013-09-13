define(function (require) {

    "use strict";

    var $        = require('jquery'),
    Backbone     = require('backbone/backbone'),
    ShellView    = require('source/views/Shell'),
    HomeView     = require('source/views/Home'),
    RegisterView = require('source/views/Register'),
    OosView      = require('source/views/Oos'),
    UserView     = require('source/views/User'),
    util         = require('source/utils'),

    $main = $('#main'),
    shellView = new ShellView({el: $main}).render(),
    $content = $("#content", shellView.el);
    $('.dropdown-toggle').dropdown();

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
            "user/:id" : "user",
            "oos" : 'showOos',
            "logout" : "logout"
        },

        initialize: function(){
            var self = this;
            var isLogged = false;
            var userId = "";

            this.getLogged = function () {
              return isLogged;
            };

            this.getUserid = function () {
              return userId;
            };

            this.setLogged = function (value) {
                if (typeof(value) === "boolean") {
                    isLogged = value;
                    return true;
                } else {
                    return false;
                }
            };
            this.setUserid = function (value) {
                if (typeof(value) === "string") {
                    userId = value;
                    return true;
                } else {
                    return false;
                }
            };
        },

        showView:function (view) {
            if (this.currentView)
                this.currentView.close();
            $content.html(view.render().el);
            this.currentView = view;
            return view;
        },

        home: function () {
            if(this.getLogged()){
                window.router.navigate('user/' + this.getUserid(), {trigger: true});
            }
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
            if(!this.getLogged()){
                window.router.navigate('/', {trigger: true});
                return false;
            }
            var self = this;
            require(["source/models/users"], function (model) {
                var $userModel = new model.User({_id: id});
                $userModel.fetch({
                    success: function(){
                        var view = new UserView({model: $userModel});
                        self.showView(view);
                        shellView.selectMenuItem('home-menu');
                        shellView.loggedUserMenu();
                    },
                    error: function () {
                        utils.showAlert('Error', 'An error occurred while trying to fetch this item', 'alert-error');
                    }
                });
            });
        },

        logout: function() {
            $.getJSON('/logout', function(data) {
                if(data.message){
                    utils.showAlert('', data.message, 'alert-success');
                    shellView.logoutUserMenu();
                    window.router.setLogged(false);
                    window.router.navigate('/', {trigger: true});
                }
            });
        },

        showOos: function () {
            if(!this.getLogged()){
                window.router.navigate('/', {trigger: true});
                return false;
            }
            var self = this;
            var view = new OosView();
            self.showView(view);
            shellView.selectMenuItem('oos-menu');
        }

    });

});