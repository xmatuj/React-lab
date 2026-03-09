import React, { useState } from 'react';

const AddTrackForm = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !artist.trim()) return;
        onSave({
            title,
            artist,
            album: album || 'Unknown Album',
            duration: '3:00' // Заглушка
        });
    };

    return (
        <div className="modal-content">
            <h3>Добавить новый трек</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название трека"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Исполнитель"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Альбом (необязательно)"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                />
                <div className="modal-actions">
                    <button type="button" onClick={onCancel} className="secondary-btn">Отмена</button>
                    <button type="submit" className="primary-btn">Сохранить</button>
                </div>
            </form>
        </div>
    );
};

export default AddTrackForm;