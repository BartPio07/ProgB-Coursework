var paragraph1 = document.getElementById("paragraph1");

var info1Btn = document.getElementById("info1-btn");
var info2Btn = document.getElementById("info2-btn");
var info3Btn = document.getElementById("info3-btn");

var section1Div = document.getElementById("section-1-div");
var section2Div = document.getElementById("section-2-div");
var section3Div = document.getElementById("section-3-div");

info1Btn.addEventListener("click", function() {
    paragraph1.innerHTML = "Info 1 paragraph";
    section1Div.style.display = "flex";
    section2Div.style.display = "none";
    section3Div.style.display = "none";
});

info2Btn.addEventListener("click", function() {
    paragraph1.innerHTML = "Info 2 paragraph";
    section1Div.style.display = "none";
    section2Div.style.display = "flex";
    section3Div.style.display = "none";
});

info3Btn.addEventListener("click", function() {
    paragraph1.innerHTML = "Info 3 paragraph";
    section1Div.style.display = "none";
    section2Div.style.display = "none";
    section3Div.style.display = "flex";
});