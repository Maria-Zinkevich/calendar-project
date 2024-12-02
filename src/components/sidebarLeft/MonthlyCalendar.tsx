import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth'
export const MonthlyCalendar = () => {
    const handleDateClick = (arg: DateClickArg) => { 
        console.log(arg);
    };
    
    return (
        <FullCalendar
            plugins={[multiMonthPlugin,interactionPlugin]}
            initialView={ 'multiMonthYear'}
            multiMonthMaxColumns={1} 
            dateClick={handleDateClick} 
            fixedWeekCount={false}
            weekText={"W"}
            //editable={true} 
            dayHeaderFormat={{ weekday: 'short' }}
            firstDay={1} 
            titleFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
            headerToolbar={{
                left: '',
                center: '',
                right: ''
            }}
            height={230}
        />
    );
};