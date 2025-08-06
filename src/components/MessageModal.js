// src/components/MessageModal.js

import React from 'react';

const MessageModal = ({ message, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '80%',
                wordBreak: 'break-word'
            }}>
                <p>{message}</p>
                <button onClick={onClose} style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Tamam
                </button>
            </div>
        </div>
    );
};

export default MessageModal;
