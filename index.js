const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const { MongoClient } = require("mongodb");
const url = "mongodb+srv://zenberry:mongoPass8@cluster0-xmkeu.mongodb.net/sample_restaurants?retryWrites=true&w=majority";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "test";

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )



  const myVar = [24]

  // Return them as json
  res.json(myVar);

  // console.log(`Sent ${count} passwords`);
});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.post('/api/passwords', (req, res) => {

res.json(req.body.title); // Return them json

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  var myquery = { Name: "Hey Hey, writing from React!" };
  var newvalues = { $set: {Note : req.body.title} };



  dbo.collection("people").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});




console.log(req.body.title)
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
