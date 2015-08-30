/**
 * Module dependencies.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./server/routes/index'),
    http = require('http'),
    path = require('path'),
    morgan = require('morgan');

var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

//app.get('/', routes.index);
app.use('/client', express.static(path.join(__dirname, 'client')));
app.set(express.static(path.join(__dirname, 'views')));

//app.get('/:widgetid', function (req, res) {
//    res.render(req.params.widgetid + '.html',
//        {},
//        function (err, html) {
//            if (!err) {
//                return res.send(html);
//            }
//            res.status(404).end();
//        });
//});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
