import React from 'react';
import axios from 'axios';
import './CreateAppointment.css';
import StepZilla from "react-stepzilla";
import { NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';

class CreateAppointment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            appReqId: '',
            start: '',
            end: '',
            patientId: '',
            ordinations: [],
            ordination: '',
            doctors: [],
            prices: [],
            doctor: '',
            price: ''
        }
    }

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
    }

    createAppointmentRequest = () => {
        console.log(this.state);
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post("http://localhost:8080/api/appointment/new", {
            startDateTime: this.state.start,
            endDateTime: this.state.end,
            patientId: this.state.patientId,
            priceId: this.state.priceId,
            ordinationId: this.state.ordination,
            doctorId: this.state.doctorId,
            type: this.state.typeString,
            appReqId: this.state.appReqId
        })
            .then(() => {
                NotificationManager.success('Successfully created', 'Success!', 4000);
                this.props.history.push("/reservation-requests");
                window.location.reload();
            })
            .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))

    }

    render() {

        console.log(this.props.appReqId)
        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.appReqId || undefined || ""))) {
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("http://localhost:8080/api/appointment-request/" + window.location.pathname.split("/")[2])
                .then(response => {
                    console.log(response);
                    var typee;
                    if (response.data.typeEnum == "EXAMINATION") {
                        typee = "0";
                    } else {
                        typee = "1";
                    }
                    this.setState({
                        appReqId: this.props.appReqId,
                        start: response.data.startDateTime,
                        end: response.data.endDateTime,
                        patientId: response.data.patientId,
                        type: typee,
                        spec: response.data.typeSpec,
                        typeString: response.data.typeEnum,
                        doctorFN: response.data.doctorFN,
                        doctorLN: response.data.doctorLN,
                        doctorId: response.data.doctorId,
                        patientFN: response.data.patientFN,
                        patientLN: response.data.patientLN,
                        price: response.data.price,
                        priceId: response.data.priceId
                    })
                    console.log(this.state)
                }).then(() => {
                    axios.post("http://localhost:8080/api/appointment/available-ordinations-by-date", {
                        startDateTime: this.state.start,
                        endDateTime: this.state.end,
                        appType: this.state.type
                    })
                        .then(response => {
                            let tmpArray = []
                            for (var i = 0; i < response.data.length; i++) {
                                tmpArray.push(response.data[i])
                            }
                            console.log(tmpArray)
                            this.setState({
                                ordinations: tmpArray
                            })
                        })
                        .catch((error) => console.log(error))

                    axios.get("http://localhost:8080/api/clinic-doctors")
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

                    axios.get("http://localhost:8080/api/get-appointment-prices")
                        .then(response => {
                            let tmpArray = []
                            for (var i = 0; i < response.data.length; i++) {
                                tmpArray.push(response.data[i])
                            }

                            this.setState({
                                prices: tmpArray
                            })
                        })
                        .catch((error) => console.log(error))
                })
                .catch((error) => console.log(error))
        }

        var pricesByEnum = [];
        for (var i = 0; i < this.state.prices.length; i++) {
            if (this.state.prices[i].appointmentEnum == this.state.typeString) {
                pricesByEnum.push(this.state.prices[i]);
            }
        }

        const steps =
            [
                {
                    name: 'Step 1',
                    component:
                        (<div className="stepp">
                            <hr />
                            <h5>Choose ordination for the appointment:</h5>
                            <hr />
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="ordination">Ordination</label>
                                    <select required className="custom-select mr-sm-2" name="ordination" id="ordination" onChange={this.handleChange} >
                                        <option defaultValue="0">Choose...</option>
                                        {this.state.ordinations.map((ord, index) => (
                                            <option key={ord.id} value={ord.id}>{ord.number}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>)
                },
                {
                    name: 'Step 2',
                    component:
                        (<div className="stepp">
                            <hr />
                            <h5>Choose doctor for the appointment:</h5>
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
                            </div>
                        </div>)
                },
                {
                    name: 'Step 3',
                    component:
                        (<div className="stepp">
                            <hr />
                            <h5>Choose price for the appointment:</h5>
                            <hr />
                            <div className="form-row">
                                <div className="form-group col-md-6"><label htmlFor="doctor">Price</label>
                                    <select required className="custom-select mr-sm-2" name="price" id="price" onChange={this.handleChange} >
                                        <option defaultValue="0" >Choose...</option>
                                        {pricesByEnum.map((price, index) => (
                                            <option key={price.id} value={price.id}>{price.appointmentType} | {price.appointmentPrice}€</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>)
                },
                {
                    name: 'Step 4',
                    component:
                        (<div className="stepp">
                            <hr />
                            <h5>Appointment details:</h5>
                            <hr />
                            <div>Type: <em>{this.state.typeString} - {this.state.spec}</em></div>
                            <div>Doctor: <em>{this.state.doctorFN} {this.state.doctorLN}</em></div>
                            <div>Ordination: <em>{this.state.ordination} </em></div>
                            <div>Price: <em>{this.state.price}€ </em></div>
                            <div>Patient: <em>{this.state.patientFN} {this.state.patientLN}</em></div>
                            <div>Start: <em>{this.state.start}</em></div>
                            <div>End: <em>{this.state.end}</em></div>
                            <hr />
                            <button className="btn calendar-ord" onClick={() => this.createAppointmentRequest()}>Create</button>
                        </div>)
                }
            ]

        return (
            <div className="CreateAppointment">
                <h3>Create Appointment</h3>
                <hr />
                <h5>Appointment details:</h5>
                <hr />
                <div className="row">
                    <div className="col-5">
                        <table>
                            <tr><td>Type: </td><td><em>{this.state.typeString}</em></td></tr>
                            <tr><td>Specialization: </td><td><em>{this.state.spec}</em></td></tr>
                            <tr><td>Doctor: </td><td><em>{this.state.doctorFN} {this.state.doctorLN}</em></td></tr>
                            <tr><td>Ordination: </td><td><em>{this.state.ordination}</em></td></tr>
                            <tr><td>Price: </td><td><em>{this.state.price}€</em></td></tr>
                            <tr><td>Patient: </td><td><em>{this.state.patientFN} {this.state.patientLN}</em></td></tr>
                            <tr><td>Start: </td><td><em>{this.state.start}</em></td></tr>
                            <tr><td>End: </td><td><em>{this.state.end}</em></td></tr>
                        </table>
                    </div>
                    <div className="col-7">
                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="ordination">Ordination</label>
                                <select required className="custom-select mr-sm-2" name="ordination" id="ordination" onChange={this.handleChange} >
                                    <option defaultValue="0">Choose...</option>
                                    {this.state.ordinations.map((ord, index) => (
                                        <option key={ord.id} value={ord.id}>{ord.number}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <button className="btn create-bttn" onClick={() => this.createAppointmentRequest()}>Create</button>
                <button className="btn calendar-ord" style={{float:"right", marginLeft: '10px'}}>Change doctor</button>
                <button className="btn calendar-ord" style={{float:"right", marginLeft: '10px'}}>Change time</button>
            </div>)
    }

}

export default withRouter(CreateAppointment);

/*/*<div className='step-progress'>
                    <StepZilla steps={steps} />
                </div> */