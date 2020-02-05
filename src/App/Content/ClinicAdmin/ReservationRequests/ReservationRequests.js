import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import ReactTable from "react-table";
import Modal from '../../../UI/Modal/Modal';
import CreateAppointment from '../CreateAppointment/CreateAppointment';
import { withRouter } from 'react-router-dom';

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
        startDateTime: '',
        endDateTime: '',
        type: ''
      }],
      role: '',
      appReqId: '',
      modalVisible: false
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
    this.modalClosedHandler();
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://localhost:8080/auth/getMyUser")
      .then(response => {
        console.log(response);
        this.setState({
          clinicAdmin: response.data.id,
          role: response.data.authorities[0].name
        })
        console.log(this.state.appointmentRequests[0]);
      }).then(() => {

        if (this.state.role == "ROLE_CLINIC_ADMIN") {

          axios.get("http://localhost:8080/api/clinic-app-requests-ca")
            .then(response => {
              console.log(response);
              this.setState({
                appointmentRequests: response.data
              })
            })
            .catch((error) => console.log(error));

        } else if (this.state.role == "ROLE_DOCTOR") {

          axios.get("http://localhost:8080/api/clinic-app-requests-doc")
            .then(response => {
              console.log(response);
              this.setState({
                appointmentRequests: response.data
              })
            })
            .catch((error) => console.log(error));
        }

      })

      .catch((error) => console.log(error))
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  modalHandler = (appId) => {
    this.setState({ modalVisible: true, appReqId: appId });
    this.props.history.push("/reservation-requests/" + appId);
  }

  modalClosedHandler = () => {
    this.setState({ modalVisible: false });
    this.props.history.push("/reservation-requests");
  }

  render() {

    let requests = this.state.appointmentRequests;
    const columns = [
      {
        Header: 'Id',
        id: 'id',
        accessor: d => d.id,
        style: {
          textAlign: "center",
          fontSize: 20
        },
        width: 50,
        filterable: false
      }, {
        Header: 'Doctor',
        accessor: 'doctorFN',
        style: {
          textAlign: "center",
          fontSize: "medium"
        },
        width: 90
      }, {
        Header: '',
        accessor: 'doctorLN',
        style: {
          textAlign: "center",
          fontSize: "medium"
        },
        width: 90
      }, {
        Header: 'Start',
        accessor: 'startDateTime',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'End',
        accessor: 'endDateTime',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'Type',
        accessor: 'typeEnum',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: '',
        Cell: row => (
          <div>
            <button className="btn primary btn-app-req" onClick={() => this.modalHandler(row.original.id)}>Create appointment</button>
          </div>
        ),
        filterable: false,
        style: {
          textAlign: "center"
        }
      }]

    const columns_doctor = [
      {
        Header: 'Id',
        id: 'id',
        accessor: d => d.id,
        style: {
          textAlign: "center",
          fontSize: 20
        },
        filterable: false,
        width: 50
      }, {
        Header: 'Patient',
        accessor: 'patientFN',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: '',
        accessor: 'patientLN',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'Start',
        accessor: 'startDateTime',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'End',
        accessor: 'endDateTime',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'Type',
        accessor: 'typeEnum',
        style: {
          textAlign: "center",
          fontSize: "medium"
        }
      }, {
        Header: 'Specialization',
        accessor: 'typeSpec',
        style: {
          textAlign: "center",
          fontSize: "medium"
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
        <Modal show={this.state.modalVisible} modalClosed={this.modalClosedHandler}>
          <CreateAppointment appReqId={this.state.appReqId} reload={this.state.modalVisible} />
        </Modal>
        <Header />
        <div className="row">
          <div className="col-10">
            <br />
            <h3>Appointment Requests</h3>
            <div className="cards">
              <br />
              <ReactTable
                data={requests}
                columns={content}
                filterable
                defaultPageSize={5}
                pageSizeOptions={[5, 10, 15]}
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

export default withRouter(ReservationRequests);