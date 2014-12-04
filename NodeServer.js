var fs = require('fs');
var express = require('express');
var sql = require('sqlite3');
var app = express();
var Busboy = require('busboy');
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
	var template ={};
	template.data = [];
	var temp = ["filename","fileid","date","filetype","size","filedata"];
	temp.forEach(function(item){
		template.data.push({ "name" : item, "value" : " " });
	});

    return template;
}

function generateJSON(data){
	var json = {};
	json.collection = {};
	json.collection.version = "1.0";
	json.collection.href = "";
	json.collection.links = [];
	json.collection.items = data;

	/*
	data.forEach(function(e) {
		Object.keys(e).forEach(function(key) {
			var value = e[key];
			json.collection.items.push({key:value});
			//console.log(value);
		});
	});
	*/
	json.collection.template = generateJSONTemplate()
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

app.get('/delete.html',function (req, res, next){
	res.setHeader('Content-Type', 'text/html');
	fs.readFile('delete.html', function (err, data){
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
//**file/:fileid**
app.get('/file/:fileid', function (req, res, next) {
	infoToLog.push({});
	var fileid = req.params.fileid;
	//Ensure that fileid is just a number
	if(/\d+$/.test(fileid)){
		var sqlCommand = "SELECT * FROM collection WHERE Field1="+fileid.slice(1);
		res.setHeader('Content-Type','application/json');

		database.get(sqlCommand, function(err, row){
			if(err) throw err;
			console.log(sqlCommand);
			var data = row;
			console.log("row data");
			console.log(data);
	  		res.status(200).send(data);
		});
	}
	else{
		//Bad Request
		res.status(400).send("Enter number for File ID");
	}
});

app.post('/file-upload', function (req,res){
	infoToLog.push({});

	var sqlCommand = "INSERT INTO collection (filename,fileid,date,filetype,size,filedata)";
	sqlCommand += "VALUES ('";//'file','3','121314','txt','472','aiovnweoivnx')";

	var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		seperate = filename.split(".");
		var fileid = 5;
		var date = '11/12/14';
		sqlCommand += seperate[0] + "','" + fileid + "','" + date + "','" + seperate[1] + "','";
		file.on('data', function(data) {
			console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
			sqlCommand += data.length + "','" + data + "')";
		});
	});
	busboy.on('finish', function() {
		console.log('Done parsing form!');
		dbExec(sqlCommand);
	});
	req.pipe(busboy);

	res.status(200).send('ok');
});

//make form to hit app.delete();
app.post('/file/:fileid/delete', function (req,res,next){
	infoToLog.push({});
	var item = "";
	var fileid = req.get("fileToDelete");
	var sqlCommand = "DELETE FROM collection WHERE fileid="+fileid;
	dbExec(sqlCommand);
	res.status(200).send('ok');
});

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