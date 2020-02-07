import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Modal from '../../UI/Modal/Modal';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import NewAppointmentType from './NewAppointmentType/NewAppointmentType';
import UpdateAppointmentType from './UpdateAppointmentType/UpdateAppointmentType';
import { NotificationManager } from 'react-notifications';

class AppointmentTypes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      types: [],
      modalVisible: false,
      newModalVisible: false,
      deleteModalVisible: false,
      deleteModalVisible: false,
      appTypeId: 0,
      appointments: [],
      clinicAdmin: ''
    }
  }

  modalHandler = (ordId) => {
    this.setState({ modalVisible: true, ordinationId: ordId });
    this.getAppointmentsForOrdination(ordId);
  }

  newModalHandler = () => {
    this.setState({ newModalVisible: true });
  }

  deleteModalHandler = (appTypeId) => {
    this.setState({ deleteModalVisible: true, appTypeId: appTypeId });
    this.props.history.push("/appointment-types/" + appTypeId);
  }

  deleteType = (typeId) => {

    axios.put("http://localhost:8080/api/app-type/delete/" + typeId, {
      responseType: 'json'
    })
      .then(response => {
        NotificationManager.success('You have deleted appointment type succesfully!', 'Success!', 4000)
        window.location.reload();
      })
      .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))
  }

  updateModalHandler = (appTypeId) => {
    this.setState({ updateModalHandler: true, appTypeId: appTypeId });
    this.props.history.push("/appointment-types/" + appTypeId);
  }

  modalClosedHandler = () => {
    this.setState({ modalVisible: false, newModalVisible: false, deleteModalVisible: false, updateModalHandler: false });
    this.props.history.push("/appointment-types");
  }

  filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        true
    );
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
              id: response.data
            })
          })
          .then(() => {

            axios.get("http://localhost:8080/api/types/" + this.state.id)
              .then(response => {
                this.setState({
                  types: response.data
                })
              })
              .catch((error) => console.log(error))

          }).catch((error) => console.log(error))

      }).catch((error) => console.log(error))

  }

  render() {

    const columns = [
      {
        Header: 'Id',
        id: 'id',
        accessor: d => d.id,
        width: 50,
        filterable: false
      }, {
        Header: 'Name',
        accessor: 'name'
      }, {
        Header: '',
        Cell: row => (
          <div>
            <button className="calendar-ord btn" onClick={() => this.updateModalHandler(row.original.id)}>Update</button>
          </div>
        ),
        width: 100,
        filterable: false
      }, {
        Header: '',
        width: 100,
        Cell: row => (
          <div>
            <button className="delete-doc btn" onClick={() => this.deleteModalHandler(row.original.id)}>Delete</button>
          </div>
        ),
        filterable: false
      }]

    return (
      <div className="AppointmentTypes">
        <Modal show={this.state.newModalVisible} modalClosed={this.modalClosedHandler}>
          <NewAppointmentType />
        </Modal>
        <Modal show={this.state.updateModalHandler} modalClosed={this.modalClosedHandler}>
          <UpdateAppointmentType types={this.state.types} ordinationId={this.state.ordinationId} reload={this.state.updateModalHandler} />
        </Modal>
        <Modal show={this.state.deleteModalVisible} modalClosed={this.modalClosedHandler}>
          <h4>Are you sure you want to delete this appointment type?</h4>
          <hr />
          <button className="calendar-ord btn" onClick={() => this.deleteType(window.location.pathname.split("/")[2])}>Yes</button>
        </Modal>
        <Header />
        <div className="row">
          <div className="col-10">
            <br />
            <h3>Appointment Types</h3>
            <button className="new-doctor btn" onClick={() => this.newModalHandler()}>+ New Appointment Type</button>
            <div className='patients rtable'>
              <ReactTable
                data={this.state.types}
                columns={columns}
                filterable
                onFilteredChange={this.handleOnFilterInputChange}
                defaultPageSize={6}
                pageSizeOptions={[6, 10, 15]}
                defaultFilterMethod={this.filterCaseInsensitive}
              />
            </div>
          </div>
          <div className="col-2 doctors-list-image">

          </div>
        </div>

        <Footer />

      </div>
    );
  }
}

export default withRouter(AppointmentTypes);