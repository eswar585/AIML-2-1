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
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:30px;
            font-family:Arial,sans-serif;
        ">

            <div>

                <h1>Subject Not Found</h1>

                <p>
                    The requested subject could not be found.
                </p>

                <a
                    href="index.html"
                    style="
                        display:inline-block;
                        margin-top:20px;
                        padding:12px 20px;
                        background:#f6b800;
                        color:#1f2933;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                    "
                >

                    Back to Home

                </a>

            </div>

        </div>

    `;


    throw new Error(

        "Subject not found"

    );

}


// ==========================================
// DISPLAY SUBJECT INFORMATION
// ==========================================

const subjectName =
    document.getElementById(

        "subjectName"

    );


const subjectCode =
    document.getElementById(

        "subjectCode"

    );


if (subjectName) {


    subjectName.textContent =

        `${subject.icon} ${subject.name}`;

}


if (subjectCode) {


    subjectCode.textContent =

        `Course Code: ${subject.code}`;

}


// ==========================================
// SYLLABUS
// ==========================================

const viewSyllabus =
    document.getElementById(

        "viewSyllabus"

    );


const downloadSyllabus =
    document.getElementById(

        "downloadSyllabus"

    );


if (viewSyllabus) {


    viewSyllabus.href =

        `pdf-viewer.html?file=${encodeURIComponent(

            subject.syllabus

        )}&title=${encodeURIComponent(

            subject.name + " Syllabus"

        )}&code=${encodeURIComponent(

            subject.code

        )}`;

}


if (downloadSyllabus) {


    downloadSyllabus.href =

        subject.syllabus;

}


// ==========================================
// NOTES CONTAINER
// ==========================================

const notesContainer =
    document.getElementById(

        "notesContainer"

    );


if (!notesContainer) {


    console.error(

        "notesContainer not found"

    );

}


// ==========================================
// SHOW LOADING
// ==========================================

if (notesContainer) {


    notesContainer.innerHTML = `

        <div class="notes-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading class notes...

        </div>

    `;

}


// ==========================================
// FILE EXTENSION
// ==========================================

function getFileExtension(

    filePath

) {


    return filePath

        .split("?")[0]

        .split("#")[0]

        .split(".")

        .pop()

        .toLowerCase();

}


// ==========================================
// GET FILE TYPE
// ==========================================

function getFileType(

    note

) {


    // Use the type selected by admin first

    if (

        note.fileType

    ) {


        return note.fileType;

    }


    // Fallback to file extension

    const extension =

        getFileExtension(

            note.file

        );


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


    return "pdf";

}


// ==========================================
// FILE ICON
// ==========================================

function getFileIcon(

    fileType

) {


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


    return "fa-file-pdf";

}


// ==========================================
// FILE TYPE NAME
// ==========================================

function getFileTypeName(

    fileType

) {


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


    return "PDF Document";

}


// ==========================================
// VIEW BUTTON TEXT
// ==========================================

function getViewButtonText(

    fileType

) {


    if (

        fileType === "word"

    ) {


        return "View Word";

    }


    if (

        fileType === "powerpoint"

    ) {


        return "View PowerPoint";

    }


    return "View PDF";

}


// ==========================================
// CREATE ONLINE VIEW URL
// ==========================================

function getViewUrl(

    filePath,

    fileType

) {


    // ======================================
    // PDF
    // ======================================

    if (

        fileType === "pdf"

    ) {


        return `pdf-viewer.html?file=${encodeURIComponent(

            filePath

        )}&title=${encodeURIComponent(

            "Class Note"

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


        const absoluteFileUrl =

            new URL(

                filePath,

                window.location.href

            ).href;


        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(

            absoluteFileUrl

        )}`;

    }


    return filePath;

}


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {


    if (!notesContainer) {


        return;

    }


    try {


        const notesRef =

            collection(

                db,

                "notes"

            );


        const notesQuery =

            query(

                notesRef,

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


        // ==================================
        // NO NOTES
        // ==================================

        if (

            snapshot.empty

        ) {


            notesContainer.innerHTML = `

                <div class="notes-unavailable">

                    <i class="fa-solid fa-book-open"></i>

                    <div>

                        <strong>

                            Notes Not Uploaded Yet

                        </strong>

                        <br>

                        <small>

                            Please check again later.

                        </small>

                    </div>

                </div>

            `;


            return;

        }


        notesContainer.innerHTML = "";


        // ==================================
        // DISPLAY NOTES
        // ==================================

        snapshot.forEach(

            (noteDocument) => {


                const note =

                    noteDocument.data();


                const filePath =

                    note.file;


                const fileType =

                    getFileType(

                        note

                    );


                const viewUrl =

                    getViewUrl(

                        filePath,

                        fileType

                    );


                const noteCard =

                    document.createElement(

                        "div"

                    );


                noteCard.className =

                    "content-card note-card";


                noteCard.innerHTML = `

                    <div class="note-card-content">

                        <div class="note-icon">

                            <i class="fa-solid ${getFileIcon(

                                fileType

                            )}"></i>

                        </div>

                        <div>

                            <h3>

                                ${escapeHTML(

                                    note.title

                                )}

                            </h3>

                            <p>

                                ${getFileTypeName(

                                    fileType

                                )}

                            </p>

                        </div>

                    </div>


                    <div class="button-group">

                        <a

                            href="${viewUrl}"

                            target="_blank"

                            rel="noopener noreferrer"

                            class="btn btn-view"

                        >

                            <i class="fa-solid fa-eye"></i>

                            ${getViewButtonText(

                                fileType

                            )}

                        </a>


                        <a

                            href="${filePath}"

                            download

                            class="btn btn-download"

                        >

                            <i class="fa-solid fa-download"></i>

                            Download

                        </a>

                    </div>

                `;


                notesContainer.appendChild(

                    noteCard

                );

            }

        );

    }


    catch (error) {


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

                    <small>

                        Please try again later.

                    </small>

                </div>

            </div>

        `;

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(

    value

) {


    if (!value) {


        return "";

    }


    return String(value)

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
// START
// ==========================================

loadNotes();
