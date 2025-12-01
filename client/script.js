// Create a global list to store the reset functions of each section

window.resetFunctions = [];

// Create a function that runs every function in the reset functions list
function resetAllSections(){
    window.resetFunctions.forEach(func => {
        // Call the function
        func();
    });
}

// Get all elements
var sec1Btn = document.getElementById("sec1-btn");
var sec2Btn = document.getElementById("sec2-btn");
var sec3Btn = document.getElementById("sec3-btn");
var sec4Btn = document.getElementById("sec4-btn");

var section1Div = document.getElementById("reaction-div");
var section2Div = document.getElementById("memory-div");
var section3Div = document.getElementById("section-3-div");
var section4Div = document.getElementById("section-4-div");

function switchSection(currentSection){
    // Hide all divs
    section1Div.style.display = "none";
    section2Div.style.display = "none";
    section3Div.style.display = "none";
    section4Div.style.display = "none";

    // Show the current section div
    currentSection.style.display = "flex";

    // Reset all sections
    resetAllSections();
}

// Add event listeners to the naviagtion buttons change the test 
sec1Btn.addEventListener("click", function() {
    switchSection(section1Div);
});

sec2Btn.addEventListener("click", function() {
    switchSection(section2Div);
});

sec3Btn.addEventListener("click", function() {
    switchSection(section3Div);
});

sec4Btn.addEventListener("click", function() {
    switchSection(section4Div);
});