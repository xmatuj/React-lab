import React from 'react';

const PlaylistManager = ({ tracks, playlists, setPlaylists, currentTrackId, onTogglePlay }) => {
    const playlistNames = Object.keys(playlists);

    const removeFromPlaylist = (playlistName, trackId) => {
        setPlaylists({
            ...playlists,
            [playlistName]: playlists[playlistName].filter(id => id !== trackId)
        });
    };

    const createPlaylist = () => {
        const name = prompt('Введите название нового плейлиста:');
        if (name && !playlists[name]) {
            setPlaylists({
                ...playlists,
                [name]: []
            });
        }
    };

    return (
        <div>
            <div className="view-header">
                <h2>Мои плейлисты</h2>
                <button onClick={createPlaylist} className="primary-btn">+ Новый плейлист</button>
            </div>
            
            {playlistNames.length === 0 ? (
                <p className="placeholder">У вас пока нет плейлистов. Создайте первый!</p>
            ) : (
                playlistNames.map(playlistName => (
                    <div key={playlistName} className="playlist-section">
                        <h3>{playlistName} ({playlists[playlistName].length})</h3>
                        <div className="track-list compact">
                            {playlists[playlistName].length === 0 ? (
                                <p className="placeholder" style={{ padding: '20px' }}>Плейлист пуст</p>
                            ) : (
                                playlists[playlistName].map(trackId => {
                                    const track = tracks.find(t => t.id === trackId);
                                    if (!track) return null;
                                    return (
                                        <div key={track.id} className="track-item compact">
                                            <span>{track.title} — {track.artist}</span>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => onTogglePlay(track.id)} className="icon-btn">
                                                    {currentTrackId === track.id ? '⏸️' : '▶️'}
                                                </button>
                                                <button 
                                                    onClick={() => removeFromPlaylist(playlistName, track.id)} 
                                                    className="icon-btn delete"
                                                    title="Удалить из плейлиста"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PlaylistManager;