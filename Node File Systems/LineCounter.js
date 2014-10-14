var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var dir = process.cwd();
var numLines = 0;

function FileTraversal(pathname){
	this.pathname = pathname;
	this.jsonObjects = [];
	this.temp = 0;
};

util.inherits(FileTraversal,EventEmitter);
FileTraversal.prototype.increment = function increment(){
	this.temp += 1;
};

FileTraversal.prototype.addObject = function addObject(item){
	this.jsonObjects.push(item);
	console.log(item);
};

FileTraversal.prototype.decrement = function decrement(){
	this.temp -= 1;
	if(this.temp === 0){
		this.done();
	}
}

FileTraversal.prototype.done = function done(){
	this.emit("done",this.jsonObjects);
}

FileTraversal.prototype.run = function run(){
	var that = this;

	//append to json objects to array, add array to jsonObject.
	function countLines(content,accumulator,file){
		content.split('\n').forEach(function(line){
			if (line != "[\t\s]+//\w+" && line != "[\s\t]+"){
				accumulator += 1;
			}else{
				console.log(line);
			}
		});
		that.addObject({name : file, lines : accumulator});
	}

	function processFile(file){
		that.increment();
		fs.stat(file, function(err, stat){
			if (err) throw err;

			if (stat && stat.isDirectory()){
				traverse(file);
			}else{
				if (file.split('.')[1] === 'js'){
						fs.readFile(file,"utf8", function(err,data){
						//console.log(file + ':');
						countLines(data,numLines,path.basename(file));
					});
				}
			}
			that.decrement();
		});
	}

	function traverse(pathname){
		that.increment();
		fs.readdir(pathname, function(err, files){
			files.forEach(function(file){
				processFile(path.join(pathname,file));
			});
			that.decrement();
		});
	};
	processFile(that.pathname);
}

var myTraverser = new FileTraversal(dir);
myTraverser.on("done",printJsonObject);
myTraverser.run();

function printJsonObject (objectArray){
	var json = JSON.stringify(objectArray, null, "    ");
	process.stdout.write(json);
}