var fs = require('fs');
var mime = require('mime');

var dir = process.cwd();
var numLines = 0;

function countLines(content){
	mime.lookup(content.split('\n')).forEach(function(line){
		if (line.prototype.startsWith != '//' && line.prototype.startsWith != ' '){
			numLines += 1;
		}
	});
	console.Log(numLines);
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
				files.forEach(function(file){
				processFile(file);
			});
		});
	};

processFile(dir);