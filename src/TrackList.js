import React from 'react';

const TrackList = ({ tracks, currentTrackId, isPlaying, onTogglePlay, onDeleteRequest, onAddToPlaylist, playlists }) => {
    return (
        <div className="track-list">
            {tracks.length === 0 ? (
                <p className="placeholder">Ваша библиотека пуста. Добавьте первый трек!</p>
            ) : (
                tracks.map(track => (
                    <div key={track.id} className={`track-item ${currentTrackId === track.id ? 'active' : ''}`}>
                        <div className="track-info">
                            <strong>{track.title}</strong>
                            <span>{track.artist} — {track.album}</span>
                            <small>{track.duration}</small>
                        </div>
                        <div className="track-actions">
                            <select 
                                onChange={(e) => onAddToPlaylist(e.target.value, track.id)}
                                defaultValue=""
                                style={{ marginRight: '10px' }}
                            >
                                <option value="" disabled>➕ Добавить в плейлист</option>
                                {Object.keys(playlists).map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <button onClick={() => onTogglePlay(track.id)} className="icon-btn">
                                {currentTrackId === track.id && isPlaying ? '⏸️' : '▶️'}
                            </button>
                            <button onClick={() => onDeleteRequest(track.id)} className="icon-btn delete">🗑️</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TrackList;