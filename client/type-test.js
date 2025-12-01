// Import packages to be used
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm';
import Chart from 'https://esm.sh/chart.js/auto';

// Get elements for the type test
var typeTextInput = document.getElementById("type-test-input");
var typeStartBtn = document.getElementById("type-start-btn");
var currentWordsP = document.getElementById("current-words-p");
var currentTimeP = document.getElementById("current-time-p");
var displayWordPs = document.getElementsByClassName("display-word");
var wordChart = document.getElementById("type-chart");
var overlayCountDownDiv = document.getElementById("type-overlay-div");
var overlayCountDownP = document.getElementById("count-down-p");
var averageWPMP = document.getElementById("average-wpm-p");
var minWPMP = document.getElementById("min-wpm-p");
var maxWPMP = document.getElementById("max-wpm-p");

// Add functionality to the type test
// Initialise needed variables
let userInputWords = [];
let testWords = [];
let userInput = "";
let wordFunctions = [faker.word.adjective, faker.word.noun, faker.food.spice,
    faker.food.vegetable, faker.food.meat, faker.word.adverb,
    faker.word.conjunction];
let startTime;
let currentTimeSeconds;
let testInterval;
let countDownInterval;
let graphInputs = []
const maxWords = 20;
let wordGraph = null;
let startTest = false;

// Disable the user input element
typeTextInput.disabled = true;

showDisplayWords(false);

typeStartBtn.addEventListener("click", async function(){
    // Reset variables
    resetTypeTest();
    // Generate the new words for the test
    testWords = generateWords(maxWords);
    updateInfoParagraphs();
    
    // Get the current time
    startTime = Date.now();

    // Show the count down section
    overlayCountDownDiv.style.display = "flex";

    // Start the counter for timing the test
    testInterval = setInterval( () => {
        // Check if the test has started - due to the beginning count down
        if (startTest){
            // Get the time that has passed
            const elapsedTime = Date.now() - startTime;
            // Get the time in seconds
            currentTimeSeconds = ((elapsedTime / 1000)-3).toFixed(2);
            // Show the time to the user
            currentTimeP.innerHTML = `${currentTimeSeconds}s`
        }
    // Check this every 10 milliseconds
    }, 10);

    // Start the counter for the count down
    countDownInterval = setInterval( () => {
        // Get the time that has passed
        const elapsedTime = Date.now() - startTime;
        // Calculate the time that is left, so there is a count down and not count up
        // Also use 3.5, since the count would actually count 2.5 when its 3-
        const timeLeft = 3.5-Math.round(((elapsedTime / 1000)+0.5).toFixed(2));
        // Also only display 3 and not 3.5
        if (timeLeft > 3) { overlayCountDownP.innerHTML = "3"; }
        // Show the time left to the user
        else { overlayCountDownP.innerHTML = `${Math.round(timeLeft)}`; }
        // Check if the count down has finished
        if (timeLeft <= 0){
            // Start the test
            startTest = true;
            overlayCountDownDiv.style.display = "none";
            typeTextInput.focus();
            showDisplayWords(true);
        }
    });
});

typeTextInput.addEventListener("input", async function(){
    userInput = typeTextInput.value;
    // Remove any space character
    if (userInput.includes(" ")){
        // Stop the user from being able to type the space character
        userInput = userInput.replace(" ", "");
        typeTextInput.value = userInput;
    }
    // Check if the user has typed the word correctly
    if (userInput == testWords[userInputWords.length]){
        goNextWord();
    }
    // Update the word count and seconds past
    updateInfoParagraphs();
    // Check if the test has finished, so the total words inputted by the user is the same length as the tests words
    if (userInputWords.length >= maxWords){
        // Clear timers
        clearInterval(testInterval);
        clearInterval(countDownInterval);
        // Stop everyting
        startTest = false;
        typeStartBtn.disabled = false;
        typeTextInput.disabled = true;
        showDisplayWords(false);
        // Create the graph for the user to see their performance
        wordGraph = createGraph("line", "WPM/Time", graphInputs, "Time/s", "WPM");
        // Show the users stats in text form
        averageWPMP.innerHTML = `Average WPM:${Math.round((userInputWords.length/currentTimeSeconds)*60)}`;
        minWPMP.innerHTML = `Min WPM:${Math.round(Math.min(...graphInputs.map(p => p.y)))}`;
        maxWPMP.innerHTML = `Max WPM:${Math.round(Math.max(...graphInputs.map(p => p.y)))}`;
    }
});

// Function which generates a set amount of words
function generateWords(amount){
    // Create local variables to make and store the wods
    let words = [];
    let r = "";
    let word = "";
    for (let i = 0; i < amount; i++){
        // Get a random nubmer to pick a type of word from the word function list
        r = Math.round(Math.random() * (wordFunctions.length-1));
        // Get the word and make it lowercase
        word = wordFunctions[r]().toLowerCase()
        // Check if the word has any spaces
        word.split(" ").forEach(w => {
            // Add the split words into the words list
            words.push(`${w}`);
        });
        
    }
    // Remove words from the list since some words may have been split with " "
    while (words.length > amount){
        words.pop()
    }

    return words;
}

// Goes to the next word in the test word list
function goNextWord(){
    // Clear the text input value
    typeTextInput.value = "";
    // Add input to all the inputs the user has made
    userInputWords.push(userInput);
    // Create data for the graph to be shown at the end of the test
    // Words per minute over time
    graphInputs.push({"y": Math.round((userInputWords.length/currentTimeSeconds)*60), "x":currentTimeSeconds});
}

// Returns a graph using the chart.js package
function createGraph(graphType, graphLabel, inputs, xLabel, yLabel){
    const graph = new Chart(wordChart, {
        type: graphType,
        data: {
            datasets: [{
                label: graphLabel,
                data: inputs,
                borderColor: "rgb(204, 167, 0)",
                tension: 0.3,
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabel
                    },
                    type: "linear",
                    position: "bottom"
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel,
                    }
                }
            }
        }
    });
    return graph;
}

// Function to toggle the visibility of the display words
function showDisplayWords(show){
    // Check whether the words should be shown
    if (show == false){
        // Loop through each tag
        for (const pTag of displayWordPs){
            // Make the tags show nothing
            pTag.innerHTML = "";
            pTag.style.display = "none";
        };
    }
    else if (show == true){
        for (const pTag of displayWordPs){
            // Show the tags
            pTag.style.display = "flex";
        };
    }
}

function updateInfoParagraphs(){
    currentWordsP.innerHTML = `${userInputWords.length}/${testWords.length} Words`
    if (testWords[userInputWords.length-1] != undefined){
        displayWordPs[0].innerHTML = testWords[userInputWords.length-1];
    }
    else{
        displayWordPs[0].innerHTML = " ";
    }
    displayWordPs[1].innerHTML = testWords[userInputWords.length];

    if (testWords[userInputWords.length+1] != undefined){
        displayWordPs[2].innerHTML = testWords[userInputWords.length+1];
    }
    else{
        displayWordPs[2].innerHTML = "";
    }
}

// Function to reset the test
function resetTypeTest(){
    graphInputs = [];
    userInputWords = [];
    typeStartBtn.disabled = true;
    typeTextInput.disabled = false;
    startTest = false;
    currentWordsP.innerHTML = ""
    currentTimeP.innerHTML = "0s";
    showDisplayWords(false);
    // Check if a graph exists, if so remove it since is a new test
    if (wordGraph != null){
        wordGraph.destroy();
    }
    // Reset any counters
    if (testInterval) { clearInterval(testInterval); };
    if (countDownInterval) { clearInterval(countDownInterval); };
    // Hide the overlay div
    overlayCountDownDiv.style.display = "none";
    // Reset the finished wpm text
    averageWPMP.innerHTML = "";
    minWPMP.innerHTML = "";
    maxWPMP.innerHTML = "";
    // Reset the text in the input box
    typeTextInput.value = "";
}

function fullyResetTypeTest(){
    resetTypeTest();
    // Activate the start button
    typeStartBtn.disabled = false;
    typeTextInput.disabled = true;
    // Clear any showing text
    currentTimeP.innerHTML = "";
    
}

// Add this reset function to the global reset functions array
// Check if the array exists first
if (window.resetFunctions){
    window.resetFunctions.push(fullyResetTypeTest);
}