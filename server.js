// here we are setting up are variables, the http can create a server that will listen to server ports
//we set up server to use that http module to create a server, in this case its taking app as its parameter. app is our express server, and since we have applied some middleware to our app in app.js, thats what we will see when we use the listen function

const http = require("http");
const app = require("./app");
const port = process.env.PORT || 9000;
const mongoose = require("mongoose");

//we need to pass a listener, a functioner that is executed whenever we get a new request
const server = http.createServer(app);

//this will start listening to whatever function we pass to create server
server.listen(port);
