// Import required modules
const express = require("express");
// Import database connection
const db = require("./config/connection");
// Import routes
const routes = require('./routes');

//Set port
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Use routes
app.get("/sanity", (req, res) => {
  res.json({success:true});
});
app.use(routes);
// app.get("/sanity", (req, res) => {
//   res.json({success:true});
// });


//Database connection eventy listener 
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});






