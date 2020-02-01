import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';

class UpdateAppointmentType extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.UpdateInfoRequest = this.UpdateInfoRequest.bind(this);

        this.state = {
            clinicId: '',
            appointmentTypeId: '',
            typeName: ''
        }
    }

    UpdateInfoRequest = event => {
        event.preventDefault();
        var found = false;
        for (var i=0; i< this.props.types.length; i++){
            console.log(this.props.types[i].name);
            if (this.props.types[i].name == this.state.typeName && this.props.types[i].id != this.state.appointmentTypeId){
                NotificationManager.error('Appointment type with given number already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
        }

        if (found == false){
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.put("http://localhost:8080/api/type/" + this.state.appointmentTypeId, {
                name: this.state.typeName,
                clinicId: this.state.clinicId
            }).then(() => {
                NotificationManager.success('Successfully updated', 'Success!', 4000);
                window.location.replace('/appointment-types');
            }
            ).catch((error) => NotificationManager.error('Something went wrong', 'Error!', 4000))
        }
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log(this.state)
    }

    render() {

        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.appointmentTypeId || undefined || ""))) {
            const appId = window.location.pathname.split("/")[2];
            axios.get("http://localhost:8080/api/type/" + appId)
                .then(response => {
                    console.log(response);
                    this.setState({
                        typeName: response.data.name,
                        appointmentTypeId: response.data.id
                    })
                }).catch((error) => console.log(error))
        }

        return (
            <div className="UpdateAppointmentType">
                <h4>Update Appointment Type</h4>
                <hr/>
                <form onSubmit={this.UpdateInfoRequest}>
                    <div className="form-group row">
                        <label htmlFor="typeName" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                        <input defaultValue={this.state.typeName} onChange={this.handleChange} required type="text" className="form-control" id="typeName" name="typeName" placeholder="Enter new name"/>
                        </div>
                    </div>
                    <hr/>
                    <Button type="submit" className="btn add-ord">Update</Button>
                </form>
                <br />
            </div>
        );
    }

}

export default UpdateAppointmentType;