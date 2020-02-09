import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import './NewAppointmentDoctor.css';

const SheduleAlert = withReactContent(Swal)

class NewAppointmentDoctor extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.SendAppointmentRequest = this.SendAppointmentRequest.bind(this);

    this.state = {
      patients: [],
      patName: '',
      patient: '',
      startDate: '',
      endDate: '',
      doctorId: '',
      type: '0',
      focusedInput: "",
      date: '2020-02-24',
      startTime: '08:00',
      endTime: '09:00'
    }
  }

  SendAppointmentRequest = event => {
    event.preventDefault();
    var st = parseInt(String(this.state.startTime).substr(0, 2));
    var en = parseInt(String(this.state.endTime).substr(0, 2));
    var stMin = parseInt(String(this.state.startTime).substr(3, 2));
    var enMin = parseInt(String(this.state.endTime).substr(3, 2));
    if (st > en || (st == en && stMin >= enMin)) {
      NotificationManager.error('Start time must be set before end time.', 'Error!', 4000);
    } if (new Date(this.state.date) <= new Date()) {
      NotificationManager.error('Date has to be set today or after.', 'Error!', 4000);
    } else if (this.state.date == '') {
      NotificationManager.error('Date cannot be empty.', 'Error!', 4000);
    } else if (this.state.startTime == '' || this.state.startTime == '') {
      NotificationManager.error('Time cannot be empty.', 'Error!', 4000);
    } else {
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.post("https://deployment-isa.herokuapp.com/api/doctor/schedule-appointment", {
        patient: this.state.patient,
        startDateTime: this.state.date + ' ' + this.state.startTime,
        endDateTime: this.state.date + ' ' + this.state.endTime,
        doctor: this.state.doctorId,
        type: this.state.type
      })
        .then((resp) => {
          console.log(this.state);
          NotificationManager.success('You have scheduled appointment succesfully!', 'Success!', 4000);
          this.props.history.push('/reservation-requests');
        })
        .catch(() => NotificationManager.error('Something went wrong.', 'Error!', 4000))
    }

  }

  onSuccessHandler(resp) {
    SheduleAlert.fire({
      title: "Scheduled successfully",
      text: ""
    })
  }

  onFailureHandler(error) {
    SheduleAlert.fire({
      title: "Scheduling failed",
      text: error
    })
  }

  handleChange(e) {
    this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
  }

  componentDidMount() {
    const patientId = window.location.pathname.split("/")[2];
    var token = localStorage.getItem('token');
    axios.get("https://deployment-isa.herokuapp.com/api/patients/" + patientId)
      .then(response => {
        this.setState({
          patName: response.data.firstName + " " + response.data.lastName,
          patient: patientId
        })
      })
      .catch((error) => console.log(error))

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("https://deployment-isa.herokuapp.com/auth/getMyUser")
      .then(response => {
        this.setState({
          doctorId: response.data.id
        })
      })
      .catch((error) => console.log(error))
  }

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
    console.log(this.state);
  }

  render() {

    var timeError;
    var st = parseInt(String(this.state.startTime).substr(0, 2));
    var en = parseInt(String(this.state.endTime).substr(0, 2));
    var stMin = parseInt(String(this.state.startTime).substr(3, 2));
    var enMin = parseInt(String(this.state.endTime).substr(3, 2));
    if (st > en || (st == en && stMin >= enMin)) {
      timeError = (<div>
        <p style={{ color: 'red' }}>Start time must be set before end time.</p>
      </div>)
    }

    return (
      <div className="NewAppointmentDoctor">
        <Header />
        <div className="row">
          <div className="col-10">
            <div className="row">
              <div className="col-sm new-appointment-header">
                <h3>Scheduling Appointment</h3>
              </div>
            </div>
            <div className="row new-appointment-form">
              <div className="col">
                <form onSubmit={this.SendAppointmentRequest}>
                  <div className="row">
                    <div className="col-8">
                      <div className="form-group">
                        <div className="col-6">
                          <label htmlFor="patName">Patient:</label>
                          <input disabled type="text" className="form-control" name="patName" id="patName" value={this.state.patName} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8">
                      <div className="form-group">
                        <div className="row">
                          <div className="form-group col-6">
                            <label htmlFor="date">Date</label>
                            <input type="date" value={this.state.date} className="form-control" name="date" id="date" placeholder="Date"
                              onChange={this.handleChange} />
                          </div>
                          <div className="form-group col-3">
                            <label htmlFor="date">Start</label>
                            <input type="time" className="form-control" value={this.state.startTime} name="startTime" id="start" placeholder="Start time"
                              onChange={this.handleChange} />
                          </div>
                          <div className="form-group col-3">
                            <label htmlFor="time">End</label>
                            <input type="time" className="form-control" value={this.state.endTime} name="endTime" id="end" placeholder="End time"
                              onChange={this.handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <div className="form-check form-check">
                          <input defaultChecked onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0" />
                          <label className="form-check-label" htmlFor="examination">Examination</label>
                        </div>
                        <div className="form-check form-check">
                          <input onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1" />
                          <label className="form-check-label" htmlFor="operation">Operation</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                    </div>
                    <div className="col-6">
                      {timeError}
                    </div>
                  </div>
                  <div className="col-sm">
                    <br />
                    <Button type="submit" className="btn create-appointment-btn">Schedule</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-2 new-app-doctor-image">

          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(NewAppointmentDoctor);