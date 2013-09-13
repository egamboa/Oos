define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore/underscore'),
        Backbone            = require('backbone/backbone'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        events: {
            "click .send-login"   : "loginUser"
        },

        render: function(eventName) {
            $(this.el).html(template());    
            return this;
        },

        validateLogin: function (){
          if(this.$el.find('#username').val() == ""){
            utils.addValidationError('username', "Empty soul");
            return true;
          }
          if(this.$el.find('#password').val() == ""){
            utils.removeValidationError('username');
            utils.addValidationError('password', "Please confirm your password.");
            return true;
          }
          utils.hideAlert();
          return false;
        },

        loginUser: function (e) {
            var self = this, errors = false;
            e.preventDefault();
            if(self.validateLogin()) return false;
            utils.removeValidationError('username');
            utils.removeValidationError('password');
            $.ajax({
               type: "POST",
               url: '/',
               data: {username: self.$el.find('#username').val(), password: self.$el.find('#password').val()},
               success: function(data)
               {
                  console.log(data);
                  if(data.status == false){
                    utils.showAlert('Error:', data.message, 'alert-error');
                  }else{
                    window.router.setLogged(true);
                    window.router.setUserid(data.user._id);
                    window.router.navigate('user/' + data.user._id, {trigger: true});
                  }
               }
            });
        }

    });

});