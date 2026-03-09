import React, { useState, useEffect } from 'react';
import TrackList from './TrackList';
import PlaylistManager from './PlaylistManager';
import NowPlaying from './NowPlaying';
import AddTrackForm from './AddTrackForm';
import DeleteConfirm from './DeleteConfirm';
import { useThemeContext, ThemeToggle } from './ThemeManager';
import './App.css';

// Начальные данные (имитация библиотеки)
const initialTracks = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", album: "After Hours" },
    { id: 2, title: "Flowers", artist: "Miley Cyrus", duration: "3:21", album: "Endless Summer Vacation" },
    { id: 3, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", album: "A Night at the Opera" },
    { id: 4, title: "Houdini", artist: "Dua Lipa", duration: "3:05", album: "Radical Optimism" },
];

function App() {
    const { theme } = useThemeContext();
    const [tracks, setTracks] = useState(initialTracks);
    const [playlists, setPlaylists] = useState({ 'Favorites': [1, 3] }); // Пример плейлиста
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [view, setView] = useState('library'); // library, addTrack, deleteTrack
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // useEffect: логируем изменения и синхронизируем с localStorage
    useEffect(() => {
        console.log(`Библиотека обновлена. Всего треков: ${tracks.length}`);
        localStorage.setItem('musicLibrary', JSON.stringify(tracks));
    }, [tracks]);

    useEffect(() => {
        console.log(`Сейчас играет: ${currentTrackId ? tracks.find(t => t.id === currentTrackId)?.title : 'ничего'}`);
    }, [currentTrackId]);

    const addTrack = (newTrack) => {
    const trackWithId = { ...newTrack, id: Date.now() };
    setTracks([...tracks, trackWithId]);
    
    // Если выбран плейлист, добавляем туда новый трек
    if (selectedPlaylist && playlists[selectedPlaylist]) {
        setPlaylists({
            ...playlists,
            [selectedPlaylist]: [...playlists[selectedPlaylist], trackWithId.id]
        });
    }
    
    setView('library');
};

    const deleteTrack = (id) => {
        setTracks(tracks.filter(t => t.id !== id));
        if (currentTrackId === id) setCurrentTrackId(null); // Сбросить, если удалили текущий
        setView('library');
        setTrackToDelete(null);
    };

    const togglePlay = (id) => {
        if (currentTrackId === id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrackId(id);
            setIsPlaying(true);
        }
    };

    // Добавить новые состояния
const [currentTime, setCurrentTime] = useState('0:00');
const [volume, setVolume] = useState(70);
const [audioProgress, setAudioProgress] = useState(0);

// Функции управления плеером
const playNext = () => {
    if (!currentTrackId) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    if (currentIndex < tracks.length - 1) {
        setCurrentTrackId(tracks[currentIndex + 1].id);
        setAudioProgress(0);
        setCurrentTime('0:00');
    }
};

const playPrev = () => {
    if (!currentTrackId) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    if (currentIndex > 0) {
        setCurrentTrackId(tracks[currentIndex - 1].id);
        setAudioProgress(0);
        setCurrentTime('0:00');
    }
};

const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const percent = (clickPosition / progressBar.offsetWidth) * 100;
    setAudioProgress(percent);
    
    const track = tracks.find(t => t.id === currentTrackId);
    if (track) {
        const [mins, secs] = track.duration.split(':').map(Number);
        const totalSeconds = mins * 60 + secs;
        const newTime = Math.floor((percent / 100) * totalSeconds);
        const newMins = Math.floor(newTime / 60);
        const newSecs = newTime % 60;
        setCurrentTime(`${newMins}:${newSecs.toString().padStart(2, '0')}`);
    }
};

const handleVolumeClick = (e) => {
    const volumeBar = e.currentTarget;
    const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left;
    const percent = (clickPosition / volumeBar.offsetWidth) * 100;
    setVolume(Math.min(100, Math.max(0, percent)));
};

// В NowPlaying передаем новые пропсы
{currentTrackId && (
    <NowPlaying
        track={tracks.find(t => t.id === currentTrackId)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onClose={() => setCurrentTrackId(null)}
        onNext={playNext}
        onPrev={playPrev}
        currentTime={currentTime}
        audioProgress={audioProgress}
        onProgressClick={handleProgressClick}
        volume={volume}
        onVolumeClick={handleVolumeClick}
    />
)}

    return (
    <div className={`app ${theme}`}>
        <ThemeToggle />
        <header className="app-header">
            <h1>🎵 MusicStream</h1>
            <nav>
                <button onClick={() => setView('library')} className={view === 'library' ? 'active' : ''}>Библиотека</button>
                <button onClick={() => setView('playlists')} className={view === 'playlists' ? 'active' : ''}>Плейлисты</button>
            </nav>
        </header>

        <main className="main-content">
            {view === 'library' && (
                <>
                    <div className="view-header">
                        <h2>Все треки</h2>
                        <button onClick={() => setView('addTrack')} className="primary-btn">+ Добавить трек</button>
                    </div>
                    <TrackList
                        tracks={tracks}
                        currentTrackId={currentTrackId}
                        isPlaying={isPlaying}
                        onTogglePlay={togglePlay}
                        onDeleteRequest={(id) => { setTrackToDelete(id); setView('deleteTrack'); }}
                        onAddToPlaylist={(playlistName, trackId) => {
                            if (!playlists[playlistName].includes(trackId)) {
                                setPlaylists({
                                    ...playlists,
                                    [playlistName]: [...playlists[playlistName], trackId]
                                });
                            }
                        }}
                        playlists={playlists}
                    />
                </>
            )}

            {view === 'playlists' && (
                <PlaylistManager
                    tracks={tracks}
                    playlists={playlists}
                    setPlaylists={setPlaylists}
                    currentTrackId={currentTrackId}
                    onTogglePlay={togglePlay}
                />
            )}

            {/* Модальные окна */}
            {view === 'addTrack' && (
                <div className="modal-overlay">
                    <AddTrackForm onSave={addTrack} onCancel={() => setView('library')} />
                </div>
            )}

            {view === 'deleteTrack' && trackToDelete && (
                <div className="modal-overlay">
                    <DeleteConfirm
                        itemName={tracks.find(t => t.id === trackToDelete)?.title}
                        onConfirm={() => deleteTrack(trackToDelete)}
                        onCancel={() => { setView('library'); setTrackToDelete(null); }}
                    />
                </div>
            )}
        </main>

        {currentTrackId && (
            <NowPlaying
                track={tracks.find(t => t.id === currentTrackId)}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onClose={() => setCurrentTrackId(null)}
                onNext={playNext}
                onPrev={playPrev}
                currentTime={currentTime}
                audioProgress={audioProgress}
                onProgressClick={handleProgressClick}
                volume={volume}
                onVolumeClick={handleVolumeClick}
            />
        )}
    </div>
);
}

export default App;