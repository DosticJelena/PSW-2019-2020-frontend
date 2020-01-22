import React from 'react';
import Header from '../../Header/Header';
import axios from 'axios';
import { withRouter } from 'react-router';
import Footer from '../../Footer/Footer';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import './CalendarEventClickWindow.css';


class CalendarEventClickWindow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            disabled: false,
            appointment: {
                title: '',
                start: '',
                end: '',
                ordination: '',
                patient: ''
            }
        }
    }

    componentDidMount () {    
        const appointmentId = window.location.pathname.split("/")[2];
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get('http://localhost:8080/api/appointment/get-appointment/' + appointmentId, {
          responseType: 'json'
        })
              .then(response => {
                this.setState({appointment: response.data});
    
                var appointment = {...this.state.appointment}
                appointment.start = (new Date(appointment.start)).toISOString().slice(5, 16).replace(/-/g, "/").replace("T", " ");
                appointment.end = (new Date(appointment.end)).toISOString().slice(5, 16).replace(/-/g, "/").replace("T", " ");
    
                this.setState({appointment: appointment});
                console.log(this.state);
                //Doctors can make examination reports only in interval [appointment_start:appointment_end+1.5hours]
                var now = new Date()
                var appointment_end_check = new Date(response.data.end);
                appointment_end_check.setMinutes(appointment_end_check.getMinutes() + 90);
                var disabled = (
                    now.toISOString() >= (new Date(response.data.start)).toISOString() ||
                    now.toISOString() <= appointment_end_check.toISOString()
                );
                this.setState({
                    disabled: disabled
                })
                console.log(this.state.appointment);
        })
        .catch((error) => console.log(error))
    
      }

    render() {

        return(
            <div className="CalendarEventClickWindow">
                <Header/>
                <div className="row">
                    <div className="col-10">
                        <h3>{this.state.appointment.title}</h3>
                        <div className="appointmentInfo">
                            <h5>Start date and time: <em>{this.state.appointment.start}</em></h5>
                            <h5>End date and time: <em>{this.state.appointment.end}</em></h5>
                            <h5>Ordination: <em>{this.state.appointment.ordination}</em></h5>
                            <h5>Patient: <em>{this.state.appointment.patient}</em></h5>
                        </div>
                        <div className="buttons">
                            <Button 
                                href={`/medical-card/${this.state.appointment.patientId}`}
                                ariant="contained" color="darkcyan" className="medicalCard">
                                Edit Medical Card
                            </Button>
                            <Tooltip title="You can only start the appointment after intended start time">
                            <span>
                                <Button
                                href={`/examination-report/${this.state.appointment.id}`}
                                ariant="contained" color="darkcyan" className="examinationReport"
                                disabled={this.state.disabled} 
                                style={this.state.disabled ? { pointerEvents: "none" } : {}}>
                                {'Start Examination'}
                                </Button>
                            </span>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="col-2 calendar-event-image">
            
                    </div>
                </div>
                <Footer/>
            </div>
        );

    }
}
export default withRouter(CalendarEventClickWindow);

