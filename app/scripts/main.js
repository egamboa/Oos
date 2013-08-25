require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery', 'bootstrap', 'funky-bg'], function (app, $) {
    'use strict';
});
