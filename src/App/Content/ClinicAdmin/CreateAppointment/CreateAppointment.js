import React from 'react';

import './CreateAppointment.css'

class CreateAppointment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            appReq: ''
        }
    }

    render() {
        return (<h3>Create Appointment</h3>)
    }

}

export default CreateAppointment;