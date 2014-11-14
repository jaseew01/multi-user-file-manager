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

//var connection = new sql.Connection(config, function(err) {
//	if (err) throw err;
//});

app.get('/', function (req, res, next) {
	console.log(req.route);
	res.status(200).send('ok');
	/*
	if(req.originalUrl === '/'){
		res.writeHead(200, { 'Content-Type': 'application/vnd.collection+json' });
		res.json({});
  		res.send('ok');
  	}else{
  		next();
  	}
  	*/
});

//'/:fileid'
//req.params.fileid -> will get id value from url
//fileid is a variable placeholder for whatever value gets put into the url
//Use regex here?
app.get('/:fileid', function (req, res, next) {
	var fileid = req.params.fileid;
	var obj = JSON.parse(fs.readFile('fileList.json', 'utf8'));

  	res.status(200).send('ok');
  	next();
});

app.post('/', function (req,res){
	console.log(req);
	//var obj = {object you create from file information};
	//^--Remember to use format shown in design procedure
	//updateCollection(obj);
	res.status(200).send('ok');
});
/*
app.delete('/', function (req,res,next){
	var item = "";
	//removeItem(item)
	res.status(200).send('ok');
});
*/
app.head('/', function (req,res,next){
	res.status(200).send('ok');
	next();
});

//data will be a string in json format
function updateCollection(data){
	var json = JSON.stringify(data, null, "    ");
	var obj = JSON.parse(fs.readFileSync('fileList.json'));

	obj.collection.items.push(json)

	fs.appendFile('fileList.json',JSON.stringify(object,null, "    "),function(err){
		if (err) throw err;
	});
}

function removeItem(item){
	//
}

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

app.listen('8080');
console.log("listening to port 8080");