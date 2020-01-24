import React from 'react';
import './CCAdmin.css'
import "react-table/react-table.css";
import {Link} from 'react-router-dom'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axios from 'axios';


import logo from '../../../images/med128.png'

class CCAdmin extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            email: ""
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/auth/getMyUser")
                .then((resp) => {
                    this.setState({
                        email: resp.data.username
                    })
                    console.log(resp.data)      
                })
    }

  render() {
    
  return (
    <div className="CCAdmin">
      <Header/>
        <div className="">
            <div className="row welcome-nurse">
                <div className="col-12">
                        <div className="logo-nurse">
                            <img src={logo} alt="logo" />
                        </div>
                        <h3 className="welcome-and-logo">Welcome, Clinic Center Admin</h3>
                </div>
            </div>
            <div className="col-12">
            <div className="row">
                {this.state.email == "admin@gmail.com" && (
                    <div className="col link">
                    <h4>Register Clinic Center Admins</h4>
                    <p>Fill out a registration form.</p>
                    <a href="/register-ccadmin" class="btn link-btn-doctor">Create</a>
                </div>
                )}
                <div className="col link">
                    <h4>Registration Requests</h4>
                    <div>
                    <p>List of all patient registration requests.</p>
                    <Link to="/ccadmin-registration-requests" class="btn link-btn-doctor">View List</Link>
                    </div>
                </div>
                <div className="col link">
                    <h4>Register Clinic</h4>
                    <p>Create a new clinic by filling out a form.</p>
                    <a href="/register-clinic" class="btn link-btn-doctor">Register</a>
                </div>
            </div>
            <div className="row">
                <div className="col link">
                    <h4>Register Clinic Admins</h4>
                    <div>
                    <p>Select from list of clinics and fill out a registration form.</p>
                    <a href="/register-clinic-admin" class="btn link-btn-doctor">Register</a>
                    </div>
                </div>
                <div className="col link">
                    <h4>Manage Diagnosis</h4>
                    <p>Create new, edit or delete diagnosis.</p>
                    <a href="/diagnosis" class="btn link-btn-doctor">View List</a>
                </div>
                <div className="col link">
                    <h4>Manage Drugs</h4>
                    <p>Create new, edit or delete drugs.</p>
                    <Link to="/drugs" class="btn link-btn-doctor">View List</Link>
                </div>
            </div>
            </div>
        </div>
        <Footer/>

    </div>
  );
  }
}

export default CCAdmin;