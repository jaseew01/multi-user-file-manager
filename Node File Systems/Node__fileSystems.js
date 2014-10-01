var fs = require('fs');
var path = require('path');

var dir = process.cwd();
var filesList = [];
var fileSizes = [];
var jsonString = "";

//attempt Counter
var traverse = function(pathname,callBack){
	//fs.readdir - returns list of files in directory:
	fs.readdir(pathname, function(err, files){
		//for each file in directory:
		files.forEach(function(file){
			//FIX ME
			file = path.join(pathname,file);

			fs.stat(file, function(err, stat){
				if (err) throw err;

        		if (stat && stat.isDirectory()){
					traverse(file,callBack);
				}else{//object is a directory
					callBack(file,stat["size"]);
					//filesList.push(file);
					//fileSizes.push(stat["size"]);
					fs.readFile(file,"utf8", function(err,data){
						//console.log(data);
					});
				}
			});
		});
	});
};

traverse(dir,console.log);





var writeToJsonFile = function()
{
		var json = JSON.stringify({
			Directory : dir,
			files : filesList,
			Sizes : fileSizes
		});

		fs.writeFile("filesInformation.json",json,function(err){
			if (err) throw err;
			console.log("Successfully wrote to file");
		});
};