import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import ReactTable from "react-table";

import './ReservationRequests.css'

const SheduleAlert = withReactContent(Swal)

class ReservationRequests extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.SendAppointmentRequest = this.SendAppointmentRequest.bind(this);

    this.state = {
      appointmentRequests: [{
        id: '',
        date: '',
        time: '',
        type: ''
      }],
      role: ''
    }
  }

  SendAppointmentRequest = event => {
    event.preventDefault();

  }

  onSuccessHandler(resp) {
    SheduleAlert.fire({
      title: "Scheduled successfully",
      text: ""
    })
  }

  onFailureHandler(error) {
    SheduleAlert.fire({
      title: "Scheduling failed",
      text: error
    })
  }

  handleChange(e) {
    this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://localhost:8080/auth/getMyUser")
      .then(response => {
        console.log(response);
        this.setState({
          appointmentRequests: response.data.appointmentRequests,
          role: response.data.authorities[0].name
        })
        console.log(this.state.appointmentRequests[0]);
      })
      .catch((error) => console.log(error))
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  render() {

    let requests  = this.state.appointmentRequests;
    const columns=[
      {
        Header:'Id',
        id: 'id',
        accessor: d => d.id,
        style: {
          textAlign: "center",
          fontSize: 20
        }
    },{
      Header:'Date',
      accessor: 'date',
      style: {
        textAlign: "center",
        fontSize: 20
      }
    },{
        Header:'Time',
        accessor: 'time',
        style: {
          textAlign: "center",
          fontSize: 20
        }
    },{
        Header:'Type',
        accessor: 'type',
        style: {
          textAlign: "center",
          fontSize: 20
        }
    },{
      Header: '',
      Cell: row => (                        
          <div>
          <button className="btn primary btn-app-req">Create appointment</button>
        </div>
      ),
      filterable: false,
      style: {
        textAlign: "center"
      }
    }]

    const columns_doctor=[
      {
        Header:'Id',
        id: 'id',
        accessor: d => d.id,
        style: {
          textAlign: "center",
          fontSize: 20
        }
    },{
      Header:'Date',
      accessor: 'date',
      style: {
        textAlign: "center",
        fontSize: 20
      }
    },{
        Header:'Time',
        accessor: 'time',
        style: {
          textAlign: "center",
          fontSize: 20
        }
    },{
        Header:'Type',
        accessor: 'type',
        style: {
          textAlign: "center",
          fontSize: 20
        }
    }]

    var content;
    if (this.state.role == "ROLE_DOCTOR") {
      content = columns_doctor;
    } else {
      content = columns;
    }

    return (
      <div className="ReservationRequests">
        <Header />
        <div className="row">
          <div className="col-10">
            <br/>
            <h3>Appointment Requests</h3>
            <div className="cards">
              <br />
              <ReactTable 
                      data={requests}
                      columns={content}
                      filterable
                      defaultPageSize = {5}
                      pageSizeOptions = {[5, 10, 15]}
                      noDataText={"You don't have any appointment reservation requests."}
                    />
            </div>
          </div>
          <div className="col-2 res-req-image">

          </div>
        </div>
        <Footer />

      </div>
    );
  }
}

export default ReservationRequests;