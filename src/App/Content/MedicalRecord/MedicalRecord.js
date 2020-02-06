import React from 'react';
import { Link } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MedicalRecord.css';
import axios from 'axios';
import ReactTable from "react-table";
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Modal from '../../UI/Modal/Modal';
import MedicalHistory from './AppointmentHistory/MedicalHistory/MedicalHistory';


class MedicalRecord extends React.Component{
    constructor(props){
        super(props); 
     
        this.state={
           height:'',
           weight:'',
           bloodType:'',
           allergies:[],
           history:[],
           filtered:[],
           id:'',
           reportModalHandler:false,
           futureCancelApp:[],
           futureFixApp:[]
        }
    }

    reportModalHandler=(id)=>{
      this.setState({ id: id, reportModalHandler: true });
      this.props.history.push("/medical-record/" + id);
     }

    modalClosedHandler = () => {
      this.setState({  reportModalHandler: false });
      this.props.history.push("/medical-record");
    }

    handleChange(e) {
      this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
    }

    componentDidMount(){

      this.modalClosedHandler();

      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get("http://localhost:8080/auth/getMyUser")  
        .then(response => {
            console.log(response.data.id);
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("http://localhost:8080/api/medicalRecords/"+response.data.id)  
              .then(response => {
                  console.log(response.data);
                  this.setState({
                      height: response.data.height,
                      weight: response.data.weight,
                      bloodType: response.data.bloodType,
                      allergies: response.data.allergies,
                  })

              })
              .catch((error) => console.log(error))

              var token = localStorage.getItem('token');
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              axios.get('http://localhost:8080/api/appointment/history/' +response.data.id).then(response => {

                      let tmpArray = []
                      for (var i = 0; i < response.data.length; i++) {
                          tmpArray.push(response.data[i])
                      }        
                      this.setState({
                          history: tmpArray
                      })
              })
              .catch((error) => console.log(error))  


              var token = localStorage.getItem('token');
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              axios.get('http://localhost:8080/api/appointment/future-cancel-appointments/' +response.data.id).then(response => {

                      console.log(response.data);
                      let tmpArray = []
                      for (var i = 0; i < response.data.length; i++) {
                          tmpArray.push(response.data[i])
                      }        
                      this.setState({
                          futureCancelApp: tmpArray
                      })
              })
              .catch((error) => console.log(error))  


              var token = localStorage.getItem('token');
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              axios.get('http://localhost:8080/api/appointment/future-fix-appointments/' +response.data.id).then(response => {

                      let tmpArray = []
                      for (var i = 0; i < response.data.length; i++) {
                          tmpArray.push(response.data[i])
                      }        
                      this.setState({
                          futureFixApp: tmpArray
                      })
              })
              .catch((error) => console.log(error))  
          })
        .catch((error) => console.log(error))
           
      }

     onFilteredChangeCustom = (value, accessor) => {
      let filtered = this.state.filtered;
      let insertNewFilter = 1;
  
      if (filtered.length) {
        filtered.forEach((filter, i) => {
          if (filter["id"] === accessor) {
            if (value === "" || !value.length) filtered.splice(i, 1);
            else filter["value"] = value;
  
            insertNewFilter = 0;
          }
        });
      }
      if (insertNewFilter) {
          filtered.push({ id: accessor, value: value });
        }
    
        this.setState({ filtered: filtered });
   };

   cancelApp = (id) =>{
    console.log(id);
    axios.put("http://localhost:8080/api/appointment/cancel-Patient/" + id).then(response => {
          const {futureCancelApp} = this.state;
          futureCancelApp.pop(response.data);
          this.setState({futureCancelApp});
        }).then((resp) => console.log("Canceled."))
}

  
    render(){


        return(

            <div className="MedicalRecord">
              <Modal show={this.state.reportModalHandler} modalClosed={this.modalClosedHandler}>
                <MedicalHistory id={this.state.id} reload={this.state.reportModalHandler} />
              </Modal>
                <Header/>
                <div>               
                <div className="row">
                  <div className="col-6">
                      <h3>Medical record</h3>
                      <hr/>
                      <div className="form-group">
                        <label><strong>Height:</strong> {this.state.height} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Body weight:</strong> {this.state.weight} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Blood type:</strong> {this.state.bloodType} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Allergies:</strong> {this.state.allergies} </label>
                      </div>
                  </div>
                </div>

                <div className="col-7">
                <h3>Previous appointments and medical history</h3>
                <hr/>
                </div>
                <div id='history-appointments-table' className="history-appointments-table rtable">     
                <ReactTable 
                        data={this.state.history}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, column, value) => {
                          this.onFilteredChangeCustom(value, column.id || column.accessor);
                        }}
                        defaultFilterMethod={(filter, row, column) => {
                            const id = filter.pivotId || filter.id;
                            if (typeof filter.value === "object") {
                              return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                            } else {
                              return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                            }
                          }}
                        columns={[{
                                    Header: 'Report id',
                                    accessor: 'id',
                                },{
                                    Header: 'Start time',
                                    accessor: 'startTime',
                                },
                                {
                                    Header: 'End time',
                                    accessor: 'endTime',
                                },
                                {
                                    Header: 'Doctors name',
                                    accessor: 'doctorFirstName',
                                    width:150
                                }, 
                                {
                                    Header: 'Doctors last name',
                                    accessor: 'doctorLastName',
                                    width:200
                                },
                                {
                                    Header: 'Appointment type',
                                    accessor: 'type',
                                },
                                {
                                    Header: 'Specialization',
                                    accessor: 'specialization',
                                },
                                {
                                  Header: 'Medical history',
                                  Cell: row => (                        
                                    <div>
                                      <Button onClick={() => this.reportModalHandler(row.original.id)}>See details</Button>
                                    </div>
                                    ),
                                    filterable:false
                                }
                        ]}
                        defaultPageSize = {10}
                    />
                </div>

                <div className="col-6">
                    <h3>Scheduled appointments</h3>
                    <hr/>
                </div>
                <div className="rtable">
                <ReactTable 
                        data={this.state.futureFixApp}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, column, value) => {
                          this.onFilteredChangeCustom(value, column.id || column.accessor);
                        }}
                        defaultFilterMethod={(filter, row, column) => {
                            const id = filter.pivotId || filter.id;
                            if (typeof filter.value === "object") {
                              return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                            } else {
                              return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                            }
                          }}
                        columns={[
                                  {
                                    Header: 'Appointment id',
                                    accessor: 'id',
                                },
                                {
                                    Header: 'Start time',
                                    accessor: 'startTime',
                                },
                                {
                                    Header: 'End time',
                                    accessor: 'endTime',
                                },
                                {
                                    Header: 'Doctors',
                                    accessor: 'doctors',
                                    width:150
                                }, 
                                {
                                    Header: 'Price',
                                    accessor: 'price',
                                    width:200
                                },
                                {
                                    Header: 'Appointment type',
                                    accessor: 'type',
                                },
                                {
                                    Header: 'Ordination',
                                    accessor: 'ordination',
                                },
                        ]}
                        defaultPageSize = {5}
                    />
                  </div>  
                

                <div className="col-6">
                    <h3>Cancelable appointments</h3>
                    <hr/>
                </div>
                <div className="rtable">
                <ReactTable 
                        data={this.state.futureCancelApp}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, column, value) => {
                          this.onFilteredChangeCustom(value, column.id || column.accessor);
                        }}
                        defaultFilterMethod={(filter, row, column) => {
                            const id = filter.pivotId || filter.id;
                            if (typeof filter.value === "object") {
                              return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                            } else {
                              return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                            }
                          }}
                        columns={[ {
                                    Header: 'Appointment id',
                                    accessor: 'id',
                                },{
                                    Header: 'Start time',
                                    accessor: 'startTime',
                                },
                                {
                                    Header: 'End time',
                                    accessor: 'endTime',
                                },
                                {
                                    Header: 'Doctors',
                                    accessor: 'doctors',
                                    width:150
                                }, 
                                {
                                    Header: 'Price',
                                    accessor: 'price',
                                    width:200
                                },
                                {
                                    Header: 'Appointment type',
                                    accessor: 'type',
                                },
                                {
                                    Header: 'Ordination',
                                    accessor: 'ordination',
                                },
                                {
                                  Header: '',
                                  Cell: row => (                        
                                    <div>
                                        <Button onClick={() => this.cancelApp(row.original.id)}>Cancel</Button>
                                    </div>
                                    ),
                                    filterable:false
                                }
                        ]}
                        defaultPageSize = {5}
                    />
                  </div>  
                </div>
                <Footer/>
            </div>

        );
    }
}

export default withRouter(MedicalRecord);