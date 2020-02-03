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
      price: null,
      clinicAdmin: '',
      clinicId: '',
      doctors: [],
      ordinations: [],
      formErrors: [],
      disabled: true
    }

  }

  SendQuickReservationRequest = event => {
    event.preventDefault();
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.post("http://localhost:8080/api/clinic-admin/quick-reservation", {
      startDateTime: this.state.startDateTime.substr(0, 10) + ' ' + this.state.startDateTime.substr(11),
      endDateTime: this.state.endDateTime.substr(0, 10) + ' ' + this.state.endDateTime.substr(11),
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

  handleKeyUp = () => {
    var empty = true;

    Object.keys(this.state.formErrors).forEach(e => {
      if (this.state.formErrors[e] != "") {
        empty = false;
      }
    });

    if (!empty) {
      this.setState({ disabled: true });
      console.log('disabled');
    }

    else {
      if (this.state.price != (null && "") && this.state.doctor != (null && "" && "0") && this.state.ordination != (null && "" && "0") && !this.isEmpty(this.state.startDateTime) && !this.isEmpty(this.state.endDateTime)) {
        this.setState({ disabled: false });
        console.log('enabled');
      }
      else {
        this.setState({ disabled: true });
        console.log('disabled');
      }
    }
  }

  isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  handleChange = e => {

    if (e.target.name == "ordination") {
      for (var i = 0; i < this.state.ordinations.length; i++) {
        if (this.state.ordinations[i].id == e.target.value) {
          console.log(this.state.ordinations[i].type)
          if (this.state.ordinations[i].type == "OPERATION") {
            this.setState({ type: '1' });
          } else if (this.state.ordinations[i].type == "EXAMINATION") {
            this.setState({ type: '0' });
          }
        }
      }
    }
    this.setState({ ...this.state, [e.target.name]: String(e.target.value) });

    this.handleKeyUp();
  }

  handleDateChange(e) {
    var value = String(e.target.value);
    value = value.substr(0, 10) + ' ' + value.substr(11);
    var name = e.target.name;
    console.log(name);
    this.setState({ ...this.state, [e.target.name]: value });
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
      .then(() => {
        axios.get("http://localhost:8080/api/clinic-admin-clinic/" + this.state.clinicAdmin)
          .then(response => {
            console.log(response.data);
            this.setState({
              clinicId: response.data
            })
          })
          .then(() => {

            axios.get("http://localhost:8080/api/ordination/clinic-ordinations/" + this.state.clinicId)
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

            axios.get("http://localhost:8080/api/clinic-doctors/" + this.state.clinicId)
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

          }).catch((error) => console.log(error))

      }).catch((error) => console.log(error))

  }

  render() {

    var ordinationsByTipe = []
    for (var i=0;i<this.state.ordinations.length;i++){
      if (this.state.type == "0"){
        if (this.state.ordinations[i].type == "EXAMINATION"){
          ordinationsByTipe.push(this.state.ordinations[i]);
        }
      } else if (this.state.type == "1"){
        if (this.state.ordinations[i].type == "OPERATION"){
          ordinationsByTipe.push(this.state.ordinations[i]);
        }
      }
    }

    console.log(ordinationsByTipe);

    const steps =
      [
        {
          name: 'Step 1',
          component:
            (<div className="stepp">
              <hr />
              <h5>Choose doctor and type of the appointment:</h5>
              <hr />
              <div className="form-row">
                <div className="form-group col-md-6"><label htmlFor="doctor">Doctor</label>
                  <select required className="custom-select mr-sm-2" name="doctor" id="doctor" onChange={this.handleChange} >
                    <option defaultValue="0" >Choose...</option>
                    {this.state.doctors.map((doctor, index) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2"></div>
                <div className="form-group col-md-4">
                  <label htmlFor="type">Type</label>
                  <div className="form-check form-check">
                    <input defaultChecked={this.state.type == "0"} onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0" />
                    <label className="form-check-label" htmlFor="examination">Examination</label>
                  </div>
                  <div className="form-check form-check">
                    <input defaultChecked={this.state.type == "1"} onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1" />
                    <label className="form-check-label" htmlFor="operation">Operation</label>
                  </div>
                </div>
              </div>
            </div>)
        },
        {
          name: 'Step 2',
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
                      <option key={ord.id} value={ord.id}>{ord.number}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>)
        },
        {
          name: 'Step 3',
          component:
            (<div className="stepp">
              <hr />
              <h5>Choose start and end time of the appointment:</h5>
              <hr />
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label htmlFor="date">Start</label>
                  <input required type="datetime-local" className="form-control" name="startDateTime" id="start" placeholder="Start date and time"
                    onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="time">End</label>
                  <input required type="datetime-local" className="form-control" name="endDateTime" id="end" placeholder="End date and time"
                    onChange={this.handleChange} />
                </div>
              </div>
            </div>)
        },
        {
          name: 'Step 4',
          component:
            (<div className="stepp">
              <hr />
              <h5>Choose ordination for the appointment:</h5>
              <hr />
              <div className="form-row">
                <div className="form-group col-md-5">
                  <label htmlFor="price">Price</label>
                  <input required type="number" className="form-control" name="price" id="price" placeholder="00.0"
                    onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-1">
                  <label htmlFor="currency">Currency</label>
                  <input required disabled type="text" className="form-control" name="currency" id="currency" placeholder="€"
                    value="€" />
                </div>
                <Button type="submit" onClick={this.SendQuickReservationRequest} className="btn quick-res-btn">Create</Button>
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

/*<div className="row quick-res-form">
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
        onChange={this.handleChange} />
    </div>
    <div className="form-group col-md-3">
      <label htmlFor="time">End</label>
      <input required type="datetime-local" className="form-control" name="endDateTime" id="end" placeholder="End date and time"
        onChange={this.handleChange} />
    </div>
  </div>
  <div className="form-group">
    <label htmlFor="type">Type</label>
    <div className="form-check form-check">
      <input disabled defaultChecked onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0" />
      <label className="form-check-label" htmlFor="examination">Examination</label>
    </div>
    <div className="form-check form-check">
      <input disabled onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1" />
      <label className="form-check-label" htmlFor="operation">Operation</label>
    </div>
  </div>
  <div className="form-row">
    <div className="form-group col-md-5">
      <label htmlFor="price">Price</label>
      <input required type="number" className="form-control" name="price" id="price" placeholder="00.0"
        onChange={this.handleChange} />
    </div>
    <div className="form-group col-md-1">
      <label htmlFor="currency">Currency</label>
      <input required disabled type="text" className="form-control" name="currency" id="currency" placeholder="€"
        value="€" />
    </div>
  </div>
  <Button disabled={this.state.disabled} type="submit" className="btn quick-res-btn">Create</Button>
</form>
</div>
</div>*/