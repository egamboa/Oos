require.config({
    baseUrl: '../bower_components',
    paths: {
        jquery: 'jquery/jquery',
        bootstrap: '../scripts/vendor/bootstrap',
        tpl: '/scripts/tpl',
        source: '../scripts/source',
        text: '../scripts/text'
    },
    shim: {
        'backbone/backbone': {
            deps: ['underscore/underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore/underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['source/router'], function (Router, fk_bg) {
    var router = new Router();
    Backbone.history.start();
});
