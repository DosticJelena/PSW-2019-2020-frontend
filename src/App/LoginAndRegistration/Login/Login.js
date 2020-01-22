import React from 'react';
import {Link} from 'react-router-dom'
import './Login.css'
import Swal from 'sweetalert2';
import { Button} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';


import logo from '../../../images/med128.png'

const LoginAlert = withReactContent(Swal)

class Login extends React.Component {
    
    constructor(props){
        super(props);
  
        this.handleChange = this.handleChange.bind(this);
        this.SendLoginRequest = this.SendLoginRequest.bind(this);
  
        this.state = {
            email: '',
            password: ''
        }
    }

    SendLoginRequest = event => {
        event.preventDefault();
        axios.post("http://localhost:8080/auth/login", this.state)
        .then((resp) => {
            localStorage.setItem('token', resp.data.accessToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.accessToken}`;
            axios.get("http://localhost:8080/auth/getMyUser")
                .then((resp) => {
                    console.log(resp.data)
                    if ((resp.data.authorities[0].name == "ROLE_DOCTOR" 
                        || resp.data.authorities[0].name == "ROLE_NURSE" 
                        || resp.data.authorities[0].name == "ROLE_CLINIC_ADMIN"
                        || resp.data.authorities[0].name == "ROLE_CC_ADMIN")
                         && resp.data.userStatus == "NEVER_LOGGED_IN"){
                        this.props.history.push('/change-password');
                    } else {
                        if (resp.data.authorities[0].name == "ROLE_DOCTOR"){
                            this.props.history.push('/doctor')
                            NotificationManager.success('You have logged in succesfully!', 'Welcome ' + resp.data.firstName + '!', 4000)                            
                        }
                        if (resp.data.authorities[0].name == "ROLE_NURSE"){
                            this.props.history.push('/nurse')
                            NotificationManager.success('You have logged in succesfully!', 'Welcome ' + resp.data.firstName + '!', 4000)
                        }
                        if (resp.data.authorities[0].name == "ROLE_CLINIC_ADMIN"){
                            this.props.history.push('/clinic-admin')
                            NotificationManager.success('You have logged in succesfully!', 'Welcome ' + resp.data.firstName + '!', 4000)
                        }
                        if (resp.data.authorities[0].name == "ROLE_PATIENT"){
                            if (resp.data.patientStatus != "APPROVED"){
                                NotificationManager.info('You must wait for Clinic Center Admin to approve you registration attemp', '', 4000)
                            }
                            else{
                            this.props.history.push('/patient')
                            }
                        }
                        if (resp.data.authorities[0].name == "ROLE_CC_ADMIN"){
                            this.props.history.push('/ccadmin')
                        }
                    }
                }
                )
        }
        )
        .catch((error) => NotificationManager.error('Wrong username or password', 'Error!', 4000)
        )
    }
  
    onSuccessHandler(resp){
        LoginAlert.fire({
            title: "Logged in successfully",
            text: ""
        })
    }

    onFailureHandler(error){
        LoginAlert.fire({
            title: "Log In failed",
            text: "Email and password combination is not acceptable."
        })
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    render(){
      return (
        <div className="Login">
            <div className="row">
                <div className="col-4 welcome">
                    <div className="logo">
                        <img alt="logo" src={logo} />
                        <h1 className="title">Clinic Center</h1>
                    </div>
                </div>
                <div className="col-8 login">
                    <form onSubmit={this.SendLoginRequest}>
                        <div className="row1">
                        <div className="email">
                            <label>E-mail address</label>
                            <input 
                                required
                                type="text" 
                                className="form-control" 
                                id="email" 
                                name="email"
                                aria-describedby="emailHelp"
                                onChange={this.handleChange} 
                                placeholder="E-mail address"/>
                        </div>
                        <div className="password">
                            <label>Password</label>
                            <input 
                                required
                                type="password" 
                                className="form-control" 
                                id="password" 
                                name="password"
                                onChange={this.handleChange}
                                placeholder="Password"/>
                            </div>
                        </div>
                        <div className="submitbtn">
                        <small id="newAccount" className="form-text text-muted"><Link to="/register">Don't have an account?</Link></small>
                        <Button type="submit" className="btn">Log In</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter (Login);