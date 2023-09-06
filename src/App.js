import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css'; // Asegúrate de importar el CSS predeterminado
import './small-calendar.css'; // Importa tu CSS personalizado aquí

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  //const tourId = 60; // Reemplaza con el ID del tour que desees
  const [tourId, setTourId] = useState(''); // Estado para almacenar el tourId ingresado por el usuario

  useEffect(() => {
    // Suponiendo que tienes una función fetchAvailability que recibe un tourId y una fecha
    const fetchAvailability = async (tourId, date) => {
      try {
        const response = await fetch(`http://localhost:8080/availability/${tourId}?date=${date}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener disponibilidad');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return { date, availableSlots: 0 }; // Maneja el error según tus necesidades
      }
    };

    // Supongamos que quieres mostrar el calendario para un rango de fechas específico (por ejemplo, un mes)
    const today = moment();
    const endDate = moment().add(30, 'days'); // Mostrar disponibilidad para 30 días desde hoy
    const dateRange = [];

    while (today.isBefore(endDate)) {
      dateRange.push(today.format('YYYY-MM-DD'));
      today.add(1, 'day');
    }
    // Consulta la disponibilidad para cada fecha en el rango usando el tourId ingresado
    Promise.all(dateRange.map(date => fetchAvailability(tourId, date)))
      .then(availabilities => {
        const events = availabilities.map(({ date, availableSlots }) => ({
          start: new Date(date),
          end: new Date(date),
          title: `Disponibilidad: ${availableSlots}`,
          allDay: true,
          resource: { date, availableSlots },
          selectable: availableSlots > 0 // Habilita o deshabilita según la disponibilidad
        }));
        setEvents(events);
      });
    // Consulta la disponibilidad para cada fecha en el rango
    /*
    Promise.all(dateRange.map(date => fetchAvailability(tourId, date)))
      .then(availabilities => {
        const events = availabilities.map(({ date, availableSlots }) => ({
          start: new Date(date),
          end: new Date(date),
          title: `Disponibilidad: ${availableSlots}`,
          allDay: true,
          resource: { date, availableSlots },
          selectable: availableSlots > 0 // Habilita o deshabilita según la disponibilidad
        }));
        setEvents(events);
      });
      */
  }, [tourId]);

  return (
    <div>
      {/* Agrega un campo de entrada para el tourId */}
      <input
        type="text"
        placeholder="Ingrese el ID del tour"
        value={tourId}
        onChange={(e) => setTourId(e.target.value)}
      />

    
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="small-calendar" // Aplica la clase CSS aquí
        selectable={true}
        onSelectSlot={slotInfo => {
          // Maneja la selección de fechas aquí
          console.log('Fecha seleccionada:', slotInfo.start);
        }}
      />
    </div>
  );
}

export default App;
