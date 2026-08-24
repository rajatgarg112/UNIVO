import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Download, Search, Plus, X, User, Calendar } from 'lucide-react';
import initialNotesData from '../../data/notes.json';
import './NotesHub.css';

const STORAGE_KEY = 'uv_notes_hub_v2';

export default function NotesHub() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      }
    } catch (e) {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotesData));
    return initialNotesData;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'CS301',
    author: 'Dr. Priya Nair',
    type: 'PDF',
    contentSnippet: ''
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const subjectsList = Array.from(new Set(notes.map((n) => n.subject))).filter(Boolean);

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      subject: subjectsList[0] || 'CS301',
      author: 'Dr. Priya Nair',
      type: 'PDF',
      contentSnippet: 'Chapter notes and reference material.'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      subject: note.subject || '',
      author: note.author || '',
      type: note.type || 'PDF',
      contentSnippet: note.contentSnippet || 'Lecture notes summary.'
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDownload = (note) => {
    // Increment download count
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n))
    );

    // Dynamic file download simulation
    const content = `# ${note.title}\nSubject: ${note.subject}\nFaculty: ${note.author}\nDate: ${note.date || '2026-08-09'}\n\n${note.contentSnippet || 'Full lecture notes content.'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${note.type.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    const noteData = {
      id: editingNote ? editingNote.id : 'note_' + Date.now(),
      title: formData.title,
      subject: formData.subject,
      author: formData.author,
      type: formData.type,
      date: editingNote ? editingNote.date : new Date().toISOString().split('T')[0],
      downloadCount: editingNote ? editingNote.downloadCount || 0 : 0,
      contentSnippet: formData.contentSnippet
    };

    if (editingNote) {
      setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? noteData : n)));
    } else {
      setNotes((prev) => [noteData, ...prev]);
    }

    setModalOpen(false);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSubject = subjectFilter === 'all' || n.subject.toLowerCase() === subjectFilter.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.contentSnippet && n.contentSnippet.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="notes-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>Notes Hub</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Shared lecture notes, slides, and downloadable study resources</p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}
        >
          <Plus size={16} /> Upload Note
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search notes by title, description, subject or faculty author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 36px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', fontSize: '14px', cursor: 'pointer', fontWeight: '700', outline: 'none' }}
        >
          <option value="all">All Subjects</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
            <FileText size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <h3>No notes found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const fileTypeLower = (note.type || 'pdf').toLowerCase();
            return (
              <div key={note.id} className="note-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`file-type ${fileTypeLower}`}>{note.type || 'PDF'}</span>
                      <span className="subject-badge">{note.subject}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => handleOpenEdit(note)}
                        style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                        title="Edit Note"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                        title="Delete Note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-desc">{note.contentSnippet || 'Lecture notes & study reference material.'}</p>
                </div>

                <div>
                  <div className="note-meta">
                    <span><User size={13} /> {note.author}</span>
                    <span><Calendar size={13} /> {note.date || '2026-07-20'}</span>
                  </div>

                  <button onClick={() => handleDownload(note)} className="download-btn">
                    <Download size={14} /> Download ({note.downloadCount || 0})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                {editingNote ? 'Edit Note' : 'Upload New Note'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Note Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Subject Code</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>File Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '13px' }}
                  >
                    <option value="PDF">PDF</option>
                    <option value="PPT">PPT</option>
                    <option value="DOCX">DOCX</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Faculty / Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Description / Snippet</label>
                <textarea
                  rows="3"
                  value={formData.contentSnippet}
                  onChange={(e) => setFormData({ ...formData, contentSnippet: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
