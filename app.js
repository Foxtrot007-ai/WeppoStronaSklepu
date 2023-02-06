var http = require("http");
var authorize = require('./authorize');
var express = require("express");
var session = require("express-session");
var user = require('./routes');
var mysql = require('mysql');

var app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root1',
    password: '2137',
    database: 'SklepWeppo',
    port: 3307
});


connection.connect();

global.db = connection;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({extended: true}));

app.set('port', 3000);

app.use(express.static('public'));

app.use(session({
                    secret: 'sklep',
                    resave: false,
                    saveUninitialized: true,
                    cookie: {maxAge: 600000}
                }));

app.get('/', user.index);
app.get('/index', user.index);
app.post('/index', user.index);

app.get('/login', user.login);
app.post('/login', user.login);

app.get('/register', user.register);
app.post('/register', user.register);

app.post('/addToCart', user.addToCart);
app.get('/orders', authorize, user.orders);
app.post('/orders', user.orders);

app.get('/logout', user.logout);


app.listen(3000);

console.log("Started");
