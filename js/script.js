// ==========================================
// STUDENT NOTES PORTAL
// script.js
// ==========================================

// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    createSubjectCards();

    setupSearch();

    setupDarkMode();

    setupMobileMenu();

});


// ==========================================
// CREATE SUBJECT CARDS
// ==========================================

function createSubjectCards() {

    const container = document.getElementById("subjectsContainer");

    if (!container) return;

    container.innerHTML = "";

    subjects.forEach(subject => {

        const card = document.createElement("div");

        card.className = "subject-card";

        card.innerHTML = `

            <div class="subject-icon">

                ${subject.icon}

            </div>

            <h3>

                ${subject.name}

            </h3>

            <span class="course-code">

                ${subject.code}

            </span>

            <div class="action-box">

                <a class="btn btn-view"

                   href="subject.html?id=${subject.code}">

                   Open Subject

                </a>

            </div>

        `;

        container.appendChild(card);

    });

}


// ==========================================
// LIVE SEARCH
// ==========================================

function setupSearch() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    input.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".subject-card");

        cards.forEach((card, index) => {

            const subject = subjects[index];

            const found =

                subject.name.toLowerCase().includes(value)

                ||

                subject.code.toLowerCase().includes(value);

            card.style.display = found ? "block" : "none";

        });

    });

}


// ==========================================
// DARK MODE
// ==========================================

function setupDarkMode() {

    const btn = document.getElementById("themeToggle");

    if (!btn) return;

    // Load previous setting

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';

    }

    btn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            btn.innerHTML = '<i class="fa-solid fa-sun"></i>';

        }

        else {

            localStorage.setItem("theme", "light");

            btn.innerHTML = '<i class="fa-solid fa-moon"></i>';

        }

    });

}


// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {

    const menuBtn = document.getElementById("menuBtn");

    const menu = document.getElementById("navMenu");

    if (!menuBtn || !menu) return;

    menuBtn.addEventListener("click", () => {

        menu.classList.toggle("active");

    });

}


// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});
