require.config({
    baseUrl: 'bower_components',
    paths: {
        jquery: 'jquery/jquery',
        bootstrap: '../scripts/vendor/bootstrap',
        tpl: '../scripts/tpl',
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

require(['source/router'], function (Router) {
    var router = new Router();
    window.router = router;
    Backbone.history.start();
});
