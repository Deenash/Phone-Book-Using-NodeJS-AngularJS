var assert = require('chai').assert;
var superagent=require('superagent');

describe('match module', function(){
	it('should add two numbers', function(){
		assert.equal((1+1),2);
		assert.strictEqual(127+379, 506);
	});
});


describe('async module', function(){
	it('check pagination values', function(done){
		superagent.get('http://localhost:3000/getPaginatedData').end(function(err,res){
			if(err){return done(err);}
			console.log("\n\n\n\n\nPrinting Response");
			
			console.log(res.text);
			
			console.log("\n\n\n\n\n");
			assert.isNotNull(res.text);
			assert.equal(res.status, 200);
			done();
		});
			
	});
	
	it('check insertion', function(done){
		superagent.post('http://localhost:3000/insertData')
		.set('Content-type','application/json')
		.send('{"name" : "test", "phonenumber" : "00000", "address" : "test", "emailid": "test@test.com"}')
		.end(function(err,res){
			if(err){return done(err);}
			console.log("res text: "+res.text);
			assert.isNotNull(res.text);
			assert.equal(res.status, 200);
			assert.equal(res.text, 'Number added successfully');
			done();
		});	
	});
	
	
	it('check duplicate entry', function(done){
		superagent.post('http://localhost:3000/insertData')
		.set('Content-type','application/json')
		.send('{"name" : "test", "phonenumber" : "00000", "address" : "test", "emailid": "test@test.com"}')
		.end(function(err,res){
			if(err){return done(err);}
			console.log("res text: "+res.text);
			assert.isNotNull(res.text);
			assert.equal(res.status, 200);
			assert.equal(res.text, 'Entry Error!! Phone Number already exists.');
			done();
		});	
	});
	
	it('check deletion', function(done){
		superagent.delete('http://localhost:3000/deleteData')
		.set('Content-type','application/json')
		.query({phoneNumber: "00000"})
		.end(function(err,res){
			if(err){return done(err);}
			console.log("res text: "+res.text);
			assert.isNotNull(res.text);
			assert.equal(res.status, 200);
			done();
		});	
	});
});