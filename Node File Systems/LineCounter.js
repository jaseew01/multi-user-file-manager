var fs = require('fs');
var path = require('path');

var dir = process.cwd();
var numLines = 0;

function countLines(content,acc){
	content.split('\n').forEach(function(line){
		if (line != "//" && line != " "){
			acc += 1;
		}else{
			console.log(line);
		}
	});
	console.log(acc);
}

function processFile(file){
		fs.stat(file, function(err, stat){
			if (err) throw err;

    		if (stat && stat.isDirectory()){
				traverse(file);
			}else{
				if (file.split('.')[1] === 'js'){
						fs.readFile(file,"utf8", function(err,data){
						//console.log(file + ':');
						countLines(data,numLines);
					});
				}
			}
		});
	}

function traverse(pathname){
		fs.readdir(pathname, function(err, files){
				files.forEach(function(file){
					processFile(path.join(pathname,file));
			});
		});
	};

processFile(dir);