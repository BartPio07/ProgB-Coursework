import * as Tone from 'https://cdn.skypack.dev/tone';

let soundBtn = document.getElementById("sound-btn");
let soundScoreP = document.getElementById("sound-score-p");
let soundInfoP = document.getElementById("sound-info-p");
let noteCheckbox = document.getElementById("note-checkbox");
const allKeys = document.querySelectorAll(".white-key, .black-key ");
let opacityOveraly = document.getElementById("opacity-overlay");
let overlay = document.getElementById("overlay");
let overlayInfoP = document.getElementById("overlay-info-p");
let sound;
let currentNote;
let score = 0;
let started = false;
let classTimeout;
let volume = -10;

let notes = [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4", // Octave 4
    "C5", "D5", "E5", "F5", "G5", "A5", "B5", // Octave 5
    "C#4", "D#4", "F#4", "G#4", "A#4",  // Sharp Keys Octave 4
    "C#5", "D#5", "F#5", "G#5", "A#5",  // Sharp Keys Octave 5
];


// Handle checkbox changes
noteCheckbox.addEventListener("change", () => {
    updateScoreTag();
});

// Loop through each piano key
allKeys.forEach(key => {
    // Get the note to play from the key
    const note = key.getAttribute("data-note");
    // Check for when the mouse button is pressed
    key.addEventListener("pointerdown", async (e) => {
        e.stopPropagation();

        // Start tone if not already
        await Tone.start();
        if (!sound){
            sound = new Tone.Synth({volume: volume}).toDestination();
        };
        // Check if the note is not null and play it
        if (note){
            if (started){
                if (note == currentNote){
                    score += 1;

                    key.classList.add("correct");
                    classTimeout = setTimeout(function() {
                        key.classList.remove("correct");
                        clearTimeout(classTimeout);
                    }, 200);
                    updateNewNote();
                }
                else{
                    key.classList.add("wrong");
                    classTimeout = setTimeout(function() {
                        key.classList.remove("wrong");
                        // Loop through the list again to remove any "glitched" keys
                        allKeys.forEach(k => {
                            k.classList.remove("wrong");
                        });
                        clearTimeout(classTimeout);
                    }, 200);
                    opacityOveraly.classList.add("show");
                    overlay.classList.add("show");
                    overlayInfoP.innerHTML = `Final Score: ${score}`;
                    // Stop and reset the test
                    resetSoundTest();
                }
            }
            else{
                playNote(note);
                key.classList.add("active");
            }
        };
    });

    // Check if the pointer is up
    key.addEventListener("pointerup", () => {
        // Remove styling
        key.classList.remove("active");
    });
    // Check if the pointer is not hovering
    key.addEventListener("pointerleave", () => {
        // Remove styling
        key.classList.remove("active");
    });
});

// START BUTTON
soundBtn.addEventListener("click", async () => {
    // Start the test and disable the button
    if (!started){
        started = true;
        soundBtn.disabled = true;
        soundScoreP.style.display = "flex";
    }
    soundInfoP.innerHTML = "| Guess a note |";
    updateNewNote();
});

async function playNote(note){
    sound.triggerAttackRelease(note, "12n");
}

function getNote(){
    return notes[Math.floor(Math.random() * notes.length)];
}

async function updateNewNote(){
    // Start audio context on the first click
    await Tone.start();
    if (!sound){
        sound = new Tone.Synth({volume: volume}).toDestination();
    };
    currentNote = getNote();
    updateScoreTag();
    playNote(currentNote);
}

// Function to update the score tag
function updateScoreTag(){
    if (noteCheckbox.checked == true){
        soundScoreP.innerHTML = `Score: ${score} | ${currentNote}`;
    }
    else{
        soundScoreP.innerHTML = `Score: ${score}`;
    };
}

// Function to reset the test
function resetSoundTest(){
    // Stop the test
    started = false;
    // Reset the score to 0
    score = 0;
    // Remove any labels
    soundScoreP.innerHTML = "";
    soundScoreP.style.display = "none";
    soundInfoP.innerHTML = "| Press the start button to play! |";
    // Make the start button not disabled
    soundBtn.disabled = false;
}

// Add this reset function to the global reset functions array
// Check if the array exists first
if (window.resetFunctions){
    window.resetFunctions.push(resetSoundTest);
}