var sec1Btn = document.getElementById("sec1-btn");
var sec2Btn = document.getElementById("sec2-btn");
var sec3Btn = document.getElementById("sec3-btn");
var sec4Btn = document.getElementById("sec4-btn");

var section1Div = document.getElementById("section-1-div");
var section2Div = document.getElementById("section-2-div");
var section3Div = document.getElementById("section-3-div");
var section4Div = document.getElementById("section-4-div");

var sectionTitle = document.getElementById("section-title");

sec1Btn.addEventListener("click", function() {
    sectionTitle.innerHTML = "Reaction Time";
    section1Div.style.display = "flex";
    section2Div.style.display = "none";
    section3Div.style.display = "none";
    section4Div.style.display = "none";
});

sec2Btn.addEventListener("click", function() {
    sectionTitle.innerHTML = "Memory Test";
    section1Div.style.display = "none";
    section2Div.style.display = "flex";
    section3Div.style.display = "none";
    section4Div.style.display = "none";
});

sec3Btn.addEventListener("click", function() {
    sectionTitle.innerHTML = "Type Test";
    section1Div.style.display = "none";
    section2Div.style.display = "none";
    section3Div.style.display = "flex";
    section4Div.style.display = "none";
});

sec4Btn.addEventListener("click", function() {
    sectionTitle.innerHTML = "Sound Test";
    section1Div.style.display = "none";
    section2Div.style.display = "none";
    section3Div.style.display = "none";
    section4Div.style.display = "flex";
});