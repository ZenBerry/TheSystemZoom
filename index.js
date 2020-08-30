const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const { MongoClient } = require("mongodb");
const url = "mongodb+srv://zenberry:mongoPass8@cluster0-xmkeu.mongodb.net/sample_restaurants?retryWrites=true&w=majority";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "test";

const app = express();


const http = require("http").Server(app);
const io = require("socket.io")(http);



var initial = true
var serverData = null



io.on("connection", function(socket) {

	var socketID = socket.id	

  console.log("SOCKET CONNECTED. ID = ", socket.id)
  
  io.to(socket.id).emit("socketInfo", socket.id) //emitting socket id to different clients


  if (initial === true) {



  	MongoClient.connect(url, {useUnifiedTopology: true}, { useNewUrlParser: true }, function(err, db) { 
  	  if (err) throw err;
  	  var dbo = db.db("finance");
  	  var myquery = { Name: "cashTest1" };
  	  // var newvalues = { $set: {Note : req.body.title} };


  	dbo.collection("finance").find(myquery).toArray(function(err, result) {
  	  if (err) throw err;
  	  // console.log(result[0].Value);

  	  serverData = Number(result[0].Value)
  	  io.emit("new-remote-operations", serverData);

  	  // console.log(result[0].Name);
  	  db.close();
  	  
  	});

  	});

    
    initial = false

  } else {
    io.emit("new-remote-operations", serverData);
  }

  socket.on("drag", function(data) { 

  	console.log(data)
  	io.emit("remoteDrag", data, socketID);

  })

  socket.on("new-operations", function(data) {

    io.emit("new-remote-operations", data); //sending new data back to client
    serverData = data


    MongoClient.connect(url, {useUnifiedTopology: true}, { useNewUrlParser: true }, function(err, db) {
    	//sending new data back to the DB

	      if (err) throw err;
	      var dbo = db.db("finance");
	      var myquery = { Name: "cashTest1" };

	      var newvalues = { $set: {Value: serverData} };


	     


	      dbo.collection("finance").updateOne(myquery, newvalues, function(err, res) {
	        if (err) throw err;
	        console.log("1 document updated");

	        db.close();
	        
	      });

     

    }); //MongoClient.connect END


    
  }); //socket.on("new-operations" END

  socket.on("read", function() {

    console.log("READ EMITTED")




    io.emit("readResponse", serverData);
    io.emit("new-remote-operations", serverData);

    
  });

  });


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

// Put all API endpoints under '/api'


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  MongoClient.connect(url, {useUnifiedTopology: true}, { useNewUrlParser: true }, function(err, db) { 
    if (err) throw err;
    var dbo = db.db("test");
    var myquery = { Name: "Hey Hey, writing from React!" };
    var newvalues = { $set: {Note : req.body.title} };

  dbo.collection("people").find(myquery).toArray(function(err, result) {
    if (err) throw err;
    console.log(result[0].Note);
    res.json(result[0].Note); // Return them json
    // console.log(result[0].Name);
    db.close();
    
  });

  });



  // console.log(`Sent ${count} passwords`);
});


app.post('/api/passwords', (req, res) => { //GETTING DATA FROM REACT



MongoClient.connect(url, {useUnifiedTopology: true}, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  var myquery = { Name: "Hey Hey, writing from React!" };
  var movement = req.body.more
  var newvalues = { $set: {Note : req.body.title, more: req.body.more} };


 


  dbo.collection("people").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");

    
    
  });

  dbo.collection("people").insertOne({Movement: movement}); //create a new record each time to store movement








  dbo.collection("people").find(myquery).toArray(function(err, result) {
    if (err) throw err;

    res.json(result[0].Note); // Return them json
    // console.log(result[0].Name);
    db.close();
    
  });



});






});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});



const port = process.env.PORT || 5000;
// app.listen(port);

http.listen(port)

console.log(`Password generator listening on ${port}`);
