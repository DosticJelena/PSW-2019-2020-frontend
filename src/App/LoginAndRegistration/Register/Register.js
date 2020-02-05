import React from 'react';
import './Register.css'
import logo from '../../../images/med128.png'
import { Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom';

import {NotificationManager} from 'react-notifications';

class Register extends React.Component {

  constructor(props){
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.SendRegisterRequest = this.SendRegisterRequest.bind(this);

      this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            medicalNumber:'',
            address: '',
            city: '',
            country: '',
            phoneNumber: '',
            passwordConfirm:''
      }
   }

  SendRegisterRequest = event => {
      event.preventDefault();
        console.log(this.state);  
        const { password, passwordConfirm } = this.state;
        if (password !== passwordConfirm) {
            alert("Passwords don't match");
        } else {
        axios.post("http://localhost:8080/auth/register", {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            city: this.state.city,
            country: this.state.country,
            phoneNumber: this.state.phoneNumber

        }
        ).then((resp) => {
        NotificationManager.success('Registered successfuly. Please log in', 'Success!', 4000);
        this.props.history.push('/login');
        }
        )
        .catch((error)=> NotificationManager.error('Wrong input', 'Error!', 4000))
        }
}

  handleChange(e) {
      this.setState({...this.state, [e.target.name]: e.target.value});
  }

  render() {
      return (
    <div className="Register">
      <div className="">
            <div className="row">
            <div className="col-4 welcome">
                        <div className="logo">
                            <img alt="logo" src={logo} />
                            <h1 className="title">Clinic Center</h1>
                        </div>
                    </div>
                <div className="col-8 login">
                <form onSubmit={this.SendRegisterRequest}>
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
                                                required
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
                                                required
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
                                                required
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
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input type="password"
                                                className="form-control form-control"
                                                id="password"
                                                name="password"
                                                onChange={this.handleChange}
                                                placeholder="Enter Password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="passwordConfirm">Confirm Password</label>
                                            <input type="password"
                                                className="form-control form-control"
                                                id="passwordConfirm"
                                                name="passwordConfirm"
                                                onChange={this.handleChange}
                                                placeholder="Confirm Password"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div> 
                                <hr/>
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
                                                required
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
                                                required
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
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>         
                            <hr/>
                            <small id="newAccount" className="form-text text-muted"><Link to="/login">Already have an account?</Link></small> 
                            <br/>                      
                            <Button type="submit">Create</Button>
                        </form>
                </div>
            </div>
      </div>
    </div>
  );}
}

export default withRouter(Register);