var fs = require('fs');
var express = require('express');
var sql = require('mssql'); 
var app = express();

var currLogFile = 'logFile.json';
var infoToLog = [];

var config = {
    user: '...',
    password: '...',
    server: 'localhost',
    database: '...',
}

var connection = new sql.Connection(config, function(err) {
	if (err) throw err;
});

app.get('/', function (req, res, next) {
	console.log(req.route);
	
	if(req.originalUrl === '/'){
		res.writeHead(200, { 'Content-Type': 'application/vnd.collection+json' }); 
  		res.send('ok');
  	}else{
  		next();
  	}
});

//Use regex here?
app.get('/filename', function (req, res, next) {
  		res.status(200).send('ok');
});

app.post('/', function (req,res,next){
	res.status(200).send('ok');
});

app.delete('/', function (req,res,next){
	res.status(200).send('ok');
});

app.head('/', function (req,res,next){
	res.status(200).send('ok');
});


function writeToLogFile(){
	if(infoToLog.length > 0){
		var data = JSON.stringify(infoToLog, null, "    ");

		fs.appendFile(currLogFile,data,function(err){
			if (err){
				throw err;
			}else{
				infoToLog = [];
				console.log("Successfully wrote to file");
			}
		});
	}
}