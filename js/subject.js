// ==========================================
// STUDENT NOTES PORTAL
// SUBJECT PAGE SCRIPT
// FIRESTORE NOTES VERSION
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// GET SUBJECT CODE
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const courseCode =
    params.get("code");


// ==========================================
// FIND SUBJECT
// ==========================================

const subject =
    subjects.find(item =>
        item.code === courseCode
    );


if (!subject) {

    document.body.innerHTML = `

        <div style="
            padding:50px;
            text-align:center;
            font-family:Poppins,sans-serif;
        ">

            <h1>Subject Not Found</h1>

            <a
                href="index.html"
                class="btn btn-view">

                ← Back Home

            </a>

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

const viewBtn =
    document.getElementById("viewSyllabus");

const downloadBtn =
    document.getElementById("downloadSyllabus");


viewBtn.href =
    `pdf-viewer.html?file=${encodeURIComponent(subject.syllabus)}&title=${encodeURIComponent(subject.name + " Syllabus")}&code=${subject.code}`;


downloadBtn.href =
    subject.syllabus;


// ==========================================
// LOAD NOTES FROM FIRESTORE
// ==========================================

const notesContainer =
    document.getElementById("notesContainer");


async function loadNotes() {

    notesContainer.innerHTML = `

        <div class="notes-unavailable">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <div>

                <strong>Loading Notes...</strong>

                <br>

                Please wait.

            </div>

        </div>

    `;


    try {

        const notesQuery = query(

            collection(db, "notes"),

            where(
                "subjectCode",
                "==",
                subject.code
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );


        const snapshot =
            await getDocs(notesQuery);


        notesContainer.innerHTML = "";


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


        snapshot.forEach((documentSnapshot) => {

            const note =
                documentSnapshot.data();


            const card =
                document.createElement("div");


            card.className =
                "subject-card";


            card.innerHTML = `

                <h3>

                    <i class="fa-solid fa-file-pdf"></i>

                    ${note.title}

                </h3>


                <div class="button-group">

                    <a

                        href="pdf-viewer.html?file=${encodeURIComponent(note.fileUrl)}&title=${encodeURIComponent(note.title)}&code=${subject.code}"

                        class="btn btn-view">

                        <i class="fa-solid fa-eye"></i>

                        View Note

                    </a>


                    <a

                        href="${note.fileUrl}"

                        download

                        class="btn btn-download">

                        <i class="fa-solid fa-download"></i>

                        Download

                    </a>

                </div>

            `;


            notesContainer.appendChild(card);

        });


    } catch (error) {

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

                    Please try again later.

                </div>

            </div>

        `;

    }

}


// ==========================================
// START LOADING NOTES
// ==========================================

loadNotes();
