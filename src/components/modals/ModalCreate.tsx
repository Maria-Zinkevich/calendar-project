import { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { ModalPopupProps } from '../../types';

export const ModalPopupCreate: React.FC<ModalPopupProps> = ({ open, onClose, onConfirm, selectedDate }) => {
    const [eventTitle, setEventTitle] = useState('');

    const handleConfirm = () => {
        if (eventTitle) {
            onConfirm(eventTitle, selectedDate);
            setEventTitle(''); 
            onClose(); 
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2, width: 300, margin: 'auto', marginTop: '20%' }}>
                <h3>Event name</h3>
                <TextField 
                    value={eventTitle} 
                    onChange={(e) => setEventTitle(e.target.value)} 
                    fullWidth 
                    margin="normal"
                    label="Event name"
                />
                <Button variant="contained" color="primary" onClick={handleConfirm}>Create event</Button>
            </Box>
        </Modal>
    );
};