import React from 'react';

const NowPlaying = ({ 
    track, isPlaying, onTogglePlay, onClose, onNext, onPrev,
    currentTime, audioProgress, onProgressClick, volume, onVolumeClick 
}) => {
    if (!track) return null;

    return (
        <div className="now-playing-bar">
            <div className="now-playing-left">
                <div className="now-playing-cover">🎵</div>
                <div className="now-playing-info">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                </div>
            </div>

            <div className="now-playing-center">
                <div className="player-controls">
                    <button className="control-btn" onClick={onPrev}>⏮️</button>
                    <button className="control-btn play-pause" onClick={onTogglePlay}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button className="control-btn" onClick={onNext}>⏭️</button>
                </div>
                <div className="progress-bar">
                    <span>{currentTime}</span>
                    <div className="progress-track" onClick={onProgressClick}>
                        <div className="progress-fill" style={{ width: `${audioProgress}%` }}></div>
                    </div>
                    <span>{track.duration}</span>
                </div>
            </div>

            <div className="now-playing-right">
                <div className="volume-control">
                    <span>{volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
                    <div className="volume-bar" onClick={onVolumeClick}>
                        <div className="volume-fill" style={{ width: `${volume}%` }}></div>
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>✖</button>
            </div>
        </div>
    );
};

export default NowPlaying;