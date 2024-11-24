import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';

type Event={id:string, title:string, date:string, start:string, end:string};

const saveEvents = (events: Event[]) => {
	localStorage.setItem("events", JSON.stringify(events))
}

export const Schedule = () => {
	let eventsFromLS = localStorage.getItem("events");
	const [events, setEvents] = useState<Event[]>(eventsFromLS ? JSON.parse(eventsFromLS) : []);

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
					console.log("ERROR");//method error
				}
			}
			return event;
		});

		saveEvents(updatedEvents);
		setEvents(updatedEvents);
  	}

	const handleEventClick = (info: EventClickArg) => {
		const eventId = info.event.id; 
		const currentTitle = info.event.title;
		const newTitle = prompt('new event title', currentTitle);
	
		if (newTitle) {
			const updatedEvents = events.map((event) => {
				if (event.id === eventId) {
					return {
						...event,
						title: newTitle 
					};
				}
				return event;
			});

			saveEvents(updatedEvents);
			setEvents(updatedEvents);
		}
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
					console.log("ERROR");//method error
				}
			}
			return event;
		});
	
		saveEvents(updatedEvents);
		setEvents(updatedEvents);
	};
  
	const handleDateClick = (arg: DateClickArg) => { 
		const title = prompt('event name');
		
		if (title) {
			const startDate = new Date(arg.dateStr); 
			const endDate = new Date(startDate.getTime() + 30 * 60000);
			const newEvent: Event = {
				id: events.length.toString(),
				title,
				date: arg.dateStr,
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			};

			const nextEvents = [...events,newEvent];

			saveEvents(nextEvents);
			setEvents(nextEvents);
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
		</div>
	);
};