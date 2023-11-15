var express = require('express');
var app = express();



// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(8080);

// use res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.send('Welcome to the home page!');
});

// listener page
app.get('/listener', function (req, res) {
    var username = "Jimmy";
    res.render('pages/listener', {
        username: username
    });
});

// producer page
app.get('/producer', function (req, res) {
    var username = "Producer User";
    res.render('pages/producer', {
        username: username
    });
});

// DJ page
app.get('/dj', function (req, res) {
    var username = "DJ User";
    res.render('pages/dj', {
        username: username
    });
});

console.log('Server is listening on port 8080');