// ======================================
// PDF VIEWER SCRIPT
// ======================================

// Get URL parameters
const params = new URLSearchParams(window.location.search);

const file = params.get("file");
const title = params.get("title");

// Elements
const frame = document.getElementById("pdfFrame");
const titleElement = document.getElementById("pdfTitle");
const downloadButton = document.getElementById("downloadPDF");

// No PDF supplied
if (!file) {

    document.body.innerHTML = `
        <div style="
            text-align:center;
            padding:80px;
            font-family:Poppins,sans-serif;
        ">

            <h1>No PDF Selected</h1>

            <p>Please return to the previous page.</p>

            <a href="index.html"
               style="
                    display:inline-block;
                    margin-top:20px;
                    padding:12px 24px;
                    background:#2563eb;
                    color:white;
                    border-radius:10px;
                    text-decoration:none;
               ">
                Home
            </a>

        </div>
    `;

    throw new Error("No PDF selected");

}

// Set title
if (title) {

    titleElement.textContent = decodeURIComponent(title);

}

// Load PDF
frame.src = file;

// Download button
downloadButton.href = file;

// Change page title
if (title) {

    document.title = decodeURIComponent(title);

}
