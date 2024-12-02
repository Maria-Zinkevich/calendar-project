// types.ts

export type Event = { id: string; title: string; date?: string; start: string; end: string; };
export type InfoEvent = Pick<Event, 'id' | 'title'>;

export interface ModalPopupProps {
    open: boolean;
    infoEvent?: InfoEvent;
    onClose: () => void;
    onConfirm: (eventTitle: string, selectedDate?: string) => void; 
    selectedDate?: string;
}
