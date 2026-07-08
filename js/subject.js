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
            <a href="index.html">← Back Home</a>
        </div>
    `;
    throw new Error("Subject not found");
}

// Subject Name
document.getElementById("subjectName").textContent =
`${subject.icon} ${subject.name}`;

// Course Code
document.getElementById("subjectCode").textContent =
`Course Code : ${subject.code}`;

// Syllabus Buttons
const viewBtn = document.getElementById("viewSyllabus");
const downloadBtn = document.getElementById("downloadSyllabus");

viewBtn.href = subject.syllabus;
downloadBtn.href = subject.syllabus;

// Notes Section
const notesContainer = document.getElementById("notesContainer");

if (subject.notesAvailable) {

    subject.notes.forEach(note => {

        const card = document.createElement("div");

        card.className = "subject-card";

        card.innerHTML = `
            <h3>${note.title}</h3>

            <div class="button-group">

                <a
                    href="${note.file}"
                    target="_blank"
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
