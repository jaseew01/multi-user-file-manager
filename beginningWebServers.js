var fs = require('fs');
var express = require('express');
var app = express();

var currLogFile = process.argv[3];
var infoToLog = [];

app.use('/', function (req, res, next) {
	//handle request information
	var reqInfo = [];
	console.log(req.route);
	// req.params.forEach(function (item){
	// 	reqInfo.push(item);
	// });
	infoToLog.push({method : req.get('method'), url : req.get('host')+req.originalUrl});
  	res.status(200).send('ok');
  	res.end();
  	next();
});

app.use('/readLogFile', function (req, res, next){
	fs.readFile(currLogFile, function (err, data){
		if (err)throw err;
		res.status(200).send(data);
		res.end();
	});
	next();
});

function checkLogFileSize(){
	fs.stat(currLogFile, function (err, stat){
		if (err) throw err;
		if(stat['size'] >= 1000000){
			var temp = currLogFile.split('.');
			var fileNum = Number(temp[0][temp[0].length-1]) + 1;
			currLogFile = temp[0]+fileNum.toString()+temp[1];
		}
	});
}

function writeToLogFile(){
	if(infoToLog.length > 0){
		var data = JSON.stringify(infoToLog, null, "    ");

		fs.appendFile(currLogFile,data,function(err){
			if (err) throw err;
			infoToLog = [];
			console.log("Successfully wrote to file");
		});
	}
}

setInterval(writeToLogFile, 5000);
setInterval(checkLogFileSize, 10800000);

app.listen(process.argv[2]);