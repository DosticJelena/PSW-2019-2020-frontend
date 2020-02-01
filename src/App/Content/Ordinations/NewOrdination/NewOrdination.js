import React from 'react';
import axios from 'axios';

import './NewOrdination.css';
import { Button } from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import { withRouter } from 'react-router-dom';

class NewOrdination extends React.Component {
    
    constructor(props){
        super(props); 
  
        this.state = {
            clinicAdmin: '',
            clinicId: '',
            name: '',
            type: '0',
            number: '',
            ordinations: []
        }
      }

      AddNewOrdination = event => {
        event.preventDefault();
        console.log(this.state);
        var found = false;
        for (var i=0; i< this.state.ordinations.length; i++){
            console.log(this.state.ordinations[i].number);
            if (this.state.ordinations[i].number == this.state.number){
                NotificationManager.error('Ordination with given number already exists!', 'Error!', 4000);
                found = true;
                break;
            }  
        }

        if (found == false){
            this.props.history.push("/ordinations");
            axios.post("http://localhost:8080/api/ordination/new",{
                clinicId: this.state.clinicId,
                number: this.state.number,
                type: this.state.type
            })
            .then(() => {
                NotificationManager.success('New ordination added!', 'Success!', 4000);
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

                axios.get("http://localhost:8080/api/ordination/clinic-ordinations/" + this.state.clinicId)  
                    .then(response => {
                        let tmpArray = []
                        for (var i = 0; i < response.data.length; i++) {
                            tmpArray.push(response.data[i])
                        }
                        this.setState({
                            ordinations: tmpArray
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
            <div className="NewOrdination">
                <h4>New Ordination (<em>{this.state.name}</em>)</h4>
                <hr/>
                <form onSubmit={this.AddNewOrdination}>
                    <div className="form-group row">
                        <label htmlFor="number" className="col-sm-2 col-form-label">Number</label>
                        <div className="col-sm-10">
                        <input onChange={this.handleChange} required type="text" className="form-control" id="number" name="number" placeholder="Enter number"/>
                        </div>
                    </div>
                    <div className="form-group row type-check">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Type</label>
                        <div className="form-check form-check-inline">
                        <input onChange={this.handleChange} defaultChecked className="form-check-input" type="radio" name="type" id="inlineRadio1" value="0"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">Examination</label>
                        </div>
                        <div className="form-check form-check-inline">
                        <input onChange={this.handleChange} className="form-check-input" type="radio" name="type" id="inlineRadio2" value="1"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">Operation</label>
                        </div>
                    </div>
                    <hr/>
                    <Button type="submit" className="btn add-ord">Add</Button>
                </form>
            </div>
        );
    }
    
}

export default withRouter(NewOrdination);