import * as Tone from 'https://cdn.skypack.dev/tone';

let soundBtn = document.getElementById("sound-btn");
let soundScoreP = document.getElementById("sound-score-p");
let soundInfoP = document.getElementById("sound-info-p");
let sound;
const allKeys = document.querySelectorAll(".white-key, .black-key ");
let currentNote;
let score = 0;
let started = false;

let notes = [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4", // Octave 4
    "C5", "D5", "E5", "F5", "G5", "A5", "B5", // Octave 5
    "C#4", "D#4", "F#4", "G#4", "A#4",  // Sharp Keys Octave 4
    "C#5", "D#5", "F#5", "G#5", "A#5",  // Sharp Keys Octave 5
];

allKeys.forEach(key => {
    // Get the note to play from the key
    const note = key.getAttribute("data-note");
    // Check for when the mouse button is pressed
    key.addEventListener("pointerdown", async (e) => {
        e.stopPropagation();

        // Start tone if not already
        await Tone.start();
        if (!sound){
            sound = new Tone.Synth({volume: -12}).toDestination();
        };
        // Check if the note is not null and play it
        if (note){
            if (started){
                if (note == currentNote){
                    score += 1;
                    // update the score tag
                    soundScoreP.innerHTML = `Score: ${score} | ${currentNote}`;
                }
            }
            playNote(note);
            key.classList.add("active");
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

    // Start audio context on the first click
    await Tone.start();
    if (!sound){
        sound = new Tone.Synth({volume: -12}).toDestination();
    };
    const ranNum = Math.floor(Math.random() * notes.length)
    currentNote = notes[ranNum];
    soundScoreP.innerHTML = `Score: ${score} | ${currentNote}`;
    playNote(currentNote);
});

async function playNote(note){
    await Tone.start();
    if (!sound){
        sound = new Tone.Synth({volume: -12}).toDestination();
    };
    sound.triggerAttackRelease(note, "8n");
}