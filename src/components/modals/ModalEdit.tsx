import { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { ModalPopupProps } from '../../types';

export const ModalPopupEdit: React.FC<ModalPopupProps> = ({ open, onClose, onConfirm, selectedDate, infoEvent }) => {
    const [eventTitle, setEventTitle] = useState(infoEvent ? infoEvent.title : '');

    useEffect(() => {
        if (infoEvent) {
            setEventTitle(infoEvent.title);
        }
    }, [infoEvent]);

    const handleConfirm = () => {
        if (eventTitle) {
            onConfirm(eventTitle, selectedDate); 
            setEventTitle('');
            onClose();
        }
        onClose(); 
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2, width: 300, margin: 'auto', marginTop: '20%' }}>
                <h3>New event name</h3>
                <TextField 
                    value={eventTitle} 
                    onChange={(e) => setEventTitle(e.target.value)} 
                    fullWidth 
                    margin="normal"
                    label="Event name"
                />
                <Button variant="contained" color="primary" onClick={handleConfirm}>Change event</Button>
            </Box>
        </Modal>
    );
};
