import React from 'react';
import axios from 'axios';

import './NewDoctor.css'
import { Button } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';

class NewDoctor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            clinicAdmin: '',
            clinicId: '',
            name: '',
            doctors: [],
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            country: '',
            city: '',
            address: '',
            types: [],
            wTimeStart: '07:00',
            wTimeEnd: '15:00',
            spec: ''
        }
    }

    AddNewDoctor = event => {
        event.preventDefault();
        var st = parseInt(String(this.state.wTimeStart).substr(0, 2));
        var en = parseInt(String(this.state.wTimeEnd).substr(0, 2));
        var stMin = parseInt(String(this.state.startTime).substr(3, 2));
        var enMin = parseInt(String(this.state.endTime).substr(3, 2));
        if (this.state.firstName == '') {
            NotificationManager.error('First name cannot be empty.', 'Error!', 4000);
        } else if (this.state.lastName == '') {
            NotificationManager.error('Last name cannot be empty.', 'Error!', 4000);
        } else if (this.state.email == '') {
            NotificationManager.error('Email address cannot be empty.', 'Error!', 4000);
        } else if (this.state.phoneNumber == '') {
            NotificationManager.error('Phone number cannot be empty.', 'Error!', 4000);
        } else if (this.state.phoneNumber.length < 9 || this.state.phoneNumber.length > 10 || String(this.state.phoneNumber).substr(0, 2) != "06") {
            NotificationManager.error('You have to enter number correctly.\nFormat: "06******* "\n9 or 10 numbers required.', 'Error!', 4000);
        } else if (this.state.wTimeStart == '' || this.state.wTimeEnd == '') {
            NotificationManager.error('Working time cannot be empty.', 'Error!', 4000);
        } else if (st > en || (st == en && stMin >= enMin)) {
            NotificationManager.error('Start time must be set before end time.', 'Error!', 4000);
        } else if (en - st < 6) {
            NotificationManager.error('Working time must be minimum 6 hours.', 'Error!', 4000);
        } else if (this.state.address == '') {
            NotificationManager.error('Address cannot be empty.', 'Error!', 4000);
        } else if (this.state.city == '') {
            NotificationManager.error('City cannot be empty.', 'Error!', 4000);
        } else if (this.state.country == '') {
            NotificationManager.error('Country cannot be empty.', 'Error!', 4000);
        } else if (this.state.spec == '') {
            NotificationManager.error('You have to choose one specialization.', 'Error!', 4000);
        } else {
            console.log(this.state);
            var found = false;
            for (var i = 0; i < this.state.doctors.length; i++) {
                console.log(this.state.doctors[i].username);
                if (this.state.doctors[i].username == this.state.email) {
                    NotificationManager.error('Doctor with given email address already exists!', 'Error!', 4000);
                    found = true;
                    break;
                }
                if (this.state.doctors[i].phoneNumber == this.state.phoneNumber) {
                    NotificationManager.error('Doctor with given phone number already exists!', 'Error!', 4000);
                    found = true;
                    break;
                }
            }
        }


        if (found == false) {
            this.props.history.push("/doctors");
            axios.post("https://deployment-isa.herokuapp.com/api/doctor/new", {
                clinicId: this.state.clinicId,
                username: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                country: this.state.country,
                city: this.state.city,
                address: this.state.address,
                workTimeStart: this.state.wTimeStart,
                workTimeEnd: this.state.wTimeEnd,
                specialization: this.state.spec
            })
                .then(() => {
                    NotificationManager.success('New doctor added!', 'Success!', 4000);
                    window.location.reload()
                }).catch((error) => console.log(error))
        }

    }

    componentDidMount() {
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("https://deployment-isa.herokuapp.com/auth/getMyUser")
            .then(response => {
                console.log(response.data);
                this.setState({
                    clinicAdmin: response.data.id
                })
            })
            .then(() => {

                axios.get("https://deployment-isa.herokuapp.com/api/clinic-admin-clinic/" + this.state.clinicAdmin)
                    .then(response => {
                        console.log(response.data);
                        this.setState({
                            clinicId: response.data
                        })
                    }).then(() => {

                        axios.get("https://deployment-isa.herokuapp.com/api/clinic/" + this.state.clinicId)
                            .then(response => {
                                console.log(response.data);
                                this.setState({
                                    name: response.data.name
                                })
                            }).catch((error) => console.log(error))

                        axios.get("https://deployment-isa.herokuapp.com/api/clinic-doctors/" + this.state.clinicId)
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

                        axios.get("https://deployment-isa.herokuapp.com/api/types/" + this.state.clinicId)
                            .then(response => {
                                this.setState({
                                    types: response.data
                                })
                            })
                            .catch((error) => console.log(error))

                    }).catch((error) => console.log(error))

            }).catch((error) => console.log(error))

    }

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="NewDoctor">
                <h4>New Doctor (<em>{this.state.name}</em>)</h4>
                <hr />
                <form onSubmit={this.AddNewDoctor}>
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text"
                                    className="form-control form-control"
                                    id="firstName"
                                    name="firstName"
                                    onChange={this.handleChange}
                                    placeholder="Enter First Name"

                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text"
                                    className="form-control form-control"
                                    id="lastName"
                                    name="lastName"
                                    onChange={this.handleChange}
                                    placeholder="Enter Last Name"

                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control form-control"
                                    id="email"
                                    name="email"
                                    onChange={this.handleChange}
                                    placeholder="Enter Email Address"

                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input type="number"
                                    className="form-control form-control"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    onChange={this.handleChange}
                                    placeholder="Enter Phone Number"

                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="form-row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="spec">Specialization</label>
                                <select required className="custom-select mr-sm-2" name="spec" id="spec" onChange={this.handleChange} >
                                    <option defaultValue="0" >Choose...</option>
                                    {this.state.types.map((t, index) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="wTimeStart">Working time - start:</label>
                                <input type="time"
                                    className="form-control form-control"
                                    id="wTimeStart"
                                    name="wTimeStart"
                                    onChange={this.handleChange}
                                    placeholder="Enter Phone Number"
                                    defaultValue={this.state.wTimeStart}
                                />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="wTimeEnd">Working time - end:</label>
                                <input type="time"
                                    className="form-control form-control"
                                    id="wTimeEnd"
                                    name="wTimeEnd"
                                    onChange={this.handleChange}
                                    placeholder="Enter Phone Number"
                                    defaultValue={this.state.wTimeEnd}
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input type="text"
                                    className="form-control form-control-sm"
                                    id="country"
                                    name="country"
                                    onChange={this.handleChange}
                                    placeholder="Enter Country"

                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text"
                                    className="form-control form-control-sm"
                                    id="city"
                                    name="city"
                                    onChange={this.handleChange}
                                    placeholder="Enter City"

                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input type="text"
                                    className="form-control form-control-sm"
                                    id="address"
                                    name="address"
                                    onChange={this.handleChange}
                                    placeholder="Enter Address"

                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <Button type="submit" className="btn add-doc">Add</Button>
                </form>
            </div>
        );
    }

}

export default withRouter(NewDoctor);