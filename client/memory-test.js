// Get all memory buttons
var memDiv = document.getElementById("memory-game");
var memBtns = document.getElementsByClassName("memory-btn");
memBtns = Array.from(memBtns);
var memStartBtn = document.getElementById("memory-start-btn");
var memoryScore = document.getElementById("memory-score");
// Disable all the memory buttons
for (const btn of memBtns){
    btn.disabled = true;
};

// Add functionality to the memory test
let chosenBoxes = []; // list of random indexes
let randomNum;
let maxIndex = 1;
let userChosenBoxes = []
const showDelay = ms => new Promise(res => setTimeout(res, ms));
let started = false;

// Add a listener to check if the start button has been pressed
memStartBtn.addEventListener("click", async function() {
    // Reset flags and lists to be able to reset the game with no problem
    started = true;
    memStartBtn.disabled = true;
    memoryScore.innerHTML = "";
    // Create a list of random numbers to represent which boxes will be shown
    // Reset the chosen boxes each time the button is pressed
    chosenBoxes = [];
    userChosenBoxes = [];
    maxIndex = 1;
    // Create the random sequence of "boxes" (indexes) the user has to remember
    for (let i = 0; i < 100; i++){
        // Create the random number from 0 to 8
        randomNum = Math.round(Math.random() * 8);
        // Add the nubmer to a list
        chosenBoxes.push(randomNum);
    }

    // Remove the buttons "chosen" class to avoid any mix up with styling
    for (const btn of memBtns){
        btn.classList.remove("chosen");
    };
    
    // Wait a second before starting the game
    await showDelay(1000);
    // Call the function to show the user what they have to remember
    showMemorySequence()
});

async function showMemorySequence(){
    toggleDisabledButtons(true);
    // Loop from 0 to the "round", increases by 1 each time.
    for (let i = 0; i < maxIndex; i++){
        // Disable the boxes so the user doesn't accidenally press them
        memBtns[chosenBoxes[i]].disabled = false;
        // Adjust the styling to show which boxes are correct
        memBtns[chosenBoxes[i]].classList.add("chosen");
        // Wait a little so the user has time to remember
        await showDelay(500);
        // Remove the styling
        memBtns[chosenBoxes[i]].classList.remove("chosen");
        // Enable the boxes so the user can enter their sequence
        memBtns[chosenBoxes[i]].disabled = true;
        // Wait before the user can make an attempt
        await showDelay(500);

    }
    toggleDisabledButtons(false);
    // Reset the users previous chosen boxes
    userChosenBoxes = [];
    // Increase the "round" number
    maxIndex ++;
}

memDiv.addEventListener("click", async function(event) {
    if (!started) { return; };
    const clickedBtn = event.target
    // Check if the button is in the button list
    if (clickedBtn.classList[0] == "memory-btn"){
        // Get bros index in the list
        const btnIdx = memBtns.indexOf(clickedBtn);
        // Add the index to the users boxes to then compare with the sequence
        userChosenBoxes.push(btnIdx);
        const currentIdx = userChosenBoxes.length - 1
        // Check if the chosen box matches
        if (userChosenBoxes[currentIdx] == chosenBoxes[currentIdx]){
            // Style the button to show correctness.
            clickedBtn.classList.add("correct");
            await showDelay(300);
            clickedBtn.classList.remove("correct");
        }
        else{
            // Style the buttons to show the user is wrong
            for (const btn of memBtns){
                btn.classList.add("wrong");
            }
            await showDelay(500);
            // Disable the buttons, show the score and allow the user to play again
            for (const btn of memBtns){
                btn.classList.remove("wrong");
                btn.disabled = true;
            }
            await showDelay(500);
            started = false;
            memStartBtn.disabled = false;
            memoryScore.innerHTML = `Score: ${maxIndex-2}`;
            return;
        };
    };

    // Check if the user has finished selecting
    if (userChosenBoxes.length == maxIndex-1 && started){
        await showDelay(1000);
        // Show the next sequence
        showMemorySequence();
    }
});

function toggleDisabledButtons(toggle){
    // Loop through all buttons and disable them
    for (const btn of memBtns){
        btn.disabled = toggle;
    }
}

// Function to reset the memory test back to "unplayed"
function resetMemoryTest(){
    started = false;
    maxIndex = 1;
    chosenBoxes = [];
    userChosenBoxes = [];
    for (const btn of memBtns){
        btn.classList.remove("chosen");
    };
    toggleDisabledButtons(true);
    memStartBtn.disabled = false;
    memoryScore.innerHTML = "";
}

// Add this reset function to the global reset functions array
// Check if the array exists first
if (window.resetFunctions){
    window.resetFunctions.push(resetMemoryTest);
}