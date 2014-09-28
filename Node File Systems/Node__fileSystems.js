var fs = require('fs');

dir = "C:\Users\John Seewer\Documents\Hanover College Senior Year\Directed Study";
filesList = {};

function traverse(pathname)
{
	//fs.readdir - returns list of files in directory:
	fs.readdir(dir, function(err, files))
	{
		//for each file in directory:
		files.forEach(function(file))
		{
			file = dir + "/" + file;
			fs.stat(file, function(err, stat) {
        		if (stat && stat.isDirectory())
        		{
					traverse(file);
				}
			else //object is a directory
			{
				filesList.push(file);
				var data = fs.readFileSync(file,"utf8");
				console.log(data);
			}
		}
	}
}