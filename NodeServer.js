var fs = require('fs');
var express = require('express');
var sql = require('sqlite3');
var app = express();
//var busboy = require('connect-busboy');
var random = require('node-random');
var database = connectToDB();

var currLogFile = 'logFile.json';
var infoToLog = [];

function connectToDB(){
	var db = new sql.Database('fileCollection',function(err){
		console.log("Database error: ", err);
	});
	return db;
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
    //console.log("\n\n\n")
    //console.log(data);
    //console.log("\n\n\n");

	data.forEach(function(e) {
		json += "{";
		Object.keys(e).forEach(function(key) {
			var value = e[key];
			json += "\"" + key + ":" + value + "\"";
			//console.log(key);
			//console.log(value);
		});
		json += "}";
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

		database.all("SELECT * FROM collection", function(err, row){
			var data = generateJSON(row);
			console.log(data);
			res.status(200).send(data);
		});
        
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
	res.setHeader('Content-Type','application/json');

	database.get("SELECT * FROM collection WHERE Field1="+fileid,function(err, row){
		if(err) throw err;
		var data = row;
		console.log(data);
  		res.status(200).send(data);
	});

  	next();
});

app.post('/file-upload', function (req,res){
	console.log(req.params);
	infoToLog.push({});

	var file = req.body;

	var sqlCommand = "INSERT INTO collection (Field1) Values (22)";
	dbExec(sqlCommand);

	res.status(200).send('ok');
});

/*
app.delete('/', function (req,res,next){
	infoToLog.push({});
	var item = "";
	var sqlCommand = "DELETE FROM collection WHERE Field1="+itemId;
	dbExec(sqlCommand);
	res.status(200).send('ok');
});
*/

app.head('/', function (req,res,next){
	infoToLog.push({});
	res.status(200).send('ok');
	next();
});

function dbExec(query){
	database.exec(query, function(err){
		if(err){
			console.log(err);
			throw err;
		}
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