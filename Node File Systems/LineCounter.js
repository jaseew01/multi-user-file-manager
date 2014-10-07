var fs = require('fs');
var path = require('path');
var mime = require('mime');

var numLines = 0;

function countLines(content){
	mime.lookup(content.split('\n')).forEach(function(line){
		numLines += 1;
	});
}

function processFile(file){
		fs.stat(file, function(err, stat){
			if (err) throw err;

    		if (stat && stat.isDirectory()){
				traverse(file);
			}else{
				if (mime.lookup(file.split('/')[1] === '.js')){
					fs.readFile(file,"utf8", function(err,data){
						countLines(data);
					});
				}
			}
		});
	}

function traverse(pathname){
		fs.readdir(pathname, function(err, files){
			//for each file in directory:
			files.forEach(function(file){
				processFile(file);
				//var currPath = path.join(pathname,file);
			});
		});
	};