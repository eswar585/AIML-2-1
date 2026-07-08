// ======================================
// PDF VIEWER SCRIPT
// ======================================

const params = new URLSearchParams(window.location.search);

const file = params.get("file");
const title = params.get("title");

const frame = document.getElementById("pdfFrame");
const titleElement = document.getElementById("pdfTitle");
const downloadButton = document.getElementById("downloadPDF");
const backButton = document.getElementById("backButton");

if (!file) {

    alert("No PDF selected.");

    window.location.href = "index.html";

}

// Set title
if (title) {

    const decodedTitle = decodeURIComponent(title);

    titleElement.textContent = decodedTitle;

    document.title = decodedTitle;

}

// Load PDF
frame.src = decodeURIComponent(file);

// Download link
downloadButton.href = decodeURIComponent(file);

// Back Button
backButton.addEventListener("click", () => {

    if (document.referrer) {

        window.location.href = document.referrer;

    } else {

        window.history.back();

    }

});
