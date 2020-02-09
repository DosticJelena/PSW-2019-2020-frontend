import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';

class MedicalHistory extends React.Component{


    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            id:'',
            comment:'',
            diagnosis:'',
            prescriptions:[]
           
        }
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log(this.state)
    }

    render(){

        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.id))) {
            const id = window.location.pathname.split("/")[2];
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("https://psw-isa-tim3.herokuapp.com/api/examination-report/" + id)
                   .then(response => {
                       console.log(response.data);
                       this.setState({
                           id:id,
                           comment: response.data.comment,
                           diagnosis: response.data.diagnosis,
                           lastEdited: response.data.lastEdited                   
                       })
                   }).catch((error) => console.log(error))

            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("https://psw-isa-tim3.herokuapp.com/api/prescriptions/" + id)
                    .then(response => {
                        console.log(response.data);
                        this.setState({
                           prescriptions:response.data               
                        })
                    }).catch((error) => console.log(error))
        }


    return(
        <div className="RateClinic">
        <div><h4>Medical history</h4>
            <hr/>
                <div className="form-group col">
                    <label className="name"><strong>Diagnosis:</strong>  {this.state.diagnosis}</label>
                    <label className="address"><strong>Prescriptions:</strong> {this.state.prescriptions.map(txt =><li key={txt}>{txt}</li>)} </label>
                    <label  className="description"><strong>Comment:</strong>  {this.state.comment}</label>
                    <label  className="description"><strong>Last edited:</strong> {this.state.lastEdited}</label>
                </div>
                <div className="rating" style={{marginLeft:'20rem'}} >
                </div>                             
                <hr/>
            <br /></div>
        </div>

    );

  }

}
export default MedicalHistory;