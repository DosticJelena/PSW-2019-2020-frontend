import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Modal from '../../UI/Modal/Modal';
import './Ordinations.css';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import OrdinationCalendar from '../Ordinations/OrdinationCalendar/OrdinationCalendar';
import NewOrdination from './NewOrdination/NewOrdination';
import UpdateOrdination from './UpdateOrdination/UpdateOrdination';
import { NotificationManager } from 'react-notifications';

class Ordinations extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ordinations: [],
      modalVisible: false,
      newModalVisible: false,
      deleteModalVisible: false,
      updateModalHandler: false,
      ordinationId: 0,
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

  deleteModalHandler = (ordId) => {
    this.getAppointmentsForOrdination(ordId);
    this.setState({ deleteModalVisible: true, ordinationId: ordId });
    this.props.history.push("/ordinations/" + ordId);
  }

  updateModalHandler = (ordId) => {
    this.setState({ ordinationId: ordId, updateModalHandler: true });
    this.props.history.push("/ordinations/" + ordId);
  }

  modalClosedHandler = () => {
    this.setState({ modalVisible: false, newModalVisible: false, deleteModalVisible: false, updateModalHandler: false });
    this.props.history.push("/ordinations");
  }

  renderDates = () => {

    let appointments = [...this.state.appointments];

    for (var i = 0; i < appointments.length; i++) {
      appointments[i].start = new Date(appointments[i].start);
      appointments[i].end = new Date(appointments[i].end);

      this.setState({ appointments });
    }
  }

  isDisabled(ordId) {
    for (var i = 0; i < this.state.ordinations.length; i++) {
      if (this.state.ordinations[i].id == ordId) {
        if (this.state.ordinations[i].appointments.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  deleteOrdination = (ordId) => {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.put('https://psw-isa-tim3.herokuapp.com/api/ordination/delete/' + ordId, {
      responseType: 'json'
    })
      .then(response => {
        NotificationManager.success('You have deleted ordination succesfully!', 'Success!', 4000)
        window.location.reload();
      })
      .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))
  }

  getAppointmentsForOrdination = (ordId) => {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('https://psw-isa-tim3.herokuapp.com/api/appointment/get-ordination-appointments/' + ordId, {
      responseType: 'json'
    })
      .then(response => {
        console.log(response);
        this.setState({ appointments: response.data });
        this.renderDates();
        console.log(this.state);
      })
      .catch((error) => console.log(error))
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

    this.modalClosedHandler();

    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("https://psw-isa-tim3.herokuapp.com/auth/getMyUser")
      .then(response => {
        this.setState({
          clinicAdmin: response.data.id
        })
      })
      .then(() => {
        axios.get("https://psw-isa-tim3.herokuapp.com/api/clinic-admin-clinic/" + this.state.clinicAdmin)
          .then(response => {
            this.setState({
              id: response.data
            })
          })
          .then(() => {

            axios.get("https://psw-isa-tim3.herokuapp.com/api/ordination/clinic-ordinations/" + this.state.id)
              .then(response => {
                let tmpArray = []
                for (var i = 0; i < response.data.length; i++) {
                  tmpArray.push(response.data[i])
                }
                console.log(tmpArray)
                this.setState({
                  ordinations: tmpArray
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
        filterable: false,
        id: 'id',
        accessor: d => d.id
      }, {
        Header: 'Number',
        accessor: 'number'
      }, {
        Header: 'Type',
        accessor: 'type'
      }, {
        Header: '',
        Cell: row => (
          <div>
            <button className="calendar-ord btn" onClick={() => this.modalHandler(row.original.id)}>See calendar</button>
          </div>
        ),
        width: 150,
        filterable: false
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
            <button className="delete-ord btn" onClick={() => this.deleteModalHandler(row.original.id)}>Delete</button>
          </div>
        ),
        filterable: false
      }]

    var deleteContent;
    if (this.state.appointments.length == 0) {
      deleteContent = (<div><h4>Are you sure you want to delete this ordination?</h4>
        <hr />
        <button className="calendar-ord btn" onClick={() => this.deleteOrdination(window.location.pathname.split("/")[2])}>Yes</button></div>)
    } else {
      deleteContent = (<h4>This ordination has reserved appointments. It cannot be deleted.</h4>)
    }

    return (
      <div className="Ordinations">
        <Modal show={this.state.modalVisible} modalClosed={this.modalClosedHandler}>
          <OrdinationCalendar appointments={this.state.appointments} />
        </Modal>
        <Modal show={this.state.updateModalHandler} modalClosed={this.modalClosedHandler}>
          <UpdateOrdination ordinations={this.state.ordinations} ordinationId={this.state.ordinationId} reload={this.state.updateModalHandler} />
        </Modal>
        <Modal show={this.state.newModalVisible} modalClosed={this.modalClosedHandler}>
          <NewOrdination />
        </Modal>
        <Modal show={this.state.deleteModalVisible} modalClosed={this.modalClosedHandler}>
          {deleteContent}
        </Modal>
        <Header />
        <div className="row">
          <div className="col-10">
            <br />
            <h3>Ordination List</h3>
            <button className="new-ordination btn" onClick={() => this.newModalHandler()}>+ New Ordination</button>
            <div className='patients rtable'>
              <ReactTable
                data={this.state.ordinations}
                columns={columns}
                filterable
                onFilteredChange={this.handleOnFilterInputChange}
                defaultPageSize={6}
                pageSizeOptions={[6, 10, 15]}
                defaultFilterMethod={this.filterCaseInsensitive}
              />
            </div>
          </div>
          <div className="col-2 ordination-list-image">

          </div>
        </div>

        <Footer />

      </div>
    );
  }
}

export default withRouter(Ordinations);