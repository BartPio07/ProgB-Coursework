const expressBtn = document.getElementById("express-page-btn");
const firebaseBtn = document.getElementById("firebase-page-btn");
const expressDoc = document.getElementById("express-documentation");
const fireBaseDoc = document.getElementById("firebase-documentation");

expressBtn.addEventListener("click", function() {
    expressDoc.style.display = "block";
    fireBaseDoc.style.display = "none";
});

firebaseBtn.addEventListener("click", function() {
    expressDoc.style.display = "none";
    fireBaseDoc.style.display = "block";
});