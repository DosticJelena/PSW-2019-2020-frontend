import React from 'react';
import './Nurse.css'
import "react-table/react-table.css";
import { Link } from 'react-router-dom'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axios from 'axios';


import logo from '../../../images/med128.png'

class Nurse extends React.Component {

    constructor(props){
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
            <div className="Nurse">
                <Header />
                <div className="">
                    <div className="row welcome-nurse">
                        <div className="col-12">
                            <div className="logo-nurse">
                                <img src={logo} alt="logo" />
                            </div>
                            <h3 className="welcome-and-logo">Welcome, {this.state.firstName} {this.state.lastName}</h3>
                        </div>
                    </div>
            <div className="row links">
                <div className="col link">
                    <h4>All Patients</h4>
                    <p>Look at the list of all patients in clinic.</p>
                    <Link to="/patients" class="btn link-btn-doctor">View List</Link>
                </div>
                <div className="col link">
                    <h4>Authenticate Prescriptions</h4>
                    <p>Look at the list of all prescriptions.</p>
                    <Link to="/authenticate-prescriptions" class="btn link-btn-doctor">View List</Link>
                </div>
                <div className="col link">
                    <h4>Request Leave</h4>
                    <p>Fill out a form.</p>
                    <Link to="/request-leave-nurse" class="btn link-btn-doctor">Request</Link>
                </div>
            </div>
                </div>
                <Footer />

            </div>
        );
    }
}

export default Nurse;