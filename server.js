const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

// Загрузка заметок
app.get('/', (req, res) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при чтении файла' });
    }
    const db = JSON.parse(data);
    res.json(db.notes);
  });
});

// Создание новой заметки
app.post('/', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Заголовок и текст заметки обязательны' });
  }

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при чтении файла' });
    }

    const db = JSON.parse(data);
    const newNote = { id: Date.now(), title, text };
    db.notes.push(newNote);

    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка при записи файла' });
      }
      res.status(201).json(newNote);
    };
  });
});

// Удаление заметки
app.delete('/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при чтении файла' });
    }

    const db = JSON.parse(data);
    const noteIndex = db.notes.findIndex(note => note.id === parseInt(id));

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }

    db.notes.splice(noteIndex, 1);

    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка при записи файла' });
      }
      res.status(204).send();
    };
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});