const port = 3000;

// Import the express module
import express from "express";
// Import environment variables
import "dotenv/config";
// Import the file system
import fs from "node:fs/promises";
import path from "node:path";

// MAKE THE SERVER PUBLIC WITH NGROK
// RUN THE SERVER
// OPEN CMD AND TYPE: ngrok http {port} 
// WHERE PORT IS THE PORT USED FOR THE SERVER, SO IN THIS INSTANCE 3000: ngrok http 3000
// THEN GO TO THE FORWARDGIN LINK GIVEN BY NGROK, SHOULD INCLUDE FREE.APP

// ------------------- COPIED FROM THE FIREBASE CONSOLE -------------------

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const dataBase = getFirestore(firebaseApp);

// --------------------------------------------------------------------------

// Create the express server
const app = express();
// Allow the server to read json data sent to the website
app.use(express.json());

// Make the express server use static file from the client folder
app.use(express.static("client"));

// Check if the server is alive
app.get("/check-alive", async (req, res) => {
    try{
        // Respond with good status
        res.status(200);
        res.send("alive");
    }
    catch{
        // Respond with bad server status
        res.status(500);
        res.send("dead");
    }
});

// Route the user to save their score
app.post("/api/submit-score", async (req, res) => {
    try{
        // Read the data sent from the client
        const { name, wpm } = req.body;
        // Check if the data sent is valid
        if (name === undefined || wpm === undefined){
            return res.status(400).json({
                status: "failure",
                message: "Missing required fields: name or wpm"
            });
        };

        // Add the data to the database
        await addDoc(collection(dataBase, "scores"), {
            name: name,
            wpm: Number(wpm),
            timestamp: new Date()
        });
        
        // Respond with a successfull message
        res.json({ status: "success", message: "Score Saved"});
        res.status(200);
    }
    catch(error) {
        res.status(500).json({ status: "failure", message: error.message });
    }
});

// Get the leaderboard data from the database
app.get("/api/get-leaderboard", async (req, res) => {
    try{
        // Query the database
        const q = query(collection(dataBase, "scores"), orderBy("wpm", "desc"), limit(10));
        // Ger the data from the query
        const querySnapshot = await getDocs(q);

        let leaderboardData = [];

        // Loop through the data from the query
        querySnapshot.forEach((doc) => {
            // Get the data
            const data = doc.data();
            // Get the time submitted
            let dateData = data.timestamp.toDate().toString();
            let time = dateData.split(" ")[4];
            time = time.split(":")[0] + ":" + time.split(":")[1]
            // Get the date of when the score was submitted
            const date = data.timestamp.toDate().toLocaleDateString("en-UK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            })
            // Add the data to the leaderboard list
            leaderboardData.push({
                name: data.name,
                wpm: data.wpm,
                date: date + "<br>" + time
            });
        });
        // respond to the user with the leaderboard data
        res.json(leaderboardData);
        res.status(200);
    }
    catch (error){
        res.status(500).json({ error: error.message });
    }
});

// Save the number of reaction test attempts
app.post("/save-reaction-attempts", async (req, res) => {
    // Get the path of the settings file
    const dataPath = path.resolve("settings.json");
    try{
        // Get the contents
        const attempts = req.body;
        // Check if the data contains the attempts
        if (!attempts || attempts.reactionAttempts === undefined){
            return res.status(400).json({error: "Missing key"});
        }

        // Write to the file
        await fs.writeFile(dataPath, JSON.stringify(attempts, null, 2));

        // Respond with some data
        res.status(200);
        res.json({message: "saved data"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error: ${err}`});
    }
});

// Get the number of reaction test attetmpts
app.get("/get-reaction-attempts", async (req, res) => {
    // Get the path of the settings file
    const dataPath = path.resolve("settings.json");
    try{
        // Read the file
        const data = await fs.readFile(dataPath, "utf8");
        // Turn the string into a json object
        const settings = JSON.parse(data);
        // Send back the data
        res.status(200);
        res.json({reactionAttempts: settings.reactionAttempts});
        
    }
    catch (err){
        // Send back the default value
        res.status(500);
        res.json({reactionAttempts: 3});
        
    };
});

app.get("/", (request, response) => {
    response.send("Server running");
});

app.listen(port, () => {
    console.log(`Server started on: 127.0.0.1:${port}`);
});


export default app;