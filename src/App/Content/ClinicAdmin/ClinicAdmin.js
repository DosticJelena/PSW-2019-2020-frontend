import React from 'react';
import './ClinicAdmin.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';


import logo from '../../../images/med128.png'

class ClinicAdmin extends React.Component {

    constructor(props){
        super(props); 
    
        this.state = {
            firstName: '',
            lastName: ''
        }
    }

    componentDidMount(){
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
    <div className="ClinicAdmin">
      <Header/>
        <div className="">
            <div className="row welcome-admin">
                <div className="col-12">
                        <div className="logo-admin">
                            <img src={logo} alt="logo" />
                        </div>
                        <h3 className="welcome-and-logo">Welcome, {this.state.firstName} {this.state.lastName}</h3>
                </div>
            </div>
            <div className="row links">
                <div className="col link">
                    <h4>All Reservation Requests</h4>
                    <p>Look at the list of all patient registration requests.</p>
                    <Link to="/reservation-requests" className="btn link-btn-admin">View List</Link>
                </div>
                <div className="col link">
                    <h4>Create a Quick Reservation</h4>
                    <p>Create a quick reservation for predefined medical appointment.</p>
                    <Link to="/quick-reservation" className="btn link-btn-admin">Create Reservation</Link>
                </div>
                <div className="col link">
                    <h4>Assign operation rooms</h4>
                    <p>Select a room from list of available ones.</p>
                    <Link to="/assign-room" className="btn link-btn-admin">Assign Rooms</Link>
                </div>
            </div>
        </div>
        <Footer/>

    </div>
  );
  }
}

export default ClinicAdmin;