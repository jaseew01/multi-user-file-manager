var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var dir = process.cwd();

var fileSizes = [];
var jsonString = "";

function FileTraversal(pathname){
	this.pathname = pathname;
	this.filesList = [];
	this.acc = 0;
};

util.inherits(FileTraversal,EventEmitter);
FileTraversal.prototype.increment = function increment(){
	this.acc += 1;
};

FileTraversal.prototype.decrement = function decrement(){
	this.acc -= 1;
	if(this.acc === 0){
		this.done();
	}
}

FileTraversal.prototype.done = function done(){
	this.emit("done",this.filesList);
	//console.log("Inside done()");
	//callBack(filesList);
}

FileTraversal.prototype.run = function run(){
	var that = this;

	function processFile(file){
		that.increment();

		fs.stat(file, function(err, stat){
			//console.log("CheckPoint 1: ", file);
			if (err) throw err;

    		if (stat && stat.isDirectory()){
				traverse(file);
			}else{
				that.filesList.push({name: path.basename(file), size: stat["size"]});
				that.emit("fileFound", {name: path.basename(file), size: stat["size"]});
				fs.readFile(file,"utf8", function(err,data){
					//console.log(data);
				});
			}
			that.decrement();
		});
	}

	function traverse(pathname){
		//fs.readdir - returns list of files in directory:
		that.increment();
		
		fs.readdir(pathname, function(err, files){
			//for each file in directory:
			files.forEach(function(file){
				processFile(path.join(pathname,file));

			});
			that.decrement();
		});
	};
	processFile(that.pathname);
}

//preTraverse(dir,writeToJsonFile);
var myTraverser = new FileTraversal(dir);
myTraverser.on("done",writeToJsonFile);
myTraverser.on("fileFound", console.log);
myTraverser.on("done", console.log);
myTraverser.run();

function writeToJsonFile(files){
	var json = JSON.stringify(files, null, "    ");

	fs.writeFile("filesInformation.json",json,function(err){
		if (err) throw err;
		console.log("Successfully wrote to file");
	});
};