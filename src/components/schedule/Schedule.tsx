import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import { ModalPopupCreate } from '../modals/ModalCreate';
import { ModalPopupEdit } from '../modals/ModalEdit';
import { InfoEvent } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setEvent, dragAndDropEvent, resizeEvent, editEventTitle } from '../../redux/eventSlice';

export const Schedule = () => {
    const dispatch = useDispatch<AppDispatch>();
	const eventsFromState = useSelector(({eventsState}: RootState) => eventsState.events);
   
    const [open, setOpen] = useState(false);
	const [edit, setEdit] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
	const [infoEvent, setInfoEvent] = useState<InfoEvent>();

    const handleEventDrop = (info: EventDropArg) => {
		dispatch(dragAndDropEvent(info));
    }

    const handleEventClick = (info: EventClickArg) => {		
		setEdit(true);
		setInfoEvent(info.event);
    };
		
    const handleEventResize = (info: EventResizeDoneArg) => {
        dispatch(resizeEvent(info));
    };

    const handleDateClick = (arg: DateClickArg) => { 
        setSelectedDate(arg.dateStr);
        setOpen(true); 
    };

    const handleModalClose = () => {
        setOpen(false);
		setEdit(false);
    };

	const handleModalCreateConfirm = (eventTitle: string) => {
		dispatch(setEvent({ title: eventTitle, startDate: selectedDate }));
	};

	const handleModalEditConfirm = (eventTitle: string) => {
		if (infoEvent) {
            dispatch(editEventTitle({title: eventTitle, event: infoEvent}));
        } 
	};
	
    return (
        <div className="schedule">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]} 
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', 
                }}
                events={eventsFromState} 
                dateClick={handleDateClick} 
                eventDrop={handleEventDrop}
                eventClick={handleEventClick}
                eventResize={handleEventResize} 
                slotEventOverlap={true}
                titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }} 
                dayHeaderFormat={{ weekday: 'short' }}
                editable={true} 
                eventStartEditable={true} 
                eventResizableFromStart={true} 
                eventDurationEditable={true} 
                firstDay={1} 
            />

			<ModalPopupCreate 
				open={open} 
				onClose={handleModalClose} 
				onConfirm={handleModalCreateConfirm}
				infoEvent={infoEvent} 
			/>

			<ModalPopupEdit 
				open={edit} 
				onClose={handleModalClose} 
				onConfirm={handleModalEditConfirm}
				infoEvent={infoEvent}
			/>
        </div>
    );
};