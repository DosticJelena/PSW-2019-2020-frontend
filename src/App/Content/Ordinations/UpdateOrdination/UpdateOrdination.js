import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';

class UpdateOrdination extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.UpdateInfoRequest = this.UpdateInfoRequest.bind(this);

        this.state = {
            clinicId: '',
            ordinationId: '',
            number: '',
            type: '',
            loaded: false,
            appLength: ''
        }
    }

    UpdateInfoRequest = event => {
        event.preventDefault();
        var found = false;
        for (var i=0; i< this.props.ordinations.length; i++){
            console.log(this.props.ordinations[i].number);
            if (this.props.ordinations[i].number == this.state.number && this.props.ordinations[i].id != this.state.ordinationId){
                NotificationManager.error('Ordination with given number already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
        }

        if (found == false){
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.put("http://localhost:8080/api/ordination/" + this.state.ordinationId, {
                number: this.state.number,
                type: this.state.type,
                clinicId: this.state.clinicId
            }).then(() => {
                NotificationManager.success('Successfully updated', 'Success!', 4000);
                window.location.replace('/ordinations');
            }
            ).catch((error) => NotificationManager.error('Something went wrong', 'Error!', 4000))
        }
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log(this.state)
    }

    render() {

        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.ordinationId || undefined || ""))) {
            const ordId = window.location.pathname.split("/")[2];
            axios.get("http://localhost:8080/api/ordination/" + ordId)
                .then(response => {
                    var type;
                    var exam = false;
                    if (response.data.type === "EXAMINATION") {
                        exam = true;
                        type = 0;
                    }
                    var oper = false;
                    if (response.data.type === "OPERATION") {
                        oper = true;
                        type = 1;
                    }
                    this.setState({
                        number: response.data.number,
                        appLength: response.data.appointments.length,
                        type: type,
                        clinicId: response.data.clinicId,
                        loaded: true,
                        ordinationId: ordId,
                        examination: exam,
                        operation: oper
                    })
                }).catch((error) => console.log(error))
        }

        var content;
        if (this.state.appLength == 0){
            content = (<div><h4>Update Ordination</h4>
                <hr/>
                <form onSubmit={this.UpdateInfoRequest}>
                    <div className="form-group row">
                        <label htmlFor="number" className="col-sm-2 col-form-label">Number</label>
                        <div className="col-sm-10">
                        <input defaultValue={this.state.number} onChange={this.handleChange} required type="text" className="form-control" id="number" name="number" placeholder="100"/>
                        </div>
                    </div>
                    <div className="form-group row type-check">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Type</label>
                        <div className="form-check form-check-inline">
                        <input onChange={this.handleChange} defaultChecked={this.state.examination} className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">Examination</label>
                        </div>
                        <div className="form-check form-check-inline">
                        <input onChange={this.handleChange} defaultChecked={this.state.operation} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">Operation</label>
                        </div>
                    </div>
                    <hr/>
                    <Button type="submit" className="btn add-ord">Update</Button>
                </form>
                <br /></div>)
        } else {
            content = (<h4>This ordination has reserved appointments. It cannot be updated.</h4>)
        }

        return (
            <div className="UpdateOrdination">
                {content}
            </div>
        );
    }

}

export default UpdateOrdination;