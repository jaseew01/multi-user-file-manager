var fs = require('fs');
var express = require('express');
var app = express();

var config = fs.readFileSync('serverConfig.json');
var configObject = JSON.parse(config);

var currLogFile = configObject.loggingFile;
var infoToLog = [];

app.use('/', function (req, res, next) {
	var reqInfo = [];
	console.log(req.route);
	// req.params.forEach(function (item){
	// 	reqInfo.push(item);
	// });
	if(req.originalUrl === '/'){
		infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});
  		res.status(200).send('ok');
  	}else{
  		next();
  	}
});

app.use('/readLogFile', function (req, res, next){
	fs.readFile(currLogFile, function (err, data){
		if (err){
			res.status(404).send("File Not Found");
		}else{
			res.status(200).send(data);
		}
	});
});

function checkLogFileSize(){
	fs.stat(currLogFile, function (err, stat){
		if (err) throw err;
		if(stat['size'] >= configObject.fileSize){
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
setInterval(checkLogFileSize, configObject.archiveFreq);

app.listen(configObject.portNum);