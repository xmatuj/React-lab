import React from 'react';

const DeleteConfirm = ({ itemName, onConfirm, onCancel }) => {
    return (
        <div className="modal-content confirm-delete">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить трек <strong>«{itemName}»</strong>?</p>
            <div className="modal-actions">
                <button onClick={onCancel} className="secondary-btn">Нет, оставить</button>
                <button onClick={onConfirm} className="delete-btn">Да, удалить</button>
            </div>
        </div>
    );
};

export default DeleteConfirm;