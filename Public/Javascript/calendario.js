const createCalendar = async (data) => {
    let calendarEl = document.getElementById('calendar');
    let testes = data
    let calendar = new FullCalendar.Calendar(calendarEl, {
        height: 550,
        initialView: 'dayGridMonth',
        timeZone: 'local',
     
    });

    calendar.render();
    console.log(testes)
  }

const fetchData = ()=>{
    return new Promise ((resolve,reject)=>{
        fetch('http://localhost:5000/calendario/data', {
            method: 'GET', 
        })
        .then(response => response.text()).then(data=> createCalendar(data)).catch(function(err) { console.error(err); });
    })
 
}

fetchData()


