import React from 'react';
import axios from 'axios';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { withRouter } from 'react-router';
import {
  Calendar,
  DateLocalizer,
  momentLocalizer,
  globalizeLocalizer,
  move,
  Views,
  Navigate,
  components,
} from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const CustomEvent = (event) => { 
  return ( 

  <span><strong style={{ color: 'orange' }}>{event.event.title}</strong><em><br></br> Ordination: {event.event.ordination}
  <br></br> Patient: {event.event.patient} </em></span> 
  ) 
}

class OrdinationCalendar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
            appointments: [],
    }
  }

  renderDates = () =>{

    let appointments = [...this.state.appointments];

    for (var i = 0; i < appointments.length; i++){
      appointments[i].start = new Date(appointments[i].start);
      appointments[i].end = new Date(appointments[i].end);

      this.setState({appointments});
    }
  }

  componentDidMount () {
    axios.get('http://localhost:8080/api/appointment/get-doctor-appointments', {
      responseType: 'json'
    })
          .then(response => {
            this.setState({appointments: response.data});
            this.renderDates();
            console.log(this.state);
    })
    .catch((error) => console.log(error))
  }

  render() {
        return (
          <div className="OrdinationCalendar">
            <div className="cal" style={{ height: '500pt'}}>
            <Calendar
              showMultiDayTimes={true}
              selectable
              localizer={localizer}
              events={this.state.appointments}
              components={{event:CustomEvent}, { agenda: { event: CustomEvent } }}

              style={{ maxHeight: "100%" }}
              onSelectEvent={obj => {
                  this.props.history.push(`/doctor-calendar-event/${obj.id}`)
                }
              }
              startAccessor="start"
              endAccessor="end"
            />
            </div>
          </div>
        )
  }
}

export default withRouter (OrdinationCalendar);