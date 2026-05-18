import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../store/slices/uiSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.ui.notifications);

  useEffect(() => {
    notifications.forEach(notif => {
      if (notif.timeoutId) {
        const timer = setTimeout(() => dispatch(removeNotification(notif.id)), notif.duration || 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getBackgroundColor = (type) => {
    switch(type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196f3';
    }
  };

  return (
    <div className="notifications-container" role="region" aria-label="Уведомления">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`notification notification-${notif.type}`}
          role="alert"
          aria-live="polite"
          style={{ backgroundColor: getBackgroundColor(notif.type), color: 'white', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }} aria-hidden="true">{getIcon(notif.type)}</span>
            <span>{notif.message}</span>
          </div>
          <button
            onClick={() => dispatch(removeNotification(notif.id))}
            aria-label="Закрыть уведомление"
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', opacity: 0.8, padding: '0 5px' }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;