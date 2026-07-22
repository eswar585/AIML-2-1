// =========================================================
// STUDENT NOTES PORTAL
// ADMIN DASHBOARD - FIREBASE VERSION
// admin.js
// =========================================================


// =========================================================
// FIREBASE IMPORTS
// =========================================================

import {
    auth,
    db
} from "./firebase.js";


import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =========================================================
// HTML ELEMENTS
// =========================================================

const loginSection =
    document.getElementById("loginSection");


const dashboardSection =
    document.getElementById("dashboardSection");


const loginForm =
    document.getElementById("loginForm");


const loginMessage =
    document.getElementById("loginMessage");


const logoutBtn =
    document.getElementById("logoutBtn");


const noteForm =
    document.getElementById("noteForm");


const noteMessage =
    document.getElementById("noteMessage");


const notesList =
    document.getElementById("notesList");


const totalNotes =
    document.getElementById("totalNotes");


// =========================================================
// INITIAL STATE
// =========================================================

if (loginSection) {

    loginSection.style.display = "flex";

}


if (dashboardSection) {

    dashboardSection.style.display = "none";

}


// =========================================================
// AUTHENTICATION CHECK
// =========================================================

onAuthStateChanged(

    auth,

    (user) => {


        if (user) {


            // USER LOGGED IN

            if (loginSection) {

                loginSection.style.display = "none";

            }


            if (dashboardSection) {

                dashboardSection.style.display = "block";

            }


            loadNotes();

        }


        else {


            // USER LOGGED OUT

            if (loginSection) {

                loginSection.style.display = "flex";

            }


            if (dashboardSection) {

                dashboardSection.style.display = "none";

            }

        }

    }

);


// =========================================================
// ADMIN LOGIN
// =========================================================

if (loginForm) {


    loginForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            const emailInput =
                document.getElementById("email");


            const passwordInput =
                document.getElementById("password");


            if (

                !emailInput ||

                !passwordInput

            ) {


                console.error(

                    "Email or password input not found."

                );


                return;

            }


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            if (loginMessage) {

                loginMessage.textContent =
                    "Signing you in...";


                loginMessage.className =
                    "admin-message loading";

            }


            try {


                await signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "Login successful!";


                    loginMessage.className =
                        "admin-message success";

                }

            }


            catch (error) {


                console.error(

                    "Login Error:",

                    error

                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "Invalid email or password.";


                    loginMessage.className =
                        "admin-message error";

                }

            }

        }

    );

}


// =========================================================
// LOGOUT
// =========================================================

if (logoutBtn) {


    logoutBtn.addEventListener(

        "click",

        async () => {


            try {


                await signOut(auth);


                window.location.reload();


            }


            catch (error) {


                console.error(

                    "Logout Error:",

                    error

                );

            }

        }

    );

}


// =========================================================
// ADD NOTE
// =========================================================

if (noteForm) {


    noteForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            // GET FORM ELEMENTS SAFELY

            const subjectCodeInput =
                document.getElementById(
                    "subjectCode"
                );


            const documentTypeInput =
                document.getElementById(
                    "documentType"
                );


            const noteTitleInput =
                document.getElementById(
                    "noteTitle"
                );


            const fileUrlInput =
                document.getElementById(
                    "fileUrl"
                );


            // CHECK ELEMENTS

            if (

                !subjectCodeInput ||

                !documentTypeInput ||

                !noteTitleInput ||

                !fileUrlInput

            ) {


                console.error(

                    "One or more form elements are missing."

                );


                console.log({

                    subjectCode:
                        subjectCodeInput,

                    documentType:
                        documentTypeInput,

                    noteTitle:
                        noteTitleInput,

                    fileUrl:
                        fileUrlInput

                });


                showNoteMessage(

                    "Form error. Please check the HTML field IDs.",

                    "error"

                );


                return;

            }


            // GET VALUES

            const subjectCode =
                subjectCodeInput.value;


            const documentType =
                documentTypeInput.value;


            const noteTitle =
                noteTitleInput.value.trim();


            const fileUrl =
                fileUrlInput.value.trim();


            // VALIDATION

            if (

                !subjectCode ||

                !documentType ||

                !noteTitle ||

                !fileUrl

            ) {


                showNoteMessage(

                    "Please fill all fields.",

                    "error"

                );


                return;

            }


            showNoteMessage(

                "Adding note...",

                "loading"

            );


            try {


                // ADD TO FIRESTORE

                await addDoc(

                    collection(

                        db,

                        "notes"

                    ),

                    {


                        subjectCode:
                            subjectCode,


                        title:
                            noteTitle,


                        type:
                            documentType,


                        file:
                            fileUrl,


                        createdAt:
                            serverTimestamp()

                    }

                );


                showNoteMessage(

                    "Note added successfully!",

                    "success"

                );


                // RESET FORM

                noteForm.reset();


                // RELOAD NOTES

                loadNotes();


            }


            catch (error) {


                console.error(

                    "Add Note Error:",

                    error

                );


                showNoteMessage(

                    "Failed to add note: " +

                    error.message,

                    "error"

                );

            }

        }

    );

}


// =========================================================
// SHOW NOTE MESSAGE
// =========================================================

function showNoteMessage(

    message,

    type

) {


    if (!noteMessage) return;


    noteMessage.textContent =
        message;


    noteMessage.className =
        `note-message ${type}`;

}


// =========================================================
// LOAD NOTES FROM FIRESTORE
// =========================================================

async function loadNotes() {


    if (!notesList) return;


    notesList.innerHTML = `

        <div class="admin-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading notes...

        </div>

    `;


    try {


        const notesQuery =

            query(

                collection(

                    db,

                    "notes"

                ),

                orderBy(

                    "createdAt",

                    "desc"

                )

            );


        const snapshot =

            await getDocs(

                notesQuery

            );


        // TOTAL NOTES

        if (totalNotes) {


            totalNotes.textContent =
                snapshot.size;

        }


        // NO NOTES

        if (snapshot.empty) {


            notesList.innerHTML = `

                <div class="admin-empty">

                    <i class="fa-solid fa-folder-open"></i>

                    No notes uploaded yet.

                </div>

            `;


            return;

        }


        notesList.innerHTML = "";


        // DISPLAY NOTES

        snapshot.forEach(

            (noteDocument) => {


                const note =
                    noteDocument.data();


                const noteId =
                    noteDocument.id;


                const noteType =
                    note.type || "pdf";


                let icon =
                    "fa-file-pdf";


                if (

                    noteType === "word"

                ) {


                    icon =
                        "fa-file-word";

                }


                else if (

                    noteType === "ppt"

                ) {


                    icon =
                        "fa-file-powerpoint";

                }


                const viewerUrl =

                    "pdf-viewer.html?" +

                    "file=" +

                    encodeURIComponent(

                        note.file

                    ) +

                    "&title=" +

                    encodeURIComponent(

                        note.title

                    );


                const noteItem =
                    document.createElement(
                        "div"
                    );


                noteItem.className =
                    "admin-note-item";


                noteItem.innerHTML = `

                    <div class="note-info">

                        <div class="note-file-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>


                        <div>

                            <h3>

                                ${escapeHTML(

                                    note.title

                                )}

                            </h3>


                            <p>

                                ${escapeHTML(

                                    note.subjectCode

                                )}

                                • ${

                                    noteType.toUpperCase()

                                }

                            </p>

                        </div>

                    </div>


                    <div class="note-actions">


                        <a

                            href="${viewerUrl}"

                            target="_blank"

                            class="btn-view">


                            <i class="fa-solid fa-eye"></i>


                            View


                        </a>


                        <a

                            href="${note.file}"

                            download

                            class="btn-view">


                            <i class="fa-solid fa-download"></i>


                            Download


                        </a>


                        <button

                            class="btn-delete"

                            data-id="${noteId}">


                            <i class="fa-solid fa-trash"></i>


                            Delete


                        </button>


                    </div>

                `;


                notesList.appendChild(

                    noteItem

                );

            }

        );


        // DELETE BUTTONS

        document

            .querySelectorAll(

                ".btn-delete"

            )

            .forEach(

                (button) => {


                    button.addEventListener(

                        "click",

                        () => {


                            deleteNote(

                                button.dataset.id

                            );

                        }

                    );

                }

            );

    }


    catch (error) {


        console.error(

            "Load Notes Error:",

            error

        );


        notesList.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-triangle-exclamation"></i>

                Failed to load notes.

            </div>

        `;

    }

}


// =========================================================
// DELETE NOTE
// =========================================================

async function deleteNote(

    noteId

) {


    const confirmed =

        confirm(

            "Are you sure you want to delete this note?"

        );


    if (!confirmed) return;


    try {


        await deleteDoc(

            doc(

                db,

                "notes",

                noteId

            )

        );


        loadNotes();


    }


    catch (error) {


        console.error(

            "Delete Note Error:",

            error

        );


        alert(

            "Failed to delete note."

        );

    }

}


// =========================================================
// ESCAPE HTML
// =========================================================

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
