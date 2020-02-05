import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Modal from '../../UI/Modal/Modal';
import './Doctors.css';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import NewDoctor from './NewDoctor/NewDoctor';

class Doctors extends React.Component{
   
    constructor(props){
        super(props);
    
        this.state = {
            doctors: [],
            modalVisible: false,
            newModalVisible: false,
            deleteModalVisible: false,
            deleteModalVisible: false,
            doctorId: 0, 
            appointments: [],
            clinicAdmin: ''
        }
      }

      modalHandler = (ordId) => {
        this.setState({modalVisible: true, ordinationId: ordId});
        this.getAppointmentsForOrdination(ordId);
      }

      newModalHandler = () => {
        this.setState({newModalVisible: true});
      }

      deleteModalHandler = (docId) => {
        this.setState({deleteModalVisible: true, doctorId: docId});
      }

      updateModalHandler = (docId) => {
        this.setState({updateModalHandler: true, doctorId: docId});
      }

      modalClosedHandler = () => {
        this.setState({modalVisible: false, newModalVisible: false, deleteModalVisible: false, updateModalHandler: false});
      }

      renderDates = () =>{

        let appointments = [...this.state.appointments];
    
        for (var i = 0; i < appointments.length; i++){
          appointments[i].start = new Date(appointments[i].start);
          appointments[i].end = new Date(appointments[i].end);
    
          this.setState({appointments});
        }
      }

      getAppointmentsForOrdination = (ordId) => {
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  
        axios.get('http://localhost:8080/api/appointment/get-ordination-appointments/' + ordId, {
          responseType: 'json'
        })
              .then(response => {
                console.log(response);
                this.setState({appointments: response.data});
                this.renderDates();
                console.log(this.state);
        })
        .catch((error) => console.log(error))
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

                  axios.get("http://localhost:8080/api/clinic-doctors/" + this.state.id)  
                  .then(response => {
                      let tmpArray = []
                      for (var i = 0; i < response.data.length; i++) {
                          tmpArray.push(response.data[i])
                      }
            
                      this.setState({
                          doctors: tmpArray
                      })
                  })
                  .catch((error) => console.log(error))

              }).catch((error) => console.log(error))
              
          }).catch((error) => console.log(error))

      }
    
      render() {
    
        const columns=[
            {
              Header:'Id',
              id: 'id',
              accessor: d => d.id,
              width: 50,
              filterable: false
          },{
            Header:'First Name',
            accessor: 'firstName'
          },{
            Header:'Last Name',
            accessor: 'lastName'
          },{
              Header: 'Phone Number',
              accessor: 'phoneNumber'
          },{
              Header: 'Address',
              accessor: 'address'
          },{
              Header: 'Stars',
              accessor: 'stars',
              width: 100
          },{
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
        <div className="Doctors">
          <Modal show={this.state.newModalVisible} modalClosed={this.modalClosedHandler}>
              <NewDoctor/>
          </Modal>
          <Modal show={this.state.updateModalHandler} modalClosed={this.modalClosedHandler}>
              <h4>Update ordination</h4>
          </Modal>
          <Modal show={this.state.deleteModalVisible} modalClosed={this.modalClosedHandler}>
              <h4>Are you sure you want to delete this doctor?</h4>
              <button className="btn">Yes</button>
          </Modal>
          <Header/>
          <div className="row">
            <div className="col-10">
              <br/>
              <h3>Doctor List</h3>
              <button className="new-doctor btn" onClick={() => this.newModalHandler()}>+ New Doctor</button>
              <div className='patients rtable'>
                <ReactTable 
                  data={this.state.doctors}
                  columns={columns}
                  filterable
                  onFilteredChange = {this.handleOnFilterInputChange}
                  defaultPageSize = {6}
                  pageSizeOptions = {[6, 10, 15]}
                />
              </div>
            </div>
            <div className="col-2 doctors-list-image">
    
            </div>
          </div>
           
          <Footer/>
    
        </div>
      );
      }
    }

export default withRouter (Doctors);