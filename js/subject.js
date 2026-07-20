```javascript
// ==========================================
// STUDENT SUBJECT PAGE
// FIRESTORE NOTES VERSION
// PDF + WORD + POWERPOINT SUPPORT
// ==========================================


// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {
    db
} from "./firebase.js";


import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// GET COURSE CODE
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const courseCode =
    params.get("code");


// ==========================================
// FIND SUBJECT
// ==========================================

const subject =
    subjects.find(
        item =>
            item.code === courseCode
    );


// ==========================================
// SUBJECT NOT FOUND
// ==========================================

if (!subject) {

    document.body.innerHTML = `

        <div style="
            padding:50px;
            text-align:center;
            font-family:Poppins,sans-serif;
        ">

            <h1>
                Subject Not Found
            </h1>

            <a
                href="index.html"
                class="btn btn-view">

                ← Back Home

            </a>

        </div>

    `;

    throw new Error(
        "Subject not found"
    );

}


// ==========================================
// DISPLAY SUBJECT
// ==========================================

document.getElementById(
    "subjectName"
).textContent =
    `${subject.icon} ${subject.name}`;


document.getElementById(
    "subjectCode"
).textContent =
    `Course Code : ${subject.code}`;


// ==========================================
// SYLLABUS
// ==========================================

const viewBtn =
    document.getElementById(
        "viewSyllabus"
    );


const downloadBtn =
    document.getElementById(
        "downloadSyllabus"
    );


viewBtn.href =
    `pdf-viewer.html?file=${encodeURIComponent(
        subject.syllabus
    )}&title=${encodeURIComponent(
        subject.name + " Syllabus"
    )}&code=${subject.code}`;


downloadBtn.href =
    subject.syllabus;


// ==========================================
// NOTES CONTAINER
// ==========================================

const notesContainer =
    document.getElementById(
        "notesContainer"
    );


// ==========================================
// GET FILE EXTENSION
// ==========================================

function getFileExtension(
    fileName
) {

    return fileName
        .split("?")[0]
        .split(".")
        .pop()
        .toLowerCase();

}


// ==========================================
// GET FILE TYPE
// ==========================================

function getFileType(
    fileName
) {

    const extension =
        getFileExtension(
            fileName
        );


    if (
        extension === "pdf"
    ) {

        return "pdf";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "word";

    }


    if (
        extension === "ppt" ||
        extension === "pptx"
    ) {

        return "powerpoint";

    }


    return "unknown";

}


// ==========================================
// GET FILE ICON
// ==========================================

function getFileIcon(
    fileName
) {

    const fileType =
        getFileType(
            fileName
        );


    if (
        fileType === "pdf"
    ) {

        return "fa-file-pdf";

    }


    if (
        fileType === "word"
    ) {

        return "fa-file-word";

    }


    if (
        fileType === "powerpoint"
    ) {

        return "fa-file-powerpoint";

    }


    return "fa-file";


}


// ==========================================
// GET FILE LABEL
// ==========================================

function getFileLabel(
    fileName
) {

    const fileType =
        getFileType(
            fileName
        );


    if (
        fileType === "pdf"
    ) {

        return "PDF Document";

    }


    if (
        fileType === "word"
    ) {

        return "Word Document";

    }


    if (
        fileType === "powerpoint"
    ) {

        return "PowerPoint Presentation";

    }


    return "Document";

}


// ==========================================
// CREATE VIEW URL
// ==========================================

function getViewURL(
    file,
    title
) {

    const fileType =
        getFileType(
            file
        );


    // ======================================
    // PDF
    // ======================================

    if (
        fileType === "pdf"
    ) {

        return `pdf-viewer.html?file=${encodeURIComponent(
            file
        )}&title=${encodeURIComponent(
            title
        )}&code=${encodeURIComponent(
            subject.code
        )}`;

    }


    // ======================================
    // WORD / POWERPOINT
    // ======================================

    if (
        fileType === "word" ||
        fileType === "powerpoint"
    ) {

        const absoluteURL =
            new URL(
                file,
                window.location.href
            ).href;


        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            absoluteURL
        )}`;

    }


    // ======================================
    // UNKNOWN FILE
    // ======================================

    return file;

}


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {


    notesContainer.innerHTML = `

        <div class="notes-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading class notes...

        </div>

    `;


    try {


        // =====================================
        // QUERY NOTES
        // =====================================

        const notesQuery =
            query(

                collection(
                    db,
                    "notes"
                ),

                where(
                    "subjectCode",
                    "==",
                    subject.code
                )

            );


        const snapshot =
            await getDocs(
                notesQuery
            );


        console.log(
            "Notes found:",
            snapshot.size
        );


        // =====================================
        // NO NOTES
        // =====================================

        if (
            snapshot.empty
        ) {

            notesContainer.innerHTML = `

                <div class="notes-unavailable">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <div>

                        <strong>
                            Notes Not Uploaded Yet
                        </strong>

                        <br>

                        Please check again later.

                    </div>

                </div>

            `;

            return;

        }


        // =====================================
        // CLEAR CONTAINER
        // =====================================

        notesContainer.innerHTML =
            "";


        // =====================================
        // DISPLAY NOTES
        // =====================================

        snapshot.forEach(
            (noteDocument) => {


                const note =
                    noteDocument.data();


                const file =
                    note.file;


                const title =
                    note.title ||
                    "Untitled Note";


                const fileType =
                    getFileType(
                        file
                    );


                const icon =
                    getFileIcon(
                        file
                    );


                const label =
                    getFileLabel(
                        file
                    );


                const viewURL =
                    getViewURL(
                        file,
                        title
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "subject-card";


                card.innerHTML = `

                    <div class="note-card-content">

                        <div class="note-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>


                        <div>

                            <h3>

                                ${escapeHTML(
                                    title
                                )}

                            </h3>


                            <p>

                                ${subject.code}

                                <br>

                                <small>

                                    ${label}

                                </small>

                            </p>

                        </div>

                    </div>


                    <div class="button-group">

                        <a

                            href="${viewURL}"

                            target="_blank"

                            rel="noopener noreferrer"

                            class="btn btn-view">


                            <i class="fa-solid fa-eye"></i>


                            View Note


                        </a>


                        <a

                            href="${file}"

                            download

                            class="btn btn-download">


                            <i class="fa-solid fa-download"></i>


                            Download


                        </a>

                    </div>

                `;


                notesContainer.appendChild(
                    card
                );

            }

        );

    }


    catch (
        error
    ) {


        console.error(
            "Error loading notes:",
            error
        );


        notesContainer.innerHTML = `

            <div class="notes-unavailable">

                <i class="fa-solid fa-triangle-exclamation"></i>


                <div>

                    <strong>

                        Unable to Load Notes

                    </strong>


                    <br>


                    ${escapeHTML(
                        error.message
                    )}

                </div>

            </div>

        `;

    }

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(
    value
) {


    if (
        !value
    ) {

        return "";

    }


    return String(
        value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// LOAD NOTES
// ==========================================

loadNotes();
```
