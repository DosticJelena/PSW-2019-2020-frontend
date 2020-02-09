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
            doctorId: '',
            price: '',
            changeDoctor: false,
            date: '',
            startTime: '',
            endTime: '',
            changeTime: false,
            chooseOrdination: true
        }
    }

    handleChange = e => {

        if (e.target.name == "doctorId") {
            for (var i = 0; i < this.state.doctors.length; i++) {
                if (this.state.doctors[i].id == e.target.value) {
                    this.setState({ doctorId: this.state.doctors[i].id, doctorFN: this.state.doctors[i].firstName, doctorLN: this.state.doctors[i].lastName });
                    console.log(this.state);
                }
            }
        } else {
            this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
        }

    }

    createAppointmentRequest = () => {
        var st = parseInt(String(this.state.startTime).substr(0, 2));
        var en = parseInt(String(this.state.endTime).substr(0, 2));
        var stMin = parseInt(String(this.state.startTime).substr(3, 2));
        var enMin = parseInt(String(this.state.endTime).substr(3, 2));
        if (st > en || (st == en && stMin >= enMin)) {
            NotificationManager.error('Start time must be set before end time!', 'Error!', 4000);
        } else if (this.state.ordination == '') {
            NotificationManager.error('Ordination cannot be empty!', 'Error!', 4000);
        } else if (this.state.doctorId == '') {
            NotificationManager.error('Doctor cannot be empty!', 'Error!', 4000);
        } else {
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


    }

    changeDoctorVisible = () => {
        var st = parseInt(String(this.state.startTime).substr(0, 2));
        var en = parseInt(String(this.state.endTime).substr(0, 2));
        var stMin = parseInt(String(this.state.startTime).substr(3, 2));
        var enMin = parseInt(String(this.state.endTime).substr(3, 2));
        if (st > en || (st == en && stMin >= enMin)) {
            NotificationManager.error('Start time must be set before end time!', 'Error!', 4000);
        } else {
            this.fetchDoctors();
            this.setState({ changeDoctor: true, changeTime: false, chooseOrdination: false })
        }

    }

    changeTimeVisible = () => {
        this.setState({ changeDoctor: false, changeTime: true, chooseOrdination: false })
    }

    okClose = () => {
        var st = parseInt(String(this.state.startTime).substr(0, 2));
        var en = parseInt(String(this.state.endTime).substr(0, 2));
        var stMin = parseInt(String(this.state.startTime).substr(3, 2));
        var enMin = parseInt(String(this.state.endTime).substr(3, 2));
        if (st > en || (st == en && stMin >= enMin)) {
            NotificationManager.error('Start time must be set before end time!', 'Error!', 4000);
        } else {
            this.setState({ changeDoctor: false, changeTime: false, chooseOrdination: true },
                this.fetchOrdinations())
        }

    }

    fetchDoctors = () => {
        console.log(this.state)
        axios.post("http://localhost:8080/api/available-doctors-by-date-and-time", {
            start: this.state.date + ' ' + this.state.startTime,
            end: this.state.date + ' ' + this.state.endTime
        })
            .then(response => {
                let tmpArray = []
                var found = false;
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].specialization == this.state.spec) {
                        tmpArray.push(response.data[i])
                    }
                    if (response.data[i].id == this.state.doctorId) {
                        found = true;
                    }
                }

                if (tmpArray.length == 0 || found == false) {
                    this.setState({
                        doctors: tmpArray,
                        doctorId: '',
                        doctorLN: '',
                        doctorFN: ''
                    })
                } else {
                    this.setState({
                        doctors: tmpArray
                    })
                }

            })
            .catch((error) => console.log(error))
    }

    fetchPrices = () => {
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
    }

    fetchOrdinations = () => {
        console.log("ORDINACIJEEEEE")
        axios.post("http://localhost:8080/api/appointment/available-ordinations-by-date", {
            startDateTime: this.state.date + ' ' + this.state.startTime,
            endDateTime: this.state.date + ' ' + this.state.endTime,
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
    }

    handleChangeTime = e => {
        this.setState({ ...this.state, [e.target.name]: String(e.target.value) },
            this.fetchDoctors(),
            this.fetchOrdinations()
        );

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
                        startTime: String(response.data.startDateTime).substr(11, 5),
                        endTime: String(response.data.endDateTime).substr(11, 5),
                        date: String(response.data.endDateTime).substr(0, 10),
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

                    this.fetchOrdinations();
                    this.fetchDoctors();
                    this.fetchPrices();

                })
                .catch((error) => console.log(error))
        }

        var ordinationError;
        if (this.state.ordinations.length == 0) {
            ordinationError = (<div>
                <label style={{ color: 'white' }}>...</label>
                <p style={{ color: 'red' }}>There are no available ordinations. Please change the time or a doctor of the appointment.</p>
            </div>)
        }

        var chooseOrdination;
        if (this.state.chooseOrdination == true) {
            chooseOrdination = (<div>
                <div className="form-row">
                    <div className="form-group col">
                        <label htmlFor="ordination">Ordination</label>
                        <select required className="custom-select mr-sm-2" name="ordination" id="ordination" onChange={this.handleChange} >
                            <option defaultValue="0">Choose...</option>
                            {this.state.ordinations.map((ord, index) => (
                                <option key={ord.id} selected={ord.id == this.state.ordination} value={ord.id}>{ord.number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    {ordinationError}
                </div>
            </div>)
        }

        var doctorsBySpec = []
        for (var i = 0; i < this.state.doctors.length; i++) {
            if (this.state.doctors[i].specialization == this.state.spec) {
                doctorsBySpec.push(this.state.doctors[i]);
            }
        }

        var doctorError;
        if (doctorsBySpec.length == 0) {
            doctorError = (<div>
                <label style={{ color: 'white' }}>...</label>
                <p style={{ color: 'red' }}>There are no available specialized doctors during choosen time. Please change date or time.</p>
            </div>)
        }

        var changeDoctor;
        if (this.state.changeDoctor == true) {
            changeDoctor = (<div>
                <div className="form-row">
                    <div className="form-group col-8">
                        <label htmlFor="doctor">Doctor</label>
                        <select required className="custom-select mr-sm-2" name="doctorId" id="doctorId" onChange={this.handleChange} >
                            <option defaultValue="0" >Choose...</option>
                            {doctorsBySpec.map((doctor, index) => (
                                <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName} ({this.state.spec})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <label style={{ color: "white" }}>Ok</label>
                        <br />
                        <button className="btn calendar-ord" onClick={() => this.okClose()}>Ok</button>
                    </div>
                </div>
                <div className="form-row">
                    {doctorError}
                </div>
            </div>)
        }

        var timeError;
        var st = parseInt(String(this.state.startTime).substr(0, 2));
        var en = parseInt(String(this.state.endTime).substr(0, 2));
        var stMin = parseInt(String(this.state.startTime).substr(3, 2));
        var enMin = parseInt(String(this.state.endTime).substr(3, 2));
        if (st > en || (st == en && stMin >= enMin)) {
            timeError = (<div>
                <label style={{ color: 'white' }}>...</label>
                <p style={{ color: 'red' }}>Start time must be set before end time.</p>
            </div>)
        }

        var changeTime;
        if (this.state.changeTime == true) {
            changeTime = (<div>
                <p style={{ color: "darkcyan" }}>Work time is from 08:00 to 20:00</p>
                <div className="form-row">
                    <div className="form-group col-md-5">
                        <label htmlFor="date">Date</label>
                        <input required type="date" value={this.state.date} className="form-control" name="date" id="date" placeholder="Date"
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="date">Start</label>
                        <input required type="time" min="08:00" defaultValue={this.state.startTime} className="form-control" name="startTime" id="start" placeholder="Start time"
                            onChange={this.handleChangeTime} />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="time">End</label>
                        <input required type="time" max="20:00" defaultValue={this.state.endTime} className="form-control" name="endTime" id="end" placeholder="End time"
                            onChange={this.handleChangeTime} />
                    </div>
                    <div className="form-group col-1">
                        <label style={{ color: "white" }}>Ok</label>
                        <br />
                        <button className="btn calendar-ord" onClick={() => this.okClose()}>Ok</button>
                    </div>
                </div>
                <div className="form-row">
                    {timeError}
                </div>
            </div>)
        }


        return (
            <div className="CreateAppointment">
                <h3>Create Appointment</h3>
                <hr />
                <h5>Appointment details:</h5>
                <hr />
                <div className="row">
                    <div className="col-5">
                        <table>
                            <tr><td>Patient: </td><td><em><strong>{this.state.patientFN} {this.state.patientLN}</strong></em></td></tr>
                            <tr><td>Type: </td><td><em><strong>{this.state.typeString}</strong></em></td></tr>
                            <tr><td>Specialization: </td><td><em><strong>{this.state.spec}</strong></em></td></tr>
                            <tr><td>Price: </td><td><em><strong>{this.state.price}€</strong></em></td></tr>
                            <br />
                            <tr><td>Doctor: </td><td><em>{this.state.doctorFN} {this.state.doctorLN}</em></td></tr>
                            <tr><td>Date: </td><td><em>{this.state.date}</em></td></tr>
                            <tr><td>Start: </td><td><em>{this.state.startTime}</em></td></tr>
                            <tr><td>End: </td><td><em>{this.state.endTime}</em></td></tr>
                        </table>
                    </div>
                    <div className="col-7">
                        {chooseOrdination}
                        {changeDoctor}
                        {changeTime}
                    </div>
                </div>
                <hr />
                <button className="btn create-bttn" onClick={() => this.createAppointmentRequest()}>Create</button>
                <button className="btn calendar-ord" onClick={() => this.changeDoctorVisible()} style={{ float: "right", marginLeft: '10px' }}>Change doctor</button>
                <button className="btn calendar-ord" onClick={() => this.changeTimeVisible()} style={{ float: "right", marginLeft: '10px' }}>Change time</button>
            </div>)
    }

}

export default withRouter(CreateAppointment);
