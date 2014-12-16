var fs = require('fs');
var express = require('express');
var sql = require('sqlite3');
var app = express();
var Busboy = require('busboy');
var handlebars = require('./handlebars-v2.0.0(1)');
var mime = require('mime');
var uuid = require('node-uuid');
var database = undefined;
connectToDB();

var currLogFile = 'logFile.json';
var infoToLog = [];

app.use(express.static(__dirname + '/downloads'));

function connectToDB(){
	fs.exists('fileCollection',function(exists){
		if(exists){
			console.log("\nDatabase Exists!\n");
			var db = new sql.Database('fileCollection',function(err){
				console.log("Database error: ", err);
				database = db;
			});
		}else{
			console.log("\nDatabase Didn't exist, but was created!\n");
			var db = new sql.Database('fileCollection',function(err){
				console.log("Database error: ", err);
			});
			var query = "CREATE DATABASE fileCollection;";
			query += "CREATE TABLE 'collection'";
			query += "(`filename`	TEXT,`fileid`	TEXT NOT NULL,`date`	INTEGER,`filetype`	TEXT,`size`	INTEGER,`filedata`	BLOB,`link`	TEXT);"
			
			db.exec(query,function(err){
				console.log(err);
				database = db;
			});
		}
	});
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

//Will simply return the collection+JSON file
//Return correct response
app.get('/', function (req, res, next) {
	infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});

	if(database != undefined){
		if(req.originalUrl === '/'){
			infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});
			res.setHeader('Content-Type', 'application/vnd.collection+json');

			database.all("SELECT * FROM collection", function(err, row){
				var data = generateJSON(row);
				console.log(data);
				res.status(200).send(data);
			});
	    }
	}else{
		res.status(500).send("Couldn't connect to Database");
	}
});

app.get('/file/:fileid/html',function (req, res, next){
	var fileid = req.params.fileid;

	fs.readFile('filepage.txt', function (err, data){
		if (err) throw err;

		var template = handlebars.compile(data.toString());
		var values = { "fileid" : fileid };
		var html = template(values);

		res.setHeader('Content-Type','text/html');
		res.status(200).send(html);
	});
});

//Will return the JSON document of the file requested
app.get('/file/:fileid/json', function (req, res, next){
	infoToLog.push({});
	var fileid = req.params.fileid;
	//Ensure that fileid is just a number
	if(/^[0-9a-z]{8}\D[0-9a-z]{4}\D[0-9a-z]{4}\D[0-9a-z]{4}\D[0-9a-z]{12}$/.test(fileid)){
		var sqlCommand = "SELECT * FROM collection WHERE fileid='"+fileid+"'";
		res.setHeader('Content-Type','application/json');

		database.get(sqlCommand, function(err, row){
			if(err) throw err;

			if(row === "undefined"){
				//file not found
				res.status(404).send('file not found');
			}else{
				console.log(sqlCommand);
				var data = row;
				console.log("row data");
				console.log(data);
		  		res.status(200).send(data);
	  		}
		});
	}
	else{
		//Bad Request
		res.status(400).send("Please enter valid file id");
	}
});

app.get('/file/:fileid/download', function (req, res, next){
	infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});

	var fileid = req.params.fileid;
	var sqlCommand = "SELECT * FROM collection WHERE fileid='"+fileid+"'";

	database.get(sqlCommand, function(err, row){
		if (err){
			res.status(500);
			throw err;
		}

		var filename = row["filename"];
		var data = row["filedata"];
		filename += "." + row["filetype"];

		fs.writeFile("downloads/"+filename, data, function (err) {
  			if (err){
				res.status(500);
				throw err;
			}
			res.sendFile(__dirname+"/downloads/"+filename);
			//res.redirect("/downloads/"+filename);
		});
	});
});

app.post('/file', function (req,res){
	infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});

	var sqlCommand = "INSERT INTO collection (filename,fileid,date,filetype,size,filedata,link)";
	sqlCommand += "VALUES ('";

	var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		seperate = filename.split(".");
		var fileid = randomNum();
		var dateObject = new Date();
		date = (dateObject.getMonth()+1).toString() + "/" + dateObject.getDate().toString() + "/" + dateObject.getFullYear().toString();
		sqlCommand += seperate[0] + "','" + fileid + "','" + date + "','" + seperate[1] + "',";
		file.on('data', function(data) {
			console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
			sqlCommand += data.length + ",'" + data + "','" + "/file/"+fileid+"/json" + "')";
		});
	});
	busboy.on('finish', function() {
		console.log('Done parsing form!');
		if(dbExec(sqlCommand) === false){
			res.status(501).send('not implemented');
		}else{
			res.status(201).send('created');
		}
	});
	req.pipe(busboy);
});

app.post('/file/:fileid/delete', function (req,res,next){
	infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});
	
	var fileid = req.params.fileid
	var sqlCommand = "DELETE FROM collection WHERE fileid='"+fileid+"'";
	if(dbExec(sqlCommand) === false){
		res.status(501).send('not implemented');
	}else{
		res.status(200).send('ok');
	}
});

app.head('/', function (req,res,next){
	infoToLog.push({method : req.method, url : req.get('host')+req.originalUrl});

	res.setHeader('Content-Type','text/html; charset=UTF-8');
	res.setHeader('Date',new Date());
	res.setHeader('Connection','close');
	res.status(200).send('ok');
});

function dbExec(query){
	database.exec(query, function(err){
		if(err){
			console.log(err);
			//throw err;
			return false;
		}else{
			return true;
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

function removeOldFiles(){
	fs.readdir('/downloads', function(err, files){
			files.forEach(function(file){
				fs.stat(file, function(err, stat){
					if (err) throw err;
					//if file has existed for more than 24 hours then delete it
					if(new Date().getTime() - stat.ctime.getTime() > 86400000){
						fs.unlink(file,function(err){
							if (err) throw err;
						});
					}
				});
			});
		});
}

function randomNum(){
	var randInt = uuid.v4();

	return randInt;
	database.all("SELECT * FROM collection WHERE fileid="+randInt, function(err, row){
		if(err) throw err;

		if(row.length > 0){
			return randomNum();
		}
		else{
			return randInt;
		}
	});
}

setInterval(writeToLogFile, 60000);
//every 10 hours
setInterval(removeOldFiles, 36000000);

app.listen('8080');
console.log("listening to port 8080");