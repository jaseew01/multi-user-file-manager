var sql = require('sqlite3');

var db = new sql.Database('fileCollection',function(err){
	console.log("error: ", err);
	var db = this;
	db.all("SELECT * FROM collection", function(err, row){
		console.log(row);
	});
});