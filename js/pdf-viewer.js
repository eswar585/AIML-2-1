// ==========================================
// STUDENT NOTES PORTAL
// PDF VIEWER SCRIPT
// ==========================================

// Read URL parameters safely
const params = new URLSearchParams(window.location.search);
const pdfFile = params.get("file");
const pdfTitle = params.get("title");
const courseCode = params.get("code");

// Target Elements
const frame = document.getElementById("pdfFrame");
const title = document.getElementById("pdfTitle");
const downloadBtn = document.getElementById("downloadBtn");
const backBtn = document.getElementById("backButton");

// ---------------------------
// Validate PDF Existence
// ---------------------------
if (!pdfFile) {
    // Select the main viewer section container rather than blowing up the entire <body>
    const viewerPage = document.querySelector(".viewer-page");
    
    if (viewerPage) {
        viewerPage.innerHTML = `
            <div class="container" style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                min-height: 60vh;
                text-align: center;
            ">
                <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--accent-color, #e74c3c); margin-bottom: 1rem;"></i>
                <h1 style="margin-bottom: 0.5rem;">PDF File Not Found</h1>
                <p style="margin-bottom: 1.5rem; color: #666;">The requested file track could not be loaded or verified.</p>
                <a href="index.html" class="btn btn-view">
                    <i class="fa-solid fa-house"></i> Return Home
                </a>
            </div>
        `;
    }
    
    throw new Error("Application Halt: PDF file query parameter missing.");
}

// ---------------------------
// Apply Metadata Titles
// ---------------------------
const cleanTitle = pdfTitle || "Document Viewer";
document.title = `${cleanTitle} | Student Notes Portal`;
if (title) {
    title.textContent = cleanTitle;
}

// ---------------------------
// Set Document Frame & Assets
// ---------------------------
if (frame) {
    // Safe assignment using encoded parameters
    frame.src = encodeURI(pdfFile);
}

if (downloadBtn) {
    downloadBtn.href = encodeURI(pdfFile);
    // Explicitly fallback to file name if parameter is blank
    downloadBtn.setAttribute("download", pdfTitle || "class-note.pdf");
}

// ---------------------------
// Smart Back Button Navigation Handler
// ---------------------------
if (backBtn) {
    backBtn.addEventListener("click", function (e) {
        e.preventDefault();
        
        if (courseCode) {
            window.location.href = `subject.html?code=${encodeURIComponent(courseCode)}`;
        } else {
            window.location.href = "index.html";
        }
    });
}
