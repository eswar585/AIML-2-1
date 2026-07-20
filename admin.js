// ==========================================
// STUDENT NOTES PORTAL
// ADMIN DASHBOARD
// ==========================================

import { auth, db } from "./firebase.js";

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
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const loginSection = document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const noteForm =
    document.getElementById("noteForm");

const logoutBtn =
    document.getElementById("logoutBtn");

const loginMessage =
    document.getElementById("loginMessage");

const noteMessage =
    document.getElementById("noteMessage");

const notesList =
    document.getElementById("notesList");


// ==========================================
// INITIAL STATE
// ==========================================

dashboardSection.style.display = "none";

logoutBtn.style.display = "none";


// ==========================================
// CHECK LOGIN STATUS
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginSection.style.display = "none";

        dashboardSection.style.display = "block";

        logoutBtn.style.display = "inline-flex";

        loadNotes();

    } else {

        loginSection.style.display = "block";

        dashboardSection.style.display = "none";

        logoutBtn.style.display = "none";

    }

});


// ==========================================
// ADMIN LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.textContent = "Logging in...";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "";

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Login failed. Check your email and password.";

    }

});


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);

    }

});


// ==========================================
// ADD NEW NOTE
// ==========================================

noteForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const subjectCode =
        document.getElementById("subjectCode").value;

    const title =
        document.getElementById("noteTitle").value.trim();

    const fileUrl =
        document.getElementById("fileUrl").value.trim();


    if (!subjectCode || !title || !fileUrl) {

        noteMessage.textContent =
            "Please fill in all fields.";

        return;

    }


    noteMessage.textContent =
        "Adding note...";


    try {

        await addDoc(

            collection(db, "notes"),

            {

                subjectCode: subjectCode,

                title: title,

                fileUrl: fileUrl,

                createdAt: serverTimestamp()

            }

        );


        noteMessage.textContent =
            "Note added successfully!";


        noteForm.reset();


        loadNotes();


    } catch (error) {

        console.error(error);


        noteMessage.textContent =
            "Failed to add note.";

    }

});


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {

    notesList.innerHTML =
        "<p>Loading notes...</p>";


    try {

        const notesQuery = query(

            collection(db, "notes"),

            orderBy("createdAt", "desc")

        );


        const snapshot =
            await getDocs(notesQuery);


        notesList.innerHTML = "";


        if (snapshot.empty) {

            notesList.innerHTML =
                "<p>No notes uploaded yet.</p>";

            return;

        }


        snapshot.forEach((documentSnapshot) => {

            const note =
                documentSnapshot.data();


            const noteId =
                documentSnapshot.id;


            const card =
                document.createElement("div");


            card.className =
                "admin-note-item";


            card.innerHTML = `

                <div>

                    <h3>

                        ${note.title}

                    </h3>

                    <p>

                        Subject Code:
                        <strong>
                            ${note.subjectCode}
                        </strong>

                    </p>

                    <small>

                        ${note.fileUrl}

                    </small>

                </div>


                <button

                    class="btn btn-delete"

                    data-id="${noteId}">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            `;


            const deleteButton =
                card.querySelector(".btn-delete");


            deleteButton.addEventListener(

                "click",

                () => deleteNote(noteId)

            );


            notesList.appendChild(card);

        });


    } catch (error) {

        console.error(error);


        notesList.innerHTML = `

            <p>

                Failed to load notes.

            </p>

        `;

    }

}


// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(noteId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this note?");


    if (!confirmDelete) return;


    try {

        await deleteDoc(

            doc(db, "notes", noteId)

        );


        loadNotes();


    } catch (error) {

        console.error(error);


        alert("Failed to delete note.");

    }

}
