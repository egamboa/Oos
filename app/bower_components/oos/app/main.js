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
            deps: ['underscore/underscore', 'jquery', 'bootstrap'],
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
    $.getJSON('/checkSession', function(data) {
        var logged = false;
        if(data.userid){
            logged = true;
        }
        var router = new Router();
        window.router = router;
        window.router.setLogged(logged);
        window.router.setUserid(data.userid);
        Backbone.history.start();
    });
    
});
