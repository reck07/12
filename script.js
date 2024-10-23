// Display current date and time
function updateDateTime() {
    const now = new Date();
    document.getElementById('date-time').innerText = now.toLocaleString();
}
setInterval(updateDateTime, 1000);

// Save the note to local storage
function saveNote() {
    const notes = document.querySelectorAll('.note');
    let allNotesContent = '';
    notes.forEach(note => {
        allNotesContent += note.innerHTML + '\n\n'; // Use innerHTML to save formatted content
    });

    if (allNotesContent.trim() === '') {
        alert("Note is empty! Please write something before saving.");
    } else {
        localStorage.setItem('notes', allNotesContent);
        alert("Notes saved!");
    }
}

// Load the notes from local storage when the page loads
window.onload = function() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        const notesArray = savedNotes.split('\n\n');
        notesArray.forEach(noteContent => {
            const noteArea = document.createElement('div');
            noteArea.className = 'note';
            noteArea.contentEditable = 'true'; // Make new notes editable
            noteArea.innerHTML = noteContent; // Set HTML content
            document.getElementById('notesContainer').appendChild(noteArea);
        });
    }
}

// Clear the notes both in the UI and local storage
function clearNote() {
    if (confirm("Are you sure you want to clear all notes?")) {
        document.getElementById('notesContainer').innerHTML = '<div class="note" contenteditable="true" placeholder="Start typing your notes here..."></div>';
        localStorage.removeItem('notes');
    }
}

// Export notes as PDF
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const notes = document.querySelectorAll('.note');
    let allNotesContent = getCurrentDateTime(); // Add date and time

    notes.forEach(note => {
        allNotesContent += note.innerHTML + '\n\n';
    });

    // Split content into lines to avoid issues with large content
    const lines = doc.splitTextToSize(allNotesContent, 180);
    doc.text(lines, 10, 10);
    doc.save('notes.pdf');
}

// Export notes as Word
function exportToWord() {
    const notes = document.querySelectorAll('.note');
    let allNotesContent = getCurrentDateTime(); // Add date and time

    notes.forEach(note => {
        allNotesContent += note.innerHTML + '\n\n';
    });

    const blob = new Blob([allNotesContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notes.doc';
    link.click();
}

// Export notes as PPT
function exportToPPT() {
    const notes = document.querySelectorAll('.note');
    let allNotesContent = getCurrentDateTime(); // Add date and time

    notes.forEach(note => {
        allNotesContent += note.innerHTML + '\n\n';
    });

    const blob = new Blob([allNotesContent], { type: 'application/vnd.ms-powerpoint' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notes.ppt';
    link.click();
}

// Add a new page
function addPage() {
    const newPage = document.createElement('div');
    newPage.className = 'note';
    newPage.contentEditable = 'true'; // Make new notes editable
    newPage.placeholder = "Start typing your notes here...";
    document.getElementById('notesContainer').appendChild(newPage);
}

// Remove the last page
function removePage() {
    const notes = document.querySelectorAll('.note');
    if (notes.length > 1) {
        notes[notes.length - 1].remove();
    } else {
        alert("At least one page must remain!");
    }
}

// Format text (bold, italic, underline)
function formatText(command) {
    document.execCommand(command, false, null);
}

// Insert sticker (emoji) at cursor position
function insertSticker(emoji) {
    const notes = document.querySelectorAll('.note');
    const activeNote = Array.from(notes).find(note => note === document.activeElement);
    if (activeNote) {
        const cursorPos = activeNote.innerHTML.length; // Place emoji at end
        activeNote.innerHTML = activeNote.innerHTML.slice(0, cursorPos) + emoji + activeNote.innerHTML.slice(cursorPos);
        activeNote.focus();
    }
}

// Add image
function addImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgTag = `<img src="${e.target.result}" style="max-width:100%; height:auto;" alt="Uploaded Image"/>`;
        const notes = document.querySelectorAll('.note');
        const activeNote = Array.from(notes).find(note => note === document.activeElement);
        if (activeNote) {
            activeNote.innerHTML += imgTag; // Append image
            activeNote.focus();
        }
    }
    reader.readAsDataURL(file);
}

// Change background color
function changeBackgroundColor(color) {
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        note.style.backgroundColor = color;
    });
}

// Search for notes
function searchNotes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        if (note.innerHTML.toLowerCase().includes(query)) {
            note.style.display = ''; // Show matching notes
        } else {
            note.style.display = 'none'; // Hide non-matching notes
        }
    });
}

// Get the current date and time as a formatted string
function getCurrentDateTime() {
    const now = new Date();
    return `Date: ${now.toLocaleDateString()} | Time: ${now.toLocaleTimeString()}\n\n`;
}

// Update date and time on load
updateDateTime();
