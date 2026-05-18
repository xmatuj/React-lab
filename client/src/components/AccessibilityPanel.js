import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increaseFontSize, decreaseFontSize, resetFontSize, toggleTheme } from '../store/slices/uiSlice';

const AccessibilityPanel = () => {
  const dispatch = useDispatch();
  const fontSize = useSelector(state => state.ui.fontSize);
  const theme = useSelector(state => state.ui.theme);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть панель доступности"
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#1db954',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        ♿
      </button>

      {isOpen && (
        <div
          className="accessibility-panel"
          role="region"
          aria-label="Панель настроек доступности"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '15px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            minWidth: '200px'
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>Размер шрифта: {fontSize}%</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => dispatch(decreaseFontSize())}
                aria-label="Уменьшить размер шрифта"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'var(--text)'
                }}
              >
                A-
              </button>
              <button
                onClick={() => dispatch(resetFontSize())}
                aria-label="Сбросить размер шрифта до 100%"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--text)'
                }}
              >
                Сброс
              </button>
              <button
                onClick={() => dispatch(increaseFontSize())}
                aria-label="Увеличить размер шрифта"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'var(--text)'
                }}
              >
                A+
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть панель"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'var(--text)'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;