// Get elements for the reaction test
var reactionBtn = document.getElementById("reaction-btn");
var resultsP = document.getElementById("reaction-results");

// Add functionality to the reaction time test
let beginTest = false;
let startTiming = false;
let delay = 0;
let waitTimeout;
let reactionTimes = [];
let userTime = 0;
let finishedTest = false;

reactionBtn.addEventListener("click", function() {
    // Check if the user started the test and pressed too early
    if (beginTest && !startTiming && !finishedTest){
        // Stop the test
        beginTest = false;
        clearTimeout(waitTimeout);
        // Alert the user they were too early
        reactionBtn.innerHTML = "Too Early!<br>Click to retry";
        reactionBtn.classList.add("early");
        reactionBtn.classList.remove("ready");
    }
    else if (!beginTest && !startTiming){
        beginTest = true;
        // Style the button to show the user the test has started
        reactionBtn.innerHTML = "Ready?";
        reactionBtn.classList.add("ready");
        reactionBtn.classList.remove("early");
    }
    if (beginTest && !finishedTest){
        // Calcuate delay (between 2-5 seconds)
        delay = Math.random() * (1000) + 2000;
        // Wait the delay
        waitTimeout = setTimeout(function() {
            reactionBtn.innerHTML = "CLICK!";
            reactionBtn.classList.remove("ready");
            reactionBtn.classList.add("click");
            startTiming = true;
            beginTest = false;
            userTime = Date.now();
        }, delay);
    }
    // Check if the use has pressed at the correct time
    if (startTiming){
        userTime  = Date.now() - userTime;
        // Show the user they have clicked in time
        reactionBtn.innerHTML = `${userTime}ms<br>Click to go again`;
        reactionTimes.push(userTime);
        startTiming = false;
        reactionBtn.classList.remove("click");
    }

    // Reset the test when the user presses again
    if (finishedTest){
        resetReacionTimeTest()
    }

    // Check if the test is finished
    if (reactionTimes.length == 5 && !finishedTest){
        finishedTest = true;
        // Show the user their stats
        let average = 0;
        reactionTimes.forEach(t => {
            average += t;
        });
        average = Math.round(average / 5);
        reactionBtn.innerHTML = `Test Finished!<br>Click to go again!`;
        resultsP.innerHTML = `Average Time: ${average}ms<br>Times: ${reactionTimes.join("ms, ")}ms`
    };
});

function resetReacionTimeTest(){
    reactionBtn.innerHTML = "Start?";
    reactionBtn.classList.remove("early");
    reactionBtn.classList.remove("ready");
    reactionBtn.classList.remove("click");
    reactionTimes = [];
    startTiming = false;
    beginTest = false;
    finishedTest = false;
    resultsP.innerHTML = "";
    clearTimeout(waitTimeout);
}

// Add this reset function to the global reset functions array
// Check if the array exists first
if (window.resetFunctions){
    window.resetFunctions.push(resetReacionTimeTest);
}