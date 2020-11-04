"use strict";

var createCalendar = function createCalendar(data) {
  var calendarEl, testes, events, calendar;
  return regeneratorRuntime.async(function createCalendar$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          calendarEl = document.getElementById('calendar');
          testes = JSON.parse(data);
          events = [];
          testes.forEach(function (teste) {
            events.push({
              title: teste.nome,
              start: teste.dataMarcada
            });
          });
          calendar = new FullCalendar.Calendar(calendarEl, {
            height: 'auto',
            locale: 'pt-br',
            initialView: 'dayGridMonth',
            timeZone: 'local',
            headerToolbar: {
              left: 'prev,next today',
              centet: 'title',
              right: 'dayGridMonth, timeGridWeek,timeGridDay'
            },
            events: events
          });
          calendar.render();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var fetchData = function fetchData() {
  return new Promise(function (resolve, reject) {
    fetch('http://localhost:5000/calendario/data', {
      method: 'GET'
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      return createCalendar(data);
    })["catch"](function (err) {
      console.error(err);
    });
  });
};

window.onload(fetchData());