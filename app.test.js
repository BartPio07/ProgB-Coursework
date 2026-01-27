// Use jest test
// Supertest
import request from "supertest";
import app from "./server.js";

describe("API Tests", () => {

    // Check if the server is running or not
    test("get /check-alive", async () =>{

        const response = await request(app).get("/check-alive");
        expect([200, 404, 500]).toContain(response.statusCode); // Check server status (200 is good, other repsonse is offline)
        
    });

    // Get the global settings of the server -- currently only one settings -> reaction attempts
    test("get /get-reaction-attempts", async () =>{
        const response = await request(app).get("/get-reaction-attempts");

        // Expect the correct status code
        expect(response.statusCode).toBe(200);
        // Expect the correct data
        expect(response.body).toEqual({
            reactionAttempts: expect.any(Number)
        });
    });

    test("get /api/get-leaderboard", async () =>{
        const response = await request(app).get("/api/get-leaderboard");

        // Check if the database fails
        if (response.statusCode === 500){
            expect(response.body).toHaveProperty("error");
        }

        // Check if the resposne is an array
        expect(Array.isArray(response.body)).toBe(true);

        // Check if each array is holding the correct type of data
        response.body.forEach(item => {
            expect(item).toEqual({
                name: expect.any(String),
                wpm: expect.any(Number),
                date: expect.any(String)
            });
        });
    });

    test("post /save-reaction-attempts  Check if the correct data is saved", async () => {
        // Create the data to send
        const newAttempts = {
            reactionAttempts: 10
        };

        // Send the request
        const response = await request(app)
            .post("/save-reaction-attempts")
            .send(newAttempts)
            .set("Content-Type", "application/json");
        
        // Check what the data sent back should be
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: expect.any(String)
        });
        
    });

    test("post /save-reaction-attempts  Check if the incorrect data is not saved", async () => {
        // Create the data to send
        const newAttempts = {
            attempts: 1 // Should be reactionAttempts: any(Number)
        };

        // Send the request
        const response = await request(app)
            .post("/save-reaction-attempts")
            .send(newAttempts)
            .set("Content-Type", "application/json");
        
        // Check what the data sent back should be
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: expect.any(String)
        });
        
    });

    test("post /api/submit-score Check if the correct data is saved", async () => {
        const newScore = {
            name: "test-delete",
            wpm: 100,
        };

        const response = await request(app)
            .post("/api/submit-score")
            .send(newScore)
            .set("Content-Type", "application/json");
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: expect.any(String),
            message: expect.any(String)
        });
    });

    test("post /api/submit-score Check if the data is not saved without the WPM", async () => {
        const newScore = {
            name: "test",
        };

        const response = await request(app)
            .post("/api/submit-score")
            .send(newScore)
            .set("Content-Type", "application/json");
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: expect.any(String),
            message: expect.any(String)
        });
    });

    test("post /api/submit-score Check if the data is not saved without the name", async () => {
        const newScore = {
            wpm: 100
        };

        const response = await request(app)
            .post("/api/submit-score")
            .send(newScore)
            .set("Content-Type", "application/json");
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: expect.any(String),
            message: expect.any(String)
        });
    });

    test("post /api/submit-score Check if the data is not saved without any data", async () => {
        const newScore = {
        };

        const response = await request(app)
            .post("/api/submit-score")
            .send(newScore)
            .set("Content-Type", "application/json");
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: expect.any(String),
            message: expect.any(String)
        });
    });

});