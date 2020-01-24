import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

class VerifyEmail extends React.Component { 

    constructor(props){
        super(props);  
        this.state = {
            redirect: false
        }
    }
    componentDidMount(){

        const patientId = window.location.pathname.split("/")[2];
        console.log(patientId);

        axios.put('http://localhost:8080/api/cc-admin/approve-registration-request/' + patientId, {
            responseType: 'json'
        }).then(response => {
            this.setState({
                redirect: true
              });
            NotificationManager.success('Email verified. You can now log in to the system', '', 3000); 
        });
    }

    render() {
        if (this.state.redirect === true){
            this.props.history.push("/login");
        }
        return <h1>Email verification successful!</h1>
      }

}

export default withRouter (VerifyEmail);
