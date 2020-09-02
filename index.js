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
var howManyMoveables = 0

var positions =  [{id:0, x:0, y:0}, {id:1, x:20, y:20}, {id:0, x:40, y:40} ]
  


io.on("connection", function(socket) {

	var socketID = socket.id	


  

  // console.log("SOCKET CONNECTED. ID = ", socket.id)
  
  io.to(socket.id).emit("socketInfo", socket.id) //emitting socket id to different clients


  if (initial === true) { //finance stuff 



  	MongoClient.connect(url, {useUnifiedTopology: true}, { useNewUrlParser: true }, function(err, db) { 
  	  if (err) throw err;
  	  var dbo = db.db("finance");
  	  var myquery = { Name: "cashTest1" };
  	  // var newvalues = { $set: {Note : req.body.title} };


  	dbo.collection("finance").find(myquery).toArray(function(err, result) {
  	  if (err) throw err;
  	  // console.log(result[0].Value);

  	  serverData = Number(result[0].Value)
  	  io.emit("new-remote-operations", serverData, positions);

  	  // console.log(result[0].Name);
  	  db.close();
  	  
  	});

  	});

    
    initial = false

  } else {
    io.emit("new-remote-operations", serverData, positions);
  }

  socket.on("drag", function(data, moveableId) { 



  	// console.log(data)
  	io.emit("remoteDrag", data, socketID, moveableId);

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
	        // console.log("1 document updated");

	        db.close();
	        
	      });

     

    }); //MongoClient.connect END


    
  }); //socket.on("new-operations" END

  socket.on("addMoveables", function(moveables, moveableInitX, moveableInitY) { //adding new moveables

    howManyMoveables=moveables

    //PAUSED HERE. It should add XY and moveableId to an array for then to emit this array on READ



    console.log("ADD MOVEABLES EMITTED")
    console.log("HOW MANY MOV. FROM ADD MOV.",howManyMoveables)

  	io.emit("remoteAddMoveables", moveables, moveableInitX, moveableInitY);



  	// console.log("MOVEABLES", moveables, moveableInitX, moveableInitY)

  })

  socket.on("read", function() {

    // console.log("READ EMITTED")

    console.log("HOW MANY MOV. FROM READ",howManyMoveables)



    io.emit("readResponse", serverData, howManyMoveables, positions);
    io.emit("new-remote-operations", serverData, howManyMoveables, positions);
    io.emit("TEST", positions);

    
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






// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});



const port = process.env.PORT || 5000;
// app.listen(port);

http.listen(port)

console.log(`Password generator listening on ${port}`);
