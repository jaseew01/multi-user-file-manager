var fs = require('fs');
var express = require('express');
var sql = require('mssql'); 
var app = express();
//var busboy = require('connect-busboy');
var random = require('node-random');

var currLogFile = 'logFile.json';
var infoToLog = [];

function connectToDB(){
	var config = {
	    user: 'jaseew93/John Seewer',
	    password: '0047JaS1193',
	    server: 'JASEEW93\\SQLEXPRESS',
	    database: 'fileCollection'
	};

	var connection = new sql.Connection(config, function(err) {
		console.log(err);
		if (err) throw err;
	});

	return connection;
}

function generateJSONTemplate(){
	var template = '"template" : {\
            "data" : [\
                { "name" : "filename", "value" : "" },\
                { "name" : "date", "value" : "" },\
                { "name" : "filetype", "value" : "" },\
                { "name" : "size", "value" : "" },\
                { "name" : "link", "value" : "" }\
            ]\
        }';
    return template;
}

function generateJSON(data){
	var json = '{ "collection" :\
    {\
        "version" : "1.0",\
        "href" : "",\
        "links" : [],\
        "items" : [';

	data.forEach(function(record){
		console.log(recordset[0]);
	});

	json += "]," + generateJSONTemplate() + "}}";
	return JSON.stringify(json, null, "    ");
}

app.get('/index.html', function (req, res, next){
	res.setHeader('Content-Type', 'text/html');
	fs.readFile('testPostAttach.html', function (err, data){
		if (err){
			res.status(404);
		}else{
			res.status(200);
			res.send(data);
		}
	});
});

//Will simply return the collection+JSON file
//Return correct response
app.get('/', function (req, res, next) {
	if(req.originalUrl === '/'){
		infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});
		res.setHeader('Content-Type', 'application/vnd.collection+json');

		var connection = connectToDB();
		var request = connection.request();
		request.query('select *', function(err, recordset) {
			console.log(err);
        	if (err) throw err;
        	else{
        		var data = generateJSON(recordset);
				res.status(200).send(data);
			}
		});
		connection.close();
  	}else{
  		next();
  	}
});

//'/:fileid'
//req.params.fileid -> will get id value from url
//fileid is a variable placeholder for whatever value gets put into the url
//Use regex here?
app.get('/:fileid', function (req, res, next) {
	infoToLog.push({});
	var fileid = req.params.fileid;
	var obj = JSON.parse(fs.readFileSync('fileList.json'));

	//findfile(filename);

  	res.status(200).send('ok');
  	next();
});

app.post('/file-upload', function (req,res){
	console.log(req);

	infoToLog.push({});
	var file = req.body;
	//var obj = {object you create from file information};
	//^--Remember to use format shown in design procedure
	//updateCollection(obj);
	res.status(200).send('ok');
});

/*
app.delete('/', function (req,res,next){
	infoToLog.push({});
	var item = "";
	//removeItem(item)
	res.status(200).send('ok');
});
*/

app.head('/', function (req,res,next){
	infoToLog.push({});
	res.status(200).send('ok');
	next();
});

//data will be a string in json format
function updateCollection(data){
	var json = JSON.stringify(data, null, "    ");
	var obj = JSON.parse(fs.readFileSync('fileList.json'));

	obj.collection.items.push(json);

	fs.writeFile('fileList.json',JSON.stringify(obj,null, "    "),function(err){
		if (err) throw err;
	});
}

//will be the ID of the item that you want to remove
function removeItem(itemId){
	//Delete item from server
	//Delete item from database
	var obj = JSON.parse(fs.readFileSync('fileList.json'));
	items = obj.collection.items;

	for(i=0;i<items.length;i++){
		if(items[i].fileid == itemId){
			delete obj.items[i];
		}
	};

	fs.writeFile('fileList.json',JSON.stringify(obj,null, "    "),function(err){
		if (err) throw err;
	});
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

//will append a unique 4-digit id to the end of the file name
//function generates a random integer and then checks that it doesn't already exist
//returns new filename
function nameFile(filename){
	random.numbers({
		"number": 1,
		"minimum": 1000,
		"maximum": 9999
	}, function(error, data){
		if (error) throw error;
		//if randNum exists: 
		//return filename+nameFile(filename);
		//else{...}
		return filename+data[0].toString();
	});
}

app.listen('8080');
console.log("listening to port 8080");