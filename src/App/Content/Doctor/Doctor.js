import React from 'react';
import { Link } from 'react-router-dom'
import "react-table/react-table.css";
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Doctor.css'

import logo from '../../../images/med128.png'

class Doctor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: ''
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/auth/getMyUser")
            .then(response => {
                console.log(response.data);
                this.setState({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            })
            .catch((error) => console.log(error))
    }

    render() {
        return (
            <div className="Doctor">
                <Header />
                <div className="">
                    <div className="row welcome-doctor">
                        <div className="col-12">
                            <div className="logo-doctor">
                                <img src={logo} alt="logo" />
                            </div>
                            <h3 className="welcome-and-logo">Welcome, {this.state.firstName} {this.state.lastName}</h3>
                        </div>
                    </div>
                    <div className="row links">
                        <div className="col link">
                            <h4>All Patients</h4>
                            <p>Look at the list of all patients in your clinic.</p>
                            <Link to="/patients" className="btn link-btn-doctor">View List</Link>
                        </div>
                        <div className="col link">
                            <h4>List of Appointment Requests</h4>
                            <p>View list of all your appointment requests.</p>
                            <Link to="/reservation-requests" className="btn link-btn-doctor">List of created requests</Link>
                        </div>
                        <div className="col link">
                            <h4>Create Absence/Vacation Request</h4>
                            <p>Choose start and end date.</p>
                            <Link to="/absence-request" className="btn link-btn-doctor">Create</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Doctor;