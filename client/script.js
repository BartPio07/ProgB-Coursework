// Import modules
import Swal from "https://esm.sh/sweetalert2"; 

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

let dismissedToast = true;
var disconnectedToast = createToast();

let overlayDismiss = document.getElementById("overlay-dismiss-btn");
let opacityOveraly = document.getElementById("opacity-overlay");
let overlay = document.getElementById("overlay");

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

// Function which shows the toast to the user
function showToast(toast, title, msg){
    toast.fire({
        title: title,
        text: msg,
        icon: "warning",
    }).then((result) => {
        if (result.isConfirmed){
            dismissedToast = true;
        }
    });
}

// Returns a toast to show the user
function createToast(){
    return Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: true,
            timer: 0,
            timerProgressBar: true,
        });
}

// Check if the server is alive every second
setInterval(async () => {
    try{
        const response = await fetch("/check-alive", { method: "HEAD", cache: "no-store" });
        if (response.ok){
            dismissedToast = true;
        }
        console.log("alive")
    }
    catch{
        // Only re-show the toast once the toast has been dismissed
        if (dismissedToast){
            showToast(disconnectedToast, "Disconnected From The Server!", "")
            dismissedToast = false;
        }
        console.log("dead");
    }
}, 3000);

// Add event listener to dimiss overlay
overlayDismiss.addEventListener("click", function() {
    overlay.classList.remove("show");
    opacityOveraly.classList.remove("show");
});