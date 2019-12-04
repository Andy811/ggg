
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var username_test = "123";//測試用
var password_test = "123"; //測試用



var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'topic'
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 30},   // cookie保存30分鐘
    rolling: true   // 最後一次操作後可以再保存30分鐘的cookie
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function(req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function(err) {
        if (err) res.send(404);
    });
});
app.get('/homepage', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/views','homepage.html'));
	//response.send('<p id="p1">你好:'+username+'</p>');
});
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views','login.html'));
});
app.get('/error', function(request, response) {
	response.sendFile(path.join(__dirname + '/views','error.html'));
});
app.get('/checkin', function(request, response) {
	response.sendFile(path.join(__dirname + '/views', 'checkin.html'));
});
app.get('/record', function(request, response) {
	response.sendFile(path.join(__dirname +  '/views' , 'record.html'));
});
app.get('/reservation', function(request, response) {
	response.sendFile(path.join(__dirname +  '/views' , 'reservation.html'));
});

app.get('/edit', function(request, response) {
	response.sendFile(path.join(__dirname +  '/views' , 'edit.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;

	if (username && password) {
			connection.query('SELECT * FROM employees WHERE EmployeeID = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/homepage');
				//使用者名稱測試
				
			} else {
				response.redirect('/error');				
			}			
			response.end();
		});
	} else {
		response.send('Please enter Userid and Password!');
		response.end();
	}
});

/*
	if(username==username_test&&password==password_test){
		request.session.loggedin = true;
		request.session.username = username;
		response.redirect('/homepage');
	} else{
		response.redirect('/error');
	}
});
*/
app.listen(3002,function () {
	console.log("已啟動在http://localhost:3002/")
})





