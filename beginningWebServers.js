var express = require('express');
var app = express();

app.use('/', function (req, res, next) {
	//handle request information
	var reqInfo = [];
	req.params.forEach(function (item){
		reqInfo.push(item);
	});

  	res.status(200).send('ok');
  	next();
});

app.use('/remove', function (req, res, next){
	next();
});

//log file @: process.argv[3]
app.listen(process.argv[2]);