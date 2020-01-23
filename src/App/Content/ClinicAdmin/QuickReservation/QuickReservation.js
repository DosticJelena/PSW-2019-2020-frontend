import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import { Button} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import { withRouter } from 'react-router-dom';

import './QuickReservation.css';

const QuickReservationAlert = withReactContent(Swal)

class QuickReservation extends React.Component {

  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.SendQuickReservationRequest = this.SendQuickReservationRequest.bind(this);

    this.state = {
        startDateTime: '',
        endDateTime: '',
        type: '0',
        ordination: '',
        doctor: '',
        price: 0.0,
        clinicAdmin: '',
        doctors: [],
        ordinations: []
    }

  }

  FormatDateTime() {
    var start = this.state.startDateTime.substr(0, 10) + ' ' + this.state.startDateTime.substr(11);
    var end = this.state.endDateTime.substr(0, 10) + ' ' + this.state.endDateTime.substr(11);
    this.setState({startDateTime: start, endDateTime: end});
  }

  SendQuickReservationRequest = event => {
    event.preventDefault();
    this.FormatDateTime();
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.post("http://localhost:8080/api/clinic-admin/quick-reservation", {
      startDateTime: this.state.startDateTime,
      endDateTime: this.state.endDateTime,
      type: this.state.type,
      ordination: this.state.ordination,
      doctor: this.state.doctor,
      price: this.state.price,
      clinicAdmin: this.state.clinicAdmin
    })  
    .then((resp) => {
      NotificationManager.success('You have created appointment succesfully!', 'Success!', 4000)
      this.props.history.push('/predefined-examinations');
    })
    .catch((error) => NotificationManager.error('Incorect values!', 'Error!', 4000))

  }
  

  handleChange(e) {
    this.setState({...this.state, [e.target.name]: String(e.target.value)});
  }

  handleDateChange(e) {
    var value = String(e.target.value);
    value = value.substr(0, 10) + ' ' + value.substr(11);
    var name = e.target.name;
    console.log(name);
    this.setState({...this.state, [e.target.name]: value});
  }


  componentDidMount() {

    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://localhost:8080/auth/getMyUser")  
        .then(response => {
            console.log(response.data);
            this.setState({
                clinicAdmin: response.data.id
            })
        })
    .catch((error) => console.log(error))
    

    axios.get("http://localhost:8080/api/doctors")  
      .then(response => {
          let tmpArray = []
          for (var i = 0; i < response.data.length; i++) {
              tmpArray.push(response.data[i])
          }

          this.setState({
              doctors: tmpArray
          })
      })
    .catch((error) => console.log(error))

    axios.get("http://localhost:8080/api/ordination/get-all")  
      .then(response => {
          let tmpArray = []
          for (var i = 0; i < response.data.length; i++) {
              tmpArray.push(response.data[i])
          }

          this.setState({
              ordinations: tmpArray
          })
      })
    .catch((error) => console.log(error))
  }

  render() {
    
  return (
    <div className="QuickReservation">
      <Header/>
      <div className="row">
        <div className="col-10">
          <div className="row">
                <div className="col-sm quick-res-header">
                  <h3>Quick Reservation</h3>
                </div>
          </div>
          <div className="row quick-res-form">
                <div className="col-sm">
                <form onSubmit={this.SendQuickReservationRequest}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="doctor">Doctor</label>
                            <select required className="custom-select mr-sm-2" name="doctor" id="doctor" onChange={this.handleChange} >
                              <option defaultValue="0" >Choose...</option>
                              {this.state.doctors.map((doctor, index) => (
                                  <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="ordination">Ordination</label>
                            <select required className="custom-select mr-sm-2" name="ordination" id="ordination" onChange={this.handleChange} >
                              <option defaultValue="0" >Choose...</option>
                              {this.state.ordinations.map((ord, index) => (
                                  <option key={ord.id} value={ord.id}>{ord.number}</option>
                                ))}
                            </select>
                        </div>
                    </div>           
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="date">Start</label>
                            <input required type="datetime-local" className="form-control" name="startDateTime" id="start" placeholder="Start date and time"
                              onChange={this.handleChange}/>
                        </div>
                        <div className="form-group col-md-3">
                        <label htmlFor="time">End</label>
                        <input required type="datetime-local" className="form-control" name="endDateTime" id="end" placeholder="End date and time"
                          onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <div className="form-check form-check">
                            <input defaultChecked onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0"/>
                            <label className="form-check-label" htmlFor="examination">Medical Examination</label>
                        </div>
                        <div className="form-check form-check">
                            <input onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1"/>
                            <label className="form-check-label" htmlFor="operation">Surgery</label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5">
                            <label htmlFor="price">Price</label>
                            <input required type="number" className="form-control" name="price" id="price" placeholder="00.0"
                              onChange={this.handleChange}/>
                        </div>
                        <div className="form-group col-md-1">
                            <label htmlFor="currency">Currency</label>
                            <input required disabled type="text" className="form-control" name="currency" id="currency" placeholder="€"
                              value="€"/>
                        </div>
                    </div>
                    <Button type="submit" className="btn quick-res-btn">Create</Button>
                </form>
                </div>
          </div>
        </div>
        <div className="col-2 quick-res-image">

        </div>
      </div>
      <Footer/>

    </div>
  );
  }
}

export default withRouter(QuickReservation);