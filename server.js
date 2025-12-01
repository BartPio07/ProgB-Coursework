const port = 3000;

// Create a server using express
const express = require("express");
const app = express();

// Make the express server use static file from the client folder
app.use(express.static("client"));

app.get("/", (request, response) => {
    response.send("Server running");
});

app.listen(port, () => {
    console.log(`Server started on port : ${port}`);
});


