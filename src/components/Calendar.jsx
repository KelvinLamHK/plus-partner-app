import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "../css/Calendarcss.css"

function Calendar() {
  const divRef = useRef(null);

  useEffect(() => {
    const divElement = divRef.current;
    const calendarElement = divElement.querySelector('.fc');

    const handleResize = () => {
      const rect = divElement.getBoundingClientRect();
      calendarElement.style.width = rect.width + 'px';
      calendarElement.style.height = rect.height + 'px';
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function dayCellContent({ date, dayNumberText }) {
    return (
      <>
        <span className="fc-day-number" style={{ color: "#004846" }}>
          {dayNumberText}
        </span>
      </>
    );
  }


  return (
    <div id="calendar-container" className="mt-12 w-5/6 mb-5 " ref={divRef}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayCellContent={dayCellContent}
        eventTextColor="white"
        events={[
          { title: 'Event 1', start: '2023-06-01',end:'2023-06-05'},
          { title: 'Event 2', start: '2023-06-05' },
        ]}
        eventBackgroundColor="#004846"
        eventBorderColor="#004846"
        height="md:auto"
      />
    </div>
  );
}

export default Calendar;