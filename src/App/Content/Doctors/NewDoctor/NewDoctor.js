import React from 'react';
import axios from 'axios';

import './NewDoctor.css'
import { Button } from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import { withRouter } from 'react-router-dom';

class NewDoctor extends React.Component {
    
    constructor(props){
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
            address: ''
        }
      }

      AddNewDoctor = event => {
        event.preventDefault();
        console.log(this.state);
        var found = false;
        for (var i=0; i< this.state.doctors.length; i++){
            console.log(this.state.doctors[i].username);
            if (this.state.doctors[i].username == this.state.email){
                NotificationManager.error('Doctor with given email address already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
            if (this.state.doctors[i].phoneNumber == this.state.phoneNumber){
                NotificationManager.error('Doctor with given phone number already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
        }

        if (found == false){
            this.props.history.push("/doctors");
            axios.post("http://localhost:8080/api/doctor/new",{
                clinicId: this.state.clinicId,
                username: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                country: this.state.country,
                city: this.state.city,
                address: this.state.address
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
            }).then(() => {
                
                axios.get("http://localhost:8080/api/clinic/"+ this.state.clinicId)
                .then(response => {
                        console.log(response.data);
                        this.setState({
                            name: response.data.name
                        })
                }).catch((error) => console.log(error))

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

    handleChange = e => {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="NewDoctor">
                <h4>New Doctor (<em>{this.state.name}</em>)</h4>
                <hr/>
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
                    <Button type="submit" className="btn add-doc">Add</Button>
                </form>
            </div>
        );
    }
    
}

export default withRouter(NewDoctor);