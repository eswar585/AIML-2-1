// ==========================================
// STUDENT SUBJECT PAGE
// FIRESTORE NOTES VERSION
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


        // QUERY ONLY BY SUBJECT CODE

        const notesQuery = query(

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

        if (snapshot.empty) {


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

        notesContainer.innerHTML = "";


        // =====================================
        // DISPLAY NOTES
        // =====================================

        snapshot.forEach(

            (noteDocument) => {


                const note =

                    noteDocument.data();


                const card =

                    document.createElement(

                        "div"

                    );


                card.className =

                    "subject-card";


                card.innerHTML = `

                    <div class="note-card-content">


                        <div class="note-icon">


                            <i class="fa-solid fa-file-pdf"></i>


                        </div>


                        <div>


                            <h3>

                                ${escapeHTML(

                                    note.title

                                )}

                            </h3>


                            <p>

                                ${subject.code}

                            </p>


                        </div>


                    </div>


                    <div class="button-group">


                        <a

                            href="pdf-viewer.html?file=${encodeURIComponent(

                                note.file

                            )}&title=${encodeURIComponent(

                                note.title

                            )}&code=${subject.code}"

                            class="btn btn-view">


                            <i class="fa-solid fa-eye"></i>


                            View Note


                        </a>


                        <a

                            href="${note.file}"

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


                    ${error.message}

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


    if (!value) return "";


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
// LOAD NOTES
// ==========================================

loadNotes();
