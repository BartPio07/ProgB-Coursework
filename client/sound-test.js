import * as Tone from 'https://cdn.skypack.dev/tone';

let soundBtn = document.getElementById("sound-btn");
const sound = new Tone.Synth({volume: -12}).toDestination();
const allKeys = document.querySelectorAll(".white-key, .black-key ");

let notes = [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4", // Octave 4
    "C5", "D5", "E5", "F5", "G5", "A5", "B5", // Octave 5
    "C#4", "D#4", "F#4", "G#4", "A#4",  // Sharp Keys Octave 4
    "C#5", "D#5", "F#5", "G#5", "A#5",  // Sharp Keys Octave 5
];

allKeys.forEach(key => {
    key.addEventListener("pointerdown", async (e) => {
        e.stopPropagation();

        if (Tone.context.state !== "running"){
            await Tone.start();
        };

        const note = key.getAttribute("data-note");
        if (note){
            playNote(note);
            key.classList.add("active");
        };
    });

    key.addEventListener("pointerup", () => {
        key.classList.remove("active");
    });
    key.addEventListener("pointerleave", () => {
        key.classList.remove("active");
    });
});

soundBtn.addEventListener("click", async () => {
    // Start audio context on the first click
    if (Tone.context.state !== "running"){
        await Tone.start();
    }
    const ranNum = Math.floor(Math.random() * notes.length)
    console.log(notes[ranNum]);
    playNote(notes[ranNum]);

});

async function playNote(note){
    sound.triggerAttackRelease(note, "8n");
}