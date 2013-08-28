define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore/underscore'),
        Backbone            = require('backbone/backbone'),
        tpl                 = require('text!tpl/Register.html'),
        util                = require('source/utils'),

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();    
        },

        render: function () {
            $(this.el).html(template(this.model.toJSON()));
            return this;
        },

        events: {
            "change"        : "change",
            "click .save"   : "beforeSave",
            "click .delete" : "deleteUser"
        },

        change: function (event) {
            // Remove any existing alert message
            utils.hideAlert();

            // Apply the change to the model
            var target = event.target;
            var change = {};
            change[target.name] = target.value;
            this.model.set(change);

            // Run validation rule (if any) on changed item
            var check = this.model.validateItem(target.id);
            if (check.isValid === false) {
                utils.addValidationError(target.id, check.message);
            } else {
                utils.removeValidationError(target.id);
            }
            this.validateVerify(event);
        },

        validateVerify: function (event) {
            var verifyVal = $(event.target);
            if(verifyVal.attr('id') == "verify" || verifyVal.attr('id') == "password"){
                if(verifyVal.length > 4 || $(this.el).find('#password').val() != $(this.el).find('#verify').val()){
                    utils.addValidationError('verify', "Please confirm your password.");
                    $(this.el).find('.save').addClass('disabled');
                }else{
                    utils.removeValidationError('verify');
                    $(this.el).find('.save').removeClass('disabled');
                }
            }
        },

        beforeSave: function (event) {
            var self = this;
            if($(this.el).find('.save').hasClass('disabled')){ 
                event.preventDefault();
                return false; 
            }
            var check = this.model.validateAll();
            if (check.isValid === false) {
                $(this.el).find('.save').addClass('disabled');
                utils.displayValidationErrors(check.messages);
                return false;
            }
            utils.hideAlert();
            this.saveRate();
            return false;
        },

        saveRate: function () {
            var self = this;
            console.log('before save');
            this.model.save(null, {
                success: function (model) {
                    self.render();
                    router.navigate('user/' + model.id, false);
                    utils.showAlert('Success!', 'User saved successfully', 'alert-success');
                }
            });
        },

        deleteUser: function () {
            this.model.destroy({
                success: function () {
                    window.history.back();
                }
            });
            return false;
        }
    });

});