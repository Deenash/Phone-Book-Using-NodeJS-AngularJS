
var nodemailer = require('nodemailer');
//var randomstring = require("randomstring");
var express = require('express');
var index = express.Router();
//var crypto = require('crypto');

var mysql = require('mysql');
var Promise = require('bluebird');

//var transporter = nodemailer.createTransport({
//	service: 'Gmail',
//	auth: {
//		user: 'networkloggerinfrateam@gmail.com',
//		pass: 'rcraakgnpxcqrflz'
//	}
//});

var sess;


var connection = mysql.createConnection({
	host: "65.39.193.20",
	user: "asdee714_returnp",
	password: "returnpath",
	database: "asdee714_returnpath"
});

//var twilio = require('twilio');


//var client1 = new twilio.RestClient('AC966326f4f539f7344caeb70364038eae', '07f7bc2e7ae7c7a6b7b178e43bb17c77');

	

//var secretKey = 'v65rr8byhrf29q8dhbci7hec67gqod';

var queryAsync = Promise.promisify(connection.query.bind(connection));
connection.connect();

process.stdin.resume();
process.on('exit', exitHandler.bind(null, { shutdownDb: true } ));


index.get('/',function(req,res){
	res.render('homePage');
});


	
index.get('/getAllData',function(req,res){
	
	var query = "select * from phonebook";
	
	connection.query(query, function(err,rows){
		if(err){
			console.log(err);
		}
//		console.log(rows);
		res.send(rows);
	});
});


index.get('/getPaginatedData',function(req,res){
	
	var numRows;
	var queryPagination;
	var numPerPage = parseInt(req.query.npp, 10) || 1;
	var page = parseInt(req.query.page, 10) || 0;
	var numPages;
	var skip = page * numPerPage;
	
//	console.log(req.query);  
//	console.log(page);
//	console.log(numPerPage);
//	console.log(skip);
	
	// Computing limit parameter for mysql
	
	var end_limit = numPerPage; 
	var limit = skip + ',' + end_limit;
//	console.log('printing limit: '+limit);
	console.log("select * from phonebook order by name LIMIT " + limit);
	
	queryAsync('SELECT count(*) as numRows FROM phonebook')
	  .then(function(results) {
	    numRows = results[0].numRows;
	    numPages = Math.ceil(numRows / numPerPage);
//	    console.log('number of pages:', numPages);
	  })
	  
	  
	  .then(() => queryAsync('SELECT * FROM phonebook order by name LIMIT ' + limit))
	  .then(function(results) {
	    var responsePayload = {
	      results: results
	    };
	    if (page < numPages) {
	      responsePayload.pagination = {
	        current: page,
	        perPage: numPerPage,
	        previous: page > 0 ? page - 1 : undefined,
	        next: page < numPages - 1 ? page + 1 : undefined
	      }
	    }
	    else responsePayload.pagination = {
	      err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
	    }
	    res.json(responsePayload);
	  })
	  .catch(function(err) {
	    console.error(err);
	    res.json({ err: err });
	  });
});



index.post('/insertData',function(req,res){
	
	var name = req.body.name;
	var phonenumber = req.body.phonenumber;
	var address = req.body.address;
	var emailid = req.body.emailid;
	
	var newEntry = { name: name, phonenumber : phonenumber , address : address, emailid : emailid};

	connection.query('INSERT INTO phonebook SET ?', newEntry, function(err,result){
		if(err) {
			console.log(err.code);
			if(err.code === "ER_DUP_ENTRY"){
				res.send('Entry Error!! Phone Number already exists.');
			}
			else{
				res.send(err);
			}
		}else{
			console.log('Number added successfully');
			res.send("Number added successfully");
		}
	});
	
});



index.delete('/deleteData',function(req,res){
	
	var deleteNumber = req.query.phoneNumber;
	console.log("Number to be Deleted: "+deleteNumber);
	
	var query = "delete from phonebook where phonenumber = ?";
	
	connection.query(query, [deleteNumber], function(err,rows){
		if(err){
			console.log(err);
		}
		
		console.log(deleteNumber);
		res.send(rows);
	});
});




function exitHandler(options, err) {
	  if (options.shutdownDb) {
	    console.log('shutdown mysql connection');
	    connection.end();
	  }
	  if (err){
		  console.log(err.stack);
	  }
	  if (options.exit){
		  process.exit();
	  }
}





module.exports = index;
