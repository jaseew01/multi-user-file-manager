var fs = require('fs');
var express = require('express');
var sql = require('sqlite3');
var app = express();
var Busboy = require('busboy');
var random = require('random-js');
var handlebars = require('./handlebars-v2.0.0(1)');
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

	json.collection.template = generateJSONTemplate()
	return JSON.stringify(json, null, "    ");
}

function generateFileHTML(fileid){
	var source = "<!DOCTYPE html><html><head><title>File: {{fileid}}</title></head><body>";
	source += "<a href =\"/file/{{fileid}}/download\">Download File</a><br /><br />";
	source += "<form method=\"post\" action=\"/file/{{fileid}}/delete\" enctype=\"multipart/form-data\">";
	source += "<input type=\"submit\" value=\"Delete\"></form>"
	source += "</body></html>";

	var template = handlebars.compile(source);

	var data = { "fileid" : fileid };
	var html = template(data);

	return html;
}

app.get('/index', function (req, res, next){
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

app.get('/file/:fileid/html',function (req, res, next){
	var fileid = req.params.fileid;
	var html = generateFileHTML(fileid);

	res.setHeader('Content-Type','text/html');
	res.status(400).send(html);
});

//Will return the JSON document of the file requested
app.get('/file/:fileid/json', function (req, res, next){
	infoToLog.push({});
	var fileid = req.params.fileid;
	//Ensure that fileid is just a number
	if(/\d+$/.test(fileid)){
		var sqlCommand = "SELECT * FROM collection WHERE fileid="+fileid;
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

app.get('/file/:fileid/download', function (req, res, next){
	var fileid = req.params.fileid;
	var options = {
		root: '',
		dotfiles: 'deny',
		headers:{
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	var sqlCommand = "SELECT * FROM collection WHERE fileid="+fileid;

	database.get(sqlCommand, function(err, row){
		var filename = row["filename"];
		var data = row["filedata"];

		res.sendFile(filename, options, function (err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
			else {
				console.log("Sent: ", filename);
			}
		}
	});
});

app.post('/file-upload', function (req,res){
	infoToLog.push({});

	var sqlCommand = "INSERT INTO collection (filename,fileid,date,filetype,size,filedata,link)";
	sqlCommand += "VALUES ('";//'file','3','121314','txt','472','aiovnweoivnx')";

	var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		seperate = filename.split(".");
		var fileid = randomNum();
		var date = '11/12/14';
		sqlCommand += seperate[0] + "','" + fileid + "','" + date + "','" + seperate[1] + "','";
		file.on('data', function(data) {
			console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
			sqlCommand += data.length + "','" + data + "','" + "/file/"+fileid + "')";
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
	var fileid = req.params.fileid
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

//GUID not random-js <-----
function randomNum(){
	var randInt = random.integer(1,100000);
	console.log("here");
	console.log(randInt);

	return 10;
	//database.all("SELECT * FROM collection WHERE fileid="+randInt, function(err, row){
	//	if(err) throw err;

	//	console.log("\n\nhere\n\n");
	//	console.log(row);

	//	if(row.length > 0){
	//		return randomNum();
	//	}
	//	else{
	//		return randInt;
	//	}
	//});
}

app.listen('8080');
console.log("listening to port 8080");