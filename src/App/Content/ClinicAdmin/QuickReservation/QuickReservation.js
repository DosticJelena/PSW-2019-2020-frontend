import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';
import StepZilla from "react-stepzilla";
import TimeRange from 'react-time-range';
import moment from 'moment';
import DatePicker from 'react-datepicker'

import './QuickReservation.css';

const QuickReservationAlert = withReactContent(Swal)

class QuickReservation extends React.Component {

  constructor(props) {
    super(props);

    this.SendQuickReservationRequest = this.SendQuickReservationRequest.bind(this);

    this.state = {
      startDateTime: '',
      endDateTime: '',
      type: '0',
      ordination: '',
      doctor: '',
      price: '',
      clinicAdmin: '',
      clinicId: '',
      doctors: [],
      ordinations: [],
      formErrors: [],
      disabled: true,
      startTime: '08:00',
      endTime: '08:30',
      prices: [],
      priceSpec: '',
      priceValue: '',
      date: '2020-02-24',
      doctorError: true,
      doctorsBySpec: []
    }

  }

  SendQuickReservationRequest = (event, step) => {
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
    } else if (this.state.price == '') {
      NotificationManager.error('Specialization cannot be empty.', 'Error!', 4000);
    } else if (this.state.doctor == '') {
      NotificationManager.error('Doctor cannot be empty.', 'Error!', 4000);
    } else if (this.state.ordination == '') {
      NotificationManager.error('Ordination cannot be empty.', 'Error!', 4000);
    } else {
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.post("https://deployment-isa.herokuapp.com/api/clinic-admin/quick-reservation", {
        startDateTime: this.state.date + ' ' + this.state.startTime,
        endDateTime: this.state.date + ' ' + this.state.endTime,
        type: this.state.type,
        ordination: this.state.ordination,
        doctor: this.state.doctor,
        price: this.state.price,
        clinicAdmin: this.state.clinicAdmin,
        discount: 5
      })
        .then((resp) => {
          NotificationManager.success('You have created quick reservation appointment succesfully!', 'Success!', 4000)
          this.props.history.push('/clinic-admin');
        })
        .catch((error) => NotificationManager.error('Incorect values!', 'Error!', 4000))

    }

  }

  handleTypeChange = e => {
    this.setState({ price: '', type: e.target.value })
  }

  handleChange = e => {

    if (e.target.name == "ordination") {
      for (var i = 0; i < this.state.ordinations.length; i++) {
        if (this.state.ordinations[i].id == e.target.value) {
          if (this.state.ordinations[i].type == "OPERATION") {
            this.setState({ type: '1', ordination: e.target.value });
          } else if (this.state.ordinations[i].type == "EXAMINATION") {
            this.setState({ type: '0', ordination: e.target.value });
          }
        }
      }
    }

    if (e.target.name == "price") {
      this.setState({ ...this.state, doctor: '', ordination: '', price: e.target.value },
        this.fetchDoctors(),
        this.fetchOrdinations())
    } else {
      this.setState({ ...this.state, [e.target.name]: String(e.target.value) },
        this.fetchDoctors(),
        this.fetchOrdinations()
      );

    }

    console.log(this.state)
  }

  handleChangeTime = (e) => {
    this.setState({ ...this.state, [e.target.name]: String(e.target.value), price: '', doctor: '', ordination: '' },
      this.fetchDoctors(),
      this.fetchOrdinations()
    );

  }

  checkIfEmpty = () => {
    if (this.state.doctors.length == 0) {
      this.setState({ doctor: '' })
    }
    if (this.state.ordinations.length == 0) {
      this.setState({ ordination: '' })
    }
  }

  handleDateChange(e) {
    var value = String(e.target.value);
    value = value.substr(0, 10) + ' ' + value.substr(11);
    var name = e.target.name;
    this.setState({ ...this.state, [e.target.name]: value });
  }

  setStartDate = (date) => {
    var newTime = new Date();
    newTime.setHours(String(date).substr(15, 2))
    newTime.setMinutes(String(date).substr(19, 2))
    this.setState({ startTime: newTime });
  }

  fetchDoctors = () => {
    axios.post("https://deployment-isa.herokuapp.com/api/available-doctors-by-date-and-time", {
      start: this.state.date + ' ' + this.state.startTime,
      end: this.state.date + ' ' + this.state.endTime
    })
      .then(response => {
        console.log(response)
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }

        this.setState({
          doctors: tmpArray
        },
          this.checkIfEmpty())

      })
      .catch((error) => console.log(error))
  }

  fetchOrdinations = () => {
    axios.post("https://deployment-isa.herokuapp.com/api/appointment/available-ordinations-by-date", {
      startDateTime: this.state.date + ' ' + this.state.startTime,
      endDateTime: this.state.date + ' ' + this.state.endTime,
      appType: this.state.type
    })
      .then(response => {
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }
        this.setState({
          ordinations: tmpArray
        },
          this.checkIfEmpty())

      })
      .catch((error) => console.log(error))
  }

  fetchPrices = () => {
    axios.get("https://deployment-isa.herokuapp.com/api/get-appointment-prices")
      .then(response => {
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }

        this.setState({
          prices: tmpArray
        },
          this.checkIfEmpty())
      })
      .catch((error) => console.log(error))
  }

  componentDidMount() {

    console.log(new Date(this.state.date) < new Date())
    this.fetchOrdinations();
    this.fetchDoctors();
    this.fetchPrices();

  }

  render() {

    var ordinationsByTipe = []
    for (var i = 0; i < this.state.ordinations.length; i++) {
      if (this.state.type == "0") {
        if (this.state.ordinations[i].type == "EXAMINATION") {
          ordinationsByTipe.push(this.state.ordinations[i]);
        }
      } else if (this.state.type == "1") {
        if (this.state.ordinations[i].type == "OPERATION") {
          ordinationsByTipe.push(this.state.ordinations[i]);
        }
      }
    }

    var pricesByEnum = [];
    for (var i = 0; i < this.state.prices.length; i++) {
      if (this.state.prices[i].appointmentEnum == "EXAMINATION" && this.state.type == '0') {
        pricesByEnum.push(this.state.prices[i]);
      } else if (this.state.prices[i].appointmentEnum == "OPERATION" && this.state.type == '1')
        pricesByEnum.push(this.state.prices[i]);
    }

    var selectedPrice = [];
    for (var i = 0; i < this.state.prices.length; i++) {
      if (this.state.prices[i].id == this.state.price) {
        selectedPrice.push(this.state.prices[i]);
      }
    }

    var doctorsBySpec = []
    for (var i = 0; i < this.state.doctors.length; i++) {
      if (selectedPrice.length > 0) {
        if (this.state.doctors[i].specialization == selectedPrice[0].appointmentType) {
          doctorsBySpec.push(this.state.doctors[i]);
        }
      }
    }


    var doctorError;
    if (this.state.price == '') {
      doctorError = (<div>
        <label style={{ color: 'silver' }}>...</label>
        <p style={{ color: 'red' }}>You have to choose specialization first.</p>
      </div>)
    } else if (doctorsBySpec.length == 0) {
      doctorError = (<div>
        <label style={{ color: 'silver' }}>...</label>
        <p style={{ color: 'red' }}>There are no available specialized doctors during choosen time. Please change date or time.</p>
      </div>)
    }

    var ordinationError;
    if (ordinationsByTipe.length == 0) {
      ordinationError = (<div>
        <label style={{ color: 'silver' }}>...</label>
        <p style={{ color: 'red' }}>There are no available ordinations. Please change the time or a date of the appointment.</p>
      </div>)
    }

    var timeError;
    var st = parseInt(String(this.state.startTime).substr(0, 2));
    var en = parseInt(String(this.state.endTime).substr(0, 2));
    var stMin = parseInt(String(this.state.startTime).substr(3, 2));
    var enMin = parseInt(String(this.state.endTime).substr(3, 2));
    if (st > en || (st == en && stMin >= enMin)) {
      timeError = (<div>
        <label style={{ color: 'silver' }}>...</label>
        <p style={{ color: 'red' }}>Start time must be set before end time.</p>
      </div>)
    }

    const steps =
      [{
        name: 'Date & Time',
        component:
          (<div className="stepp">
            <hr />
            <h5>Choose start and end time of the appointment:</h5>
            <p>Work time is from 08:00 to 20:00</p>
            <hr />
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="date">Date</label>
                <input required type="date" value={this.state.date} className="form-control" name="date" id="date" placeholder="Date"
                  onChange={this.handleChangeTime} />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="date">Start</label>
                <input required type="time" min="08:00" defaultValue={this.state.startTime} className="form-control" name="startTime" id="start" placeholder="Start time"
                  onChange={this.handleChangeTime} />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="time">End</label>
                <input required type="time" max="20:00" defaultValue={this.state.endTime} className="form-control" name="endTime" id="end" placeholder="End time"
                  onChange={this.handleChangeTime} />
              </div>
              <div className="form-group col-md-5">
                {timeError}
              </div>
            </div>
          </div>)
      },
      {
        name: 'Type',
        component:
          (<div className="stepp">
            <hr />
            <h5>Choose type of the appointment:</h5>
            <hr />
            <div className="form-row">
              <div className="form-group col-md-6"><label htmlFor="doctor">Specialization:</label>
                <select required className="custom-select mr-sm-2" name="price" id="price" onChange={this.handleChange} >
                  <option defaultValue="0" >Choose...</option>
                  {pricesByEnum.map((price, index) => (
                    <option key={price.id} selected={price.id == this.state.price} value={price.id}>{price.appointmentType}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2"></div>
              <div className="form-group col-md-4">
                <label htmlFor="type">Type</label>
                <div className="form-check form-check">
                  <input defaultChecked={this.state.type == "0"} onChange={this.handleTypeChange} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0" />
                  <label className="form-check-label" htmlFor="examination">Examination</label>
                </div>
                <div className="form-check form-check">
                  <input defaultChecked={this.state.type == "1"} onChange={this.handleTypeChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1" />
                  <label className="form-check-label" htmlFor="operation">Operation</label>
                </div>
              </div>
            </div>
          </div>)
      },
      {
        name: 'Doctor',
        component:
          (<div className="stepp">
            <hr />
            <h5>Choose doctor of the appointment:</h5>
            <hr />
            <div className="form-row">
              <div className="form-group col-md-6"><label htmlFor="doctor">Doctor</label>
                <select required className="custom-select mr-sm-2" name="doctor" id="doctor" onChange={this.handleChange} >
                  <option defaultValue="0" >Choose...</option>
                  {doctorsBySpec.map((doctor, index) => (
                    <option key={doctor.id} selected={doctor.id == this.state.doctor} value={doctor.id}>{doctor.firstName} {doctor.lastName} ({doctor.specialization})</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-1">
              </div>
              <div className="form-group col-md-5">
                {doctorError}
              </div>
            </div>
          </div>)
      },
      {
        name: 'Ordination',
        component:
          (<div className="stepp">
            <hr />
            <h5>Choose ordination for the appointment:</h5>
            <hr />
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="ordination">Ordination</label>
                <select required className="custom-select mr-sm-2" name="ordination" id="ordination" onChange={this.handleChange} >
                  <option defaultValue="0" >Choose...</option>
                  {ordinationsByTipe.map((ord, index) => (
                    <option key={ord.id} selected={ord.id == this.state.ordination} value={ord.id}>{ord.number}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                {ordinationError}
              </div>
            </div>
          </div>)
      },
      {
        name: 'Create!',
        component:
          (<div className="stepp">
            <hr />
            <h5>Choose price for the appointment:</h5>
            <hr />
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="ordination">Price</label>
                <select disabled required className="custom-select mr-sm-2" name="price" id="price" onChange={this.handleChange} >
                  {selectedPrice.map((price, index) => (
                    <option key={price.id} value={price.id}>{price.appointmentType} | {price.appointmentEnum} | {price.appointmentPrice}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-1">
                <label htmlFor="currency">Currency</label>
                <input required disabled type="text" className="form-control" name="currency" id="currency" placeholder="€"
                  value="€" />
              </div>
              <Button type="submit" onClick={(event) => this.SendQuickReservationRequest(event)} className="btn quick-res-btn">Create</Button>
            </div>
          </div>)
      }
      ]


    return (
      <div className="QuickReservation">
        <Header />
        <div className="row">
          <div className="col-10">
            <div className="row">
              <div className="col-sm quick-res-header">
                <h3>Quick Reservation</h3>
              </div>
            </div>
            <div className='step-progress'>
              <StepZilla steps={steps} />
            </div>
          </div>
          <div className="col-2 quick-res-image">

          </div>
        </div>
        <Footer />

      </div>
    );
  }
}

export default withRouter(QuickReservation);
