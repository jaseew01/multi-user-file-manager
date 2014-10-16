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
	this.directorySize = 0;
};

util.inherits(FileTraversal,EventEmitter);
FileTraversal.prototype.increment = function increment(){
	this.temp += 1;
};

FileTraversal.prototype.addObject = function addObject(item){
	this.jsonObjects.push(item);
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

//maybe use event emmiter instead of accumulator
	function countLines(content,accumulator,file){
		var commented = false;
		var expression = new RegExp('^\\s*(//|$)');

		content.split('\n').forEach(function(line){
			if (!expression.test(line)){
				accumulator += 1;
			}else{
				//console.log(line);
			}
		});
		that.addObject({name : file, lines : accumulator});
	}

	function processFile(file){
		that.increment();
		var count = 0;
		fs.stat(file, function(err, stat){
			if (err) throw err;

			if (stat && stat.isDirectory()){
				traverse(file);
			}else{
				if (file.split('.')[1] === 'js'){
					that.increment();
					fs.readFile(file,"utf8", function(err,data){
						//console.log(file + ':');
						count = countLines(data,numLines,path.basename(file));
						that.decrement();
					});
				}
			}
			that.directorySize += stat["size"];
			that.decrement();
		});
		return count;
	}

	function traverse(pathname){
		that.increment();
		var total = 0;
		fs.readdir(pathname, function(err, files){
			files.forEach(function(file){
				total += processFile(path.join(pathname,file));
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