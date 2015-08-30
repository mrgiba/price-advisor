(function () {
    'use strict';

    var express = require('express'),
        bodyParser = require('body-parser'),
        //routes = require('./server/routes/index'),
        http = require('http'),
        path = require('path'),
        morgan = require('morgan'),
        //expressSession = require('express-session'),
        //cookieParser = require('cookie-parser'),
        app = express();

    app.set('port', process.env.VCAP_APP_PORT || 3000);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(morgan('dev'));

    app.use('/client', express.static(path.join(__dirname, 'client')));
    app.use(express.static(path.join(__dirname, "views")));

    // Catch 404 and forward to Error Handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Error Handlers
    // Development Error Handler - prints stack trace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            res.send(err);
        });
    }

    // Production Error Handler - no stack trace
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.send('Sorry, a problem occurred during your request');
    });

        http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });


    exports.getInstance = function () {
        return app;
    };
}());
