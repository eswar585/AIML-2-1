// ==========================================
// SUBJECT PAGE SCRIPT
// ==========================================

const params = new URLSearchParams(window.location.search);
const courseCode = params.get("code");

const subject = subjects.find(item => item.code === courseCode);

if (!subject) {

    document.body.innerHTML = `
        <div style="padding:50px;text-align:center;font-family:Poppins,sans-serif;">
            <h1>Subject Not Found</h1>
            <a href="index.html" class="btn btn-view">← Back Home</a>
        </div>
    `;

    throw new Error("Subject not found");

}

// ==========================================
// SUBJECT DETAILS
// ==========================================

document.getElementById("subjectName").textContent =
`${subject.icon} ${subject.name}`;

document.getElementById("subjectCode").textContent =
`Course Code : ${subject.code}`;

// ==========================================
// SYLLABUS
// ==========================================

const viewBtn = document.getElementById("viewSyllabus");
const downloadBtn = document.getElementById("downloadSyllabus");

viewBtn.href =
`pdf-viewer.html?file=${encodeURIComponent(subject.syllabus)}&title=${encodeURIComponent(subject.name + " Syllabus")}&code=${subject.code}`;

downloadBtn.href = subject.syllabus;

// ==========================================
// NOTES
// ==========================================

const notesContainer = document.getElementById("notesContainer");

if (subject.notesAvailable) {

    subject.notes.forEach(note => {

        const card = document.createElement("div");

        card.className = "subject-card";

        card.innerHTML = `

            <h3>${note.title}</h3>

            <div class="button-group">

                <a
                    href="pdf-viewer.html?file=${encodeURIComponent(note.file)}&title=${encodeURIComponent(note.title)}&code=${subject.code}"
                    class="btn btn-view">

                    View Note

                </a>

                <a
                    href="${note.file}"
                    download
                    class="btn btn-download">

                    Download

                </a>

            </div>

        `;

        notesContainer.appendChild(card);

    });

} else {

    notesContainer.innerHTML = `

        <div class="notes-unavailable">

            <i class="fa-solid fa-circle-exclamation"></i>

            <div>

                <strong>Notes Not Uploaded Yet</strong>

                <br>

                Please check again later.

            </div>

        </div>

    `;

}
