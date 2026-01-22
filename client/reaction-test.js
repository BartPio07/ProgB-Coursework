// Get elements for the reaction test
var reactionBtn = document.getElementById("reaction-btn");
var resultsP = document.getElementById("reaction-results");
var slider = document.getElementById("reaction-test-slider");
var sliderValue = document.getElementById("reaction-slider-value")

// Add functionality to the reaction time test
let beginTest = false;
let startTiming = false;
let delay = 0;
let waitTimeout;
let reactionTimes = [];
let userTime = 0;
let finishedTest = false;
let totalTests = 3;

// Update the initial value of the attempts - "total tests"
getAmountAttempts();

// Function to save the amount of attemps selected
async function saveAmountAttempts(attempts){
    try{
        const response = await fetch("/save-reaction-attempts", {
            method: "POST",
            headers: {"Content-Type": "application/JSON"},
            body: JSON.stringify({
                reactionAttempts: attempts
            })
        });

        const result = await response.json();
        console.log("Saved number of attempts", result.message);
    }
    catch (err){ 
        console.log("Error saving attempts", err)
    }
};

async function getAmountAttempts(){
    try{
        const response = await fetch("/get-reaction-attempts");
        const attempts = await response.json();
        totalTests = attempts.reactionAttempts;
    }
    catch (err){
        // Set the default attempts
        totalTests = 3;
    };

    // Update the slider value to be the new attempts value
        slider.value = totalTests;
        sliderValue.innerHTML = slider.value;
};

// Set the current value of the slider to the slider value <p>
sliderValue.innerHTML = slider.value;
// Check if the slider value has changed
// Only save when the value is finalized
slider.onchange = function() {
    saveAmountAttempts(totalTests);
}
// Update immediately
slider.oninput = function(){
    // Update the value of the tests
    sliderValue.innerHTML = slider.value;
    totalTests = Number(slider.value);
    // Reset the test
    resetReacionTimeTest();
}

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
        // Calcuate delay (between 2-3 seconds)
        // random() * range + minimum
        delay = Math.random() * 2500 + 500
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
    if (reactionTimes.length == totalTests && !finishedTest){
        finishedTest = true;
        // Show the user their stats
        let average = 0;
        reactionTimes.forEach(t => {
            average += t;
        });
        average = Math.round(average / totalTests);
        reactionBtn.innerHTML = `Test Finished!<br>Click to go again!`;
        // resultsP.innerHTML = `Average Time: ${average}ms<br>Times: ${reactionTimes.join("ms, ")}ms`
        resultsP.innerHTML = `Average Time: ${average}ms`;
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