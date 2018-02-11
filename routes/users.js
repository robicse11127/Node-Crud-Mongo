var express 	= require( 'express' );
var router 		= express.Router();
var mongo 		= require( 'mongodb' ).MongoClient;
var objectId 	= require( 'mongodb' ).ObjectId;
var assert 		= require( 'assert' );

const url 		= 'mongodb://localhost:27017'; // MongoDB Connection Url
const dbname 	= 'node_crud'; // Database Name


/* Add New User */
router.get('/add', function(req, res, next) {
  	res.render( 'add', { title: 'Add New' } );
});

/* Insert a User */
router.post('/add', function(req, res, next) {
	var user = {
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
		bio: req.body.bio,
		photo: req.body.photo
	};
	mongo.connect( url, function( err, db ) {
		if (err) throw err;
	  	var dbo = db.db( dbname );
	  	dbo.collection( 'users' ).insertOne( user, function( err, res ) {
	    	if ( err ) throw err;
	    	console.log("1 document inserted");
	    	db.close();
	  	});
	});
	res.redirect( '/users/add' ); // Redirect after inserting data into DB.
});

/* Fetch All User */
router.get('/list', function(req, res, next) {
	var users = [];
	mongo.connect( url, function( err, db ) {
		var dbo = db.db( dbname );
		var cursor = dbo.collection( 'users' ).find();
		cursor.forEach( function( doc, err ) {
			if( err ) throw err;
			users.push( doc );
		}, function() {
			db.close();
			res.render( 'show', { title: 'Users List', users: users } );
		});
	});
});

/* Edit User */
router.get( '/:id/edit', function( req, res, next ) {
	var user = [];
	mongo.connect( url, function( err, db ) {
		var dbo = db.db( dbname );
		var cursor = dbo.collection( 'users' ).find({ "_id": new objectId( req.params.id ) });
		cursor.forEach( function( doc, err ) {
			if( err ) throw err;
			user.push( doc );
		}, function() {
			db.close();
			res.render( 'edit', { title: 'Edit User', user: user } );
		});
	});
});

/* Update User */
router.post('/:id/edit', function(req, res, next) {
	// console.log( 'ok' );
	var user = {
		name: req.body.name,
		username: req.body.username,
		bio: req.body.bio,
		// photo: req.body.photo
	};
	var user_id = req.params.id;
	mongo.connect( url, function( err, db ) {
		if (err) throw err;
	  	var dbo = db.db( dbname );
	  	dbo.collection( 'users' ).updateOne( { "_id": new objectId( user_id ) }, { $set: user }, function( err, res ) {
	    	if ( err ) throw err;
	    	console.log( "1 document updated" );
	    	db.close();
	  	});
	});
	res.redirect( '/users/'+user_id+'/edit' ); // Redirect after inserting data into DB.
});

// Delete a User
router.get( '/:id/delete', function( req, res, next ) {
	var user_id = req.params.id;
	mongo.connect( url, function(err, db ) {
		if( err ) throw err;
		var dbo = db.db( dbname );
		dbo.collection( 'users' ).deleteOne( {"_id": new objectId( user_id )}, function( err, res ) {
			if( err ) throw err;
			console.log( 'Item Deleted' );
			db.close();
		});
	});
	res.redirect( '/users/list' );
});

module.exports = router;
