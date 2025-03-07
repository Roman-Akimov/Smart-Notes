let countOFnotes = 0;

function addNoteFunc() {
  const noteTextInput = document.getElementById('noteTextInput').value;
  const noteTitleInput = document.getElementById('noteTitleInput').value;

  if (noteTextInput === "" && noteTitleInput === "") {
    alert("Введите пожалуйста текст для заметки!");
    return;
  }

  const notesContainer = document.getElementById('notesContainer');
  const notesCount = notesContainer.querySelectorAll('.note').length;
  countOFnotes = notesCount + 1;

  const note = document.createElement('div');
  note.classList.add('note');

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.classList.add('note-checkbox');
  note.appendChild(checkBox);

  const noteTitleElement = document.createElement('p');
  noteTitleElement.classList.add('note-title');
  noteTitleElement.textContent = `${countOFnotes}. ${noteTitleInput}`;
  note.appendChild(noteTitleElement);

  const noteTextElement = document.createElement('p');
  noteTextElement.classList.add('note-text');
  noteTextElement.textContent = noteTextInput;
  note.appendChild(noteTextElement);

  notesContainer.appendChild(note);

  document.getElementById('noteTextInput').value = '';
  document.getElementById('noteTitleInput').value = '';

  checkBox.addEventListener('change', function () {
    if (this.checked) {
      note.classList.add('selected');
    } else {
      note.classList.remove('selected');
    }
  });
}

function deleteSelectedNote() {
  const notesContainer = document.getElementById('notesContainer');
  const selectedNotes = document.querySelectorAll('.note.selected');

  selectedNotes.forEach(note => {
    notesContainer.removeChild(note);
  });

  updateNoteNumbers();
}

function updateNoteNumbers() {
  const notes = document.querySelectorAll('.note');
  notes.forEach((note, index) => {
    const noteTitleElement = note.querySelector('.note-title');
    if (noteTitleElement) {
      noteTitleElement.textContent = `${index}. ${noteTitleElement.textContent.split('. ')[1]}`;
    }
  });
}

async function loadNotes(){
  try{
    const response = await fetch('http://localhost:3001/');
    if (!response.ok){
      throw new Error('Ошибка при загрузке заметок');
    }
    const notes = await response.json();
    notes.forEach(note => {
      addNoteToDOM(note.title, note.text, note.id);
    });
  }
  catch (error){
    console.error('Ошибка', error);
  }
}

function addNoteToDOM(title, text, id){
  const note = document.createElement('div');
  note.classList.add('note');
  note.dataset.id = id;

  const noteTitleElement = document.createElement('p');
  noteTitleElement.classList.add('note-title');
  noteTitleElement.textContent = title;

  const noteTextElement = document.createElement('p');
  noteTextElement.classList.add('note-text');
  noteTextElement.textContent = text;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', async () =>{
    await deleteNote(id);
    note.remove();
  });
  note.appendChild(noteTitleElement);
  note.appendChild(noteTextElement);
  note.appendChild(deleteButton);

  document.getElementById('notesContainer').appendChild(note);
}

document.getElementById('addNoteButton').addEventListener('click', async () => {
  const noteTitleInput = document.getElementById('noteTitleInput').value;
  const noteTextInput = document.getElementById('noteTextInput').value;

  if (noteTextInput === "" || noteTitleInput === "") {
    alert("Введите пожалуйста текст для заметки!");
    return;
  }

  const newNote = await saveNote(noteTitleInput, noteTextInput);
  if (newNote) {
    addNoteToDOM(newNote.title, newNote.text, newNote.id);
    document.getElementById('noteTextInput').value = '';
    document.getElementById('noteTitleInput').value = '';
  }
});


document.getElementById('addNoteButton').addEventListener('click', addNoteFunc);
document.getElementById('deleteSelectedButton').addEventListener('click', deleteSelectedNote);