import React from 'react';
import axios from 'axios';

import { Button } from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import { withRouter } from 'react-router-dom';

class NewAppointmentType extends React.Component {
    
    constructor(props){
        super(props); 
  
        this.state = {
            clinicAdmin: '',
            clinicId: '',
            name: '',
            types: [],
            typeName: ''
        }
      }

      AddNewAppointment = event => {
        event.preventDefault();
        console.log(this.state);
        var found = false;
        for (var i=0; i< this.state.types.length; i++){
            console.log(this.state.types[i].name);
            if (this.state.types[i].name == this.state.typeName){
                NotificationManager.error('Type with given name already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
        }

        if (found == false){
            this.props.history.push("/appointment-types");
            axios.post("http://localhost:8080/api/types/new",{
                clinicId: this.state.clinicId,
                name: this.state.typeName
            })
            .then(() => {
                NotificationManager.success('New appointment type added!', 'Success!', 4000);
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

                axios.get("http://localhost:8080/api/types/" + this.state.clinicId)  
                    .then(response => {
                        let tmpArray = []
                        for (var i = 0; i < response.data.length; i++) {
                            tmpArray.push(response.data[i])
                        }
                        this.setState({
                            types: tmpArray
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
        
        console.log(this.state)
        return (
            <div className="NewAppointmentType">
                <h4>New Appointment Type (<em>{this.state.name}</em>)</h4>
                <hr/>
                <form onSubmit={this.AddNewAppointment}>
                    <div className="form-group row">
                        <label htmlFor="typeName" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                        <input onChange={this.handleChange} required type="text" className="form-control" id="typeName" name="typeName" placeholder="Enter name"/>
                        </div>
                    </div>
                    <hr/>
                    <Button type="submit" className="btn add-ord">Add</Button>
                </form>
            </div>
        );
    }
    
}

export default withRouter(NewAppointmentType);