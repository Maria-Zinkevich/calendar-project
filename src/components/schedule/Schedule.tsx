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
import { Event } from '../../types';

const saveEvents = (events: Event[]) => {
    localStorage.setItem("events", JSON.stringify(events));
}

export const Schedule = () => {
    const eventsFromLS = localStorage.getItem("events");

    const [events, setEvents] = useState<Event[]>(eventsFromLS ? JSON.parse(eventsFromLS) : []);
    const [open, setOpen] = useState(false);
	const [edit, setEdit] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
	const [infoEvent, setInfoEvent] = useState<InfoEvent>();

    const handleEventDrop = (info: EventDropArg) => {
        const updatedEvents = events.map((event) => {
            if (event.id === info.event.id) {
                const startDate = info.event.start?.toISOString();
                const endDate = info.event.end?.toISOString();

                if (startDate && endDate) {
                    return {
                        ...event,
                        start: startDate,
                        end: endDate,
                        date: startDate.split('T')[0]
                    };
                } else {
					console.log("ERROR");
				}
            }
            return event;
        });

        saveEvents(updatedEvents);
        setEvents(updatedEvents);
    }

    const handleEventClick = (info: EventClickArg) => {		
		setEdit(true);
		setInfoEvent(info.event);
    };
		
    const handleEventResize = (info: EventResizeDoneArg) => {
        const updatedEvents = events.map((event) => {
            if (event.id === info.event.id) {
                const startDate = info.event.start?.toISOString();
                const endDate = info.event.end?.toISOString();

                if (startDate && endDate) {
                    return {
                        ...event,
                        start: startDate,
                        end: endDate,
                        date: startDate.split('T')[0]
                    };
				} else {
					console.log("ERROR");
                } 
            }
            return event;
        });
    
        saveEvents(updatedEvents);
        setEvents(updatedEvents);
    };

    const handleDateClick = (arg: DateClickArg) => { 
        setSelectedDate(arg.dateStr);
        setOpen(true); 
    };

    const handleModalClose = () => {
        setOpen(false);
		setEdit(false);
    };

	const handleModalConfirm = (eventTitle: string) => {
		let nextEvents: Event[]; 
	
		if (edit && infoEvent) {
			nextEvents = events.map((event) => {
				if (event.id === infoEvent.id) {
					return {
						...event,
						title: eventTitle,
					};
				}
				return event; 
			});
		} else {
			const startDate = new Date(selectedDate);
			const endDate = new Date(startDate.getTime() + 30 * 60000);
			const newEvent: Event = {
				id: (events.length + 1).toString(),
				title: eventTitle,
				date: selectedDate,
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			};
	
			nextEvents = [...events, newEvent]; 
		}
	
		saveEvents(nextEvents);
		setEvents(nextEvents);
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
                events={events} 
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
				onConfirm={handleModalConfirm}
				infoEvent={infoEvent} 
			/>

			<ModalPopupEdit 
				open={edit} 
				onClose={handleModalClose} 
				onConfirm={handleModalConfirm}
				infoEvent={infoEvent}
			/>
        </div>
    );
};