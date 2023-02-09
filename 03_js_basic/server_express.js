var express = require('express');
var app = express();

var square = require('./square');

app.get('/', function(req,res) {
    res.send('Hello World31!');
});

app.listen(3000, function (){
    // console.log('example app server started at http://localhost:3000');
    console.log('The area of a square with a width of 4 is ' + square.area(4));
});