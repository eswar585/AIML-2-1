// ==========================================
// STUDENT NOTES PORTAL
// ADMIN.JS
// ==========================================


// ==========================================
// FIREBASE IMPORTS
// ==========================================

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


// ==========================================
// HTML ELEMENTS
// ==========================================

const loginSection =
    document.getElementById("loginSection");


const dashboardSection =
    document.getElementById("dashboardSection");


const loginForm =
    document.getElementById("loginForm");


const logoutBtn =
    document.getElementById("logoutBtn");


const loginMessage =
    document.getElementById("loginMessage");


const noteForm =
    document.getElementById("noteForm");


const noteMessage =
    document.getElementById("noteMessage");


const notesList =
    document.getElementById("notesList");


// ==========================================
// INITIAL PAGE STATE
// ==========================================

if (dashboardSection) {

    dashboardSection.style.display = "none";

}


if (logoutBtn) {

    logoutBtn.style.display = "none";

}


// ==========================================
// CHECK LOGIN STATUS
// ==========================================

onAuthStateChanged(auth, (user) => {


    if (user) {


        // USER IS LOGGED IN

        if (loginSection) {

            loginSection.style.display = "none";

        }


        if (dashboardSection) {

            dashboardSection.style.display = "block";

        }


        if (logoutBtn) {

            logoutBtn.style.display = "flex";

        }


        loadNotes();


    } else {


        // USER IS LOGGED OUT

        if (loginSection) {

            loginSection.style.display = "flex";

        }


        if (dashboardSection) {

            dashboardSection.style.display = "none";

        }


        if (logoutBtn) {

            logoutBtn.style.display = "none";

        }

    }

});


// ==========================================
// ADMIN LOGIN
// ==========================================

if (loginForm) {


    loginForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            const email =
                document.getElementById("email").value.trim();


            const password =
                document.getElementById("password").value;


            loginMessage.textContent =
                "Logging in...";


            loginMessage.className =
                "login-message loading";


            try {


                await signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


                loginMessage.textContent =
                    "Login successful!";


                loginMessage.className =
                    "login-message success";


            }


            catch (error) {


                console.error(error);


                loginMessage.textContent =
                    "Invalid email or password.";


                loginMessage.className =
                    "login-message error";


            }

        }

    );

}


// ==========================================
// LOGOUT
// ==========================================

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

                    "Logout error:",

                    error

                );

            }

        }

    );

}


// ==========================================
// ADD NEW NOTE
// ==========================================

if (noteForm) {


    noteForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            const subjectCode =
                document.getElementById(

                    "subjectCode"

                ).value;


            const noteTitle =
                document.getElementById(

                    "noteTitle"

                ).value.trim();


            const fileUrl =
                document.getElementById(

                    "fileUrl"

                ).value.trim();


            if (

                !subjectCode ||

                !noteTitle ||

                !fileUrl

            ) {


                noteMessage.textContent =
                    "Please fill all fields.";


                noteMessage.className =
                    "note-message error";


                return;

            }


            noteMessage.textContent =
                "Adding note...";


            noteMessage.className =
                "note-message loading";


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


                        createdAt:

                            serverTimestamp()


                    }

                );


                noteMessage.textContent =
                    "Note added successfully!";


                noteMessage.className =
                    "note-message success";


                noteForm.reset();


                loadNotes();


            }


            catch (error) {


                console.error(error);


                noteMessage.textContent =
                    "Failed to add note.";


                noteMessage.className =
                    "note-message error";


            }

        }

    );

}


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {


    if (!notesList) return;


    notesList.innerHTML = `

        <div class="loading-state">

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
            await getDocs(notesQuery);


        if (snapshot.empty) {


            notesList.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-folder-open"></i>

                    <p>No notes uploaded yet.</p>

                </div>

            `;


            return;

        }


        notesList.innerHTML = "";


        snapshot.forEach((noteDocument) => {


            const note =
                noteDocument.data();


            const noteId =
                noteDocument.id;


            const noteCard =
                document.createElement("div");


            noteCard.className =
                "admin-note-item";


            noteCard.innerHTML = `

                <div class="note-info">

                    <div class="note-file-icon">

                        <i class="fa-solid fa-file-pdf"></i>

                    </div>

                    <div>

                        <h3>

                            ${note.title}

                        </h3>

                        <p>

                            ${note.subjectCode}

                        </p>

                    </div>

                </div>


                <div class="note-actions">

                    <a

                        href="${note.file}"

                        target="_blank"

                        class="btn btn-view">


                        <i class="fa-solid fa-eye"></i>

                        View


                    </a>


                    <button

                        class="btn btn-delete"

                        data-id="${noteId}">


                        <i class="fa-solid fa-trash"></i>

                        Delete


                    </button>

                </div>

            `;


            notesList.appendChild(noteCard);


        });


        // DELETE BUTTONS

        document

            .querySelectorAll(".btn-delete")

            .forEach((button) => {


                button.addEventListener(

                    "click",

                    () => {


                        deleteNote(

                            button.dataset.id

                        );


                    }

                );


            });


    }


    catch (error) {


        console.error(error);


        notesList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>

                    Failed to load notes.

                </p>

            </div>

        `;

    }

}


// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(noteId) {


    const confirmDelete =
        confirm(

            "Are you sure you want to delete this note?"

        );


    if (!confirmDelete) return;


    try {


        await deleteDoc(

            doc(

                db,

                "notes",

                noteId

            )

        );


        alert(

            "Note deleted successfully."

        );


        loadNotes();


    }


    catch (error) {


        console.error(error);


        alert(

            "Failed to delete note."

        );

    }

}
