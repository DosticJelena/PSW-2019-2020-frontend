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
            rendered: 0
    }
  }

  componentDidMount () {
    
  }

  render() {

        return (
          <div className="OrdinationCalendar">
            <div className="cal" style={{ height: '350pt'}}>
            <Calendar
              showMultiDayTimes={true}
              selectable
              localizer={localizer}
              events={this.props.appointments}
              components={{event:CustomEvent}, { agenda: { event: CustomEvent } }}

              style={{ maxHeight: "100%" }}
              startAccessor="start"
              endAccessor="end"
            />
            </div>
          </div>
        )
  }
}

export default withRouter (OrdinationCalendar);