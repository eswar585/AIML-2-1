// =========================================================
// STUDENT NOTES PORTAL
// ADMIN DASHBOARD - FIREBASE VERSION
// PDF + WORD + POWERPOINT SUPPORT
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


            if (loginSection) {

                loginSection.style.display =
                    "none";

            }


            if (dashboardSection) {

                dashboardSection.style.display =
                    "flex";

            }


            loadNotes();

        }


        else {


            if (loginSection) {

                loginSection.style.display =
                    "flex";

            }


            if (dashboardSection) {

                dashboardSection.style.display =
                    "none";

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


            const email =

                document

                    .getElementById("email")

                    .value

                    .trim();


            const password =

                document

                    .getElementById("password")

                    .value;


            loginMessage.textContent =

                "Signing you in...";


            loginMessage.className =

                "admin-message loading";


            try {


                await signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


                loginMessage.textContent =

                    "Login successful!";


                loginMessage.className =

                    "admin-message success";


            }


            catch (error) {


                console.error(

                    "Login Error:",

                    error

                );


                loginMessage.textContent =

                    "Invalid email or password.";


                loginMessage.className =

                    "admin-message error";

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


            const subjectCode =

                document

                    .getElementById("subjectCode")

                    .value;


            const noteTitle =

                document

                    .getElementById("noteTitle")

                    .value

                    .trim();


            const fileUrl =

                document

                    .getElementById("fileUrl")

                    .value

                    .trim();


            // =====================================
            // GET FILE TYPE
            // =====================================

            const fileType =

                document

                    .getElementById("fileType")

                    .value;


            if (

                !subjectCode ||

                !noteTitle ||

                !fileUrl ||

                !fileType

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


                        file:

                            fileUrl,


                        fileType:

                            fileType,


                        createdAt:

                            serverTimestamp()


                    }

                );


                showNoteMessage(

                    "Note added successfully!",

                    "success"

                );


                noteForm.reset();


                loadNotes();


            }


            catch (error) {


                console.error(

                    "Add Note Error:",

                    error

                );


                showNoteMessage(

                    "Failed to add note.",

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

        `admin-message ${type}`;

}


// =========================================================
// GET FILE ICON
// =========================================================

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


// =========================================================
// GET FILE TYPE NAME
// =========================================================

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


        const notesQuery = query(

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


        if (totalNotes) {


            totalNotes.textContent =

                snapshot.size;

        }


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


        snapshot.forEach(

            (noteDocument) => {


                const note =

                    noteDocument.data();


                const noteId =

                    noteDocument.id;


                const fileType =

                    note.fileType ||

                    "pdf";


                const noteItem =

                    document.createElement(

                        "div"

                    );


                noteItem.className =

                    "admin-note-item";


                noteItem.innerHTML = `


                    <div class="note-info">


                        <div class="note-file-icon">


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

                                ${escapeHTML(

                                    note.subjectCode

                                )}

                                <br>


                                ${getFileTypeName(

                                    fileType

                                )}

                            </p>


                        </div>


                    </div>


                    <div class="note-actions">


                        <a

                            href="${note.file}"

                            target="_blank"

                            rel="noopener noreferrer"

                            class="btn-view">


                            <i class="fa-solid fa-eye"></i>


                            View


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
// SECURITY HELPER
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
