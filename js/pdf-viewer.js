// ======================================
// PDF VIEWER SCRIPT
// ======================================

const params = new URLSearchParams(window.location.search);

const file = params.get("file");
const title = params.get("title");
const code = params.get("code");

const frame = document.getElementById("pdfFrame");
const titleElement = document.getElementById("pdfTitle");
const downloadButton = document.getElementById("downloadPDF");
const backButton = document.getElementById("backButton");

// No PDF selected
if (!file) {

    alert("No PDF Selected");

    window.location.href = "index.html";

}

// Set Page Title
if (title) {

    const decodedTitle = decodeURIComponent(title);

    titleElement.textContent = decodedTitle;

    document.title = decodedTitle;

}

// Load PDF
frame.src = decodeURIComponent(file);

// Download PDF
downloadButton.href = decodeURIComponent(file);

// ======================================
// BACK BUTTON
// ======================================

backButton.addEventListener("click", function () {

    if (code) {

        window.location.href = `subject.html?code=${code}`;

    } else {

        window.location.href = "index.html";

    }

});
