// =============================================
// STUDENT NOTES PORTAL
// SUBJECT DATABASE
// =============================================

const subjects = [

    {
        id: 1,
        code: "25CY206",
        name: "Statistical Foundation for Computing and Data Science",
        icon: "📊",

        syllabus: "pdfs/syllabus/25CY206.pdf",

        notesAvailable: false,

        notes: []
    },

    {
        id: 2,
        code: "25AM201",
        name: "Data Structures",
        icon: "💻",

        syllabus: "pdfs/syllabus/25AM201.pdf",

        notesAvailable: true,

        notes: [

            {
                title: "Lecture 01 - Data Structures",
                file: "pdfs/notes/25AM201/Lec_01(Data_structures).pdf"
            },

            {
                title: "Lecture 02 - Linear Search",
                file: "pdfs/notes/25AM201/Lec_02(Linear_search).pdf"
            },

            {
                title: "Lecture 03 - Binary Search",
                file: "pdfs/notes/25AM201/Lec_03(Binary_search).pdf"
            }

        ]
    },

    {
        id: 3,
        code: "25AM202",
        name: "Design Thinking and Engineering Orientation",
        icon: "🎨",

        syllabus: "pdfs/syllabus/25AM202.pdf",

        notesAvailable: false,

        notes: []
    },

    {
        id: 4,
        code: "25AM203",
        name: "Artificial Intelligence",
        icon: "🤖",

        syllabus: "pdfs/syllabus/25AM203.pdf",

        notesAvailable: false,

        notes: []
    },

    {
        id: 5,
        code: "25CY205",
        name: "Database Management Systems",
        icon: "🗄️",

        syllabus: "pdfs/syllabus/25CY205.pdf",

        notesAvailable: false,

        notes: []
    },

    {
        id: 6,
        code: "25AM206",
        name: "Object Oriented Programming",
        icon: "☕",

        syllabus: "pdfs/syllabus/25AM206.pdf",

        notesAvailable: false,

        notes: []
    },

    {
        id: 7,
        code: "25MT205",
        name: "Discrete Mathematical Structures",
        icon: "📐",

        syllabus: "pdfs/syllabus/25MT205.pdf",

        notesAvailable: false,

        notes: []
    }

];
