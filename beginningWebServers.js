var fs = require('fs');
var express = require('express');
var app = express();

var currLogFile = process.argv[3];

app.use('/', function (req, res, next) {
	//handle request information
	var reqInfo = [];
	console.log(req.route);
	// req.params.forEach(function (item){
	// 	reqInfo.push(item);
	// });

  	res.status(200).send('ok');
  	next();
});

app.use('/readLogFile', function (req, res, next){
	fs.readFile(currLogFile, function (err, data){
		if (err) throw err;
		res.send(data);
	})
	next();
});

function checkLogFileSize(){
	fs.stat(currLogFile, function (err, stat){
		if (err) throw err;
		if(stat['size'] >= 1000000){
			var temp = currLogFile.split('.');
			currLogFile = temp[0]+'1'+temp[1];
		}
	});
}

function writeToLogFile(){
	fs.appendFile(currLogFile,"",function(err){
		if (err) throw err;
		console.log("Successfully wrote to file");
	});
}

setInterval(writeToLogFile, 5000);
setInterval(checkLogFileSize, 10800000);

app.listen(process.argv[2]);