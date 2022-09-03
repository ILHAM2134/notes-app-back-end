const { nanoid } = require('nanoid');
const notes = require('./notes');

function addNoteHandler(req, h) {
  const { title, tags, body } = req.payload;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const id = nanoid(16);

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSucces = notes.filter((note) => note.id === id).length > 0;

  if (isSucces) {
    const response = h.response({
      error: false,
      status: 'succes',
      message: 'catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.header('Access-Control-Allow-Origin', '');
    response.code(201);
    return response;
  }

  const response = h.response({
    error: false,
    status: 'fail',
    message: 'catatan gagal ditambahkan',
  });

  response.header('Access-Control-Allow-Origin', '*');
  response.code(500);
  return response;
}

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

function editNoteByIdHandler(req, h) {
  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'catatan berhasil diperbaharui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'gagal memperbaharui catatan. ID tidak ditemukan',
  });

  response.code(404);
  return response;
}

function deleteNoteByIdHandler(req, h) {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.respomse({
    status: 'fail',
    message: 'catatan gagal dihapus. ID tidak ditemukan',
  });

  response.code(404);
  return response;
}

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
