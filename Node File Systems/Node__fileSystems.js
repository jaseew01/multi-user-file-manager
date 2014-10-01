var fs = require('fs');

var dir = "C:\Users\John Seewer\Documents\Hanover College Senior Year\Directed Study";
var filesList = {};
var fileSizes = {};
var jsonString = "";

var traverse = function(pathname)
{
	//fs.readdir - returns list of files in directory:
	fs.readdir(dir, function(err, files)
	{
		//for each file in directory:
		files.forEach(function(file)
		{
			file = dir + "/" + file;
			fs.stat(file, function(err, stat)
			{
				if (err) throw err;
        		if (stat && stat.isDirectory())
        		{
					traverse(file);
				}
				else //object is a directory
				{
					filesList.push(file);
					fileSizes.push(stat["size"]);
					var data = fs.readFileSync(file,"utf8");
					console.log(data);
				}
			});
		});
	});
};

var writeToJsonFile = function()
{
		var json = JSON.stringify(
		{
			Directory : dir,
			files : filesList,
			Sizes : fileSizes
		});

		fs.writeFile("filesInformation.json",json,function(err)
		{
			if (err) throw err;
			console.log("Successfully wrote to file");
		});
};