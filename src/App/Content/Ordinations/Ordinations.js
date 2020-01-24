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

class Ordinations extends React.Component{
   
    constructor(props){
        super(props);
    
        this.state = {
            ordinations: [],
            modalVisible: false,
            newModalVisible: false,
            deleteModalVisible: false,
            ordinationId: 0, 
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

      deleteModalHandler = (ordId) => {
        this.setState({deleteModalVisible: true});
      }

      modalClosedHandler = () => {
        this.setState({modalVisible: false, newModalVisible: false, deleteModalVisible: false});
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

        this.modalClosedHandler();

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
                
                    axios.get("http://localhost:8080/api/ordination/clinic-ordinations/" + this.state.id)  
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
    
      render() {

        const columns=[
          {
            Header:'Id',
            filterable: false,
            id: 'id',
            accessor: d => d.id
        },{
          Header:'Number',
          accessor: 'number'
        },{
          Header:'Type',
          accessor: 'type'
        },{
            Header: '',
            Cell: row => (
                <div>
                   <button className="calendar-ord btn" onClick={() => this.modalHandler(row.original.id)}>See calendar</button>
                 </div>
            ),
            width: 150,
            filterable: false
          },{
            Header: '',
            width: 100,
            Cell: row => (
                <div>
                   <button className="delete-ord btn" onClick={() => this.deleteModalHandler(row.original.id)}>Delete</button>
                 </div>
            ),
            filterable: false
          }]
    
      return (
        <div className="Ordinations">
          <Modal show={this.state.modalVisible} modalClosed={this.modalClosedHandler}>
              <OrdinationCalendar appointments={this.state.appointments}/>
          </Modal>
          <Modal show={this.state.newModalVisible} modalClosed={this.modalClosedHandler}>
              <NewOrdination/>
          </Modal>
          <Modal show={this.state.deleteModalVisible} modalClosed={this.modalClosedHandler}>
              <h4>Are you sure you want to delete this ordination?</h4>
              <button className="btn">Yes</button>
          </Modal>
          <Header/>
          <div className="row">
            <div className="col-10">
              <br/>
              <h3>Ordination List</h3>
              <button className="new-ordination btn" onClick={() => this.newModalHandler()}>+ New Ordination</button>
              <div className='patients rtable'>
                <ReactTable 
                  data={this.state.ordinations}
                  columns={columns}
                  filterable
                  onFilteredChange = {this.handleOnFilterInputChange}
                  defaultPageSize = {6}
                  pageSizeOptions = {[6, 10, 15]}
                />
              </div>
            </div>
            <div className="col-2 ordination-list-image">
    
            </div>
          </div>
           
          <Footer/>
    
        </div>
      );
      }
    }

export default withRouter (Ordinations);