import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../store/slices/uiSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.ui.notifications);

  useEffect(() => {
    const handleRemoveNotification = (event) => {
      dispatch(removeNotification(event.detail.id));
    };

    window.addEventListener('removeNotification', handleRemoveNotification);
    return () => {
      window.removeEventListener('removeNotification', handleRemoveNotification);
    };
  }, [dispatch]);

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
    <div className="notifications-container" style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '350px',
    }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`notification notification-${notif.type}`}
          style={{
            backgroundColor: getBackgroundColor(notif.type),
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'slideIn 0.3s ease',
            cursor: 'pointer',
          }}
          onClick={() => dispatch(removeNotification(notif.id))}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>{getIcon(notif.type)}</span>
            <span>{notif.message}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removeNotification(notif.id));
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: 0.8,
              padding: '0 5px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;