import React from 'react';
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ReactTable from "react-table";
import './AppointmentHistory.css'
import axios from 'axios';
import { withRouter } from 'react-router';
import StarRatingComponent from 'react-star-rating-component';
import RateClinic from './RateClinic/RateClinic';
import RateDoctor from './RateDoctor/RateDoctor';
import Modal from '../../../UI/Modal/Modal';
import { Button } from 'react-bootstrap';

class AppointmentHistory extends React.Component{


    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            history:[{
                startTime:'',
                endTime:'',
                doctorFirstName:'',
                doctorLastName:'',
                type:'',
                specialization:'',
                doctorId:'',
                clinicId:'',
                clinicName:''
            }],
            filtered:[],
            ratingDoctors:'',
            ratingClinics:'',
            rateModalHandler:false,
            rateDoctorModalHandler:false,
            clinicId:'',
            doctorId:''
        }
    }

    rateModalHandler = (cId) => {
      this.setState({ clinicId: cId, rateModalHandler: true });
      this.props.history.push("/appointment-history/" + cId);
    }

    rateDoctorModalHandler = (dId) => {
      this.setState({ doctorId: dId, rateDoctorModalHandler: true });
      this.props.history.push("/appointment-history/" + dId);
    }

    modalClosedHandler = () => {
      this.setState({ rateModalHandler: false, rateDoctorModalHandler: false });
      this.props.history.push("/appointment-history");
    }
  
    componentDidMount () {    

      this.modalClosedHandler();

        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("https://psw-isa-tim3.herokuapp.com/auth/getMyUser")  
          .then(response => {

            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('https://psw-isa-tim3.herokuapp.com/api/appointment/history/' +response.data.id).then(response => {

                    let tmpArray = []
                    for (var i = 0; i < response.data.length; i++) {
                        tmpArray.push(response.data[i])
                    }        
                    this.setState({
                        history: tmpArray
                    })
            })
            .catch((error) => console.log(error))    
          })
         .catch((error) => console.log(error))
      }

      handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
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

     onStarClickDoctor(nextValue, prevValue, name) {
      this.setState({ratingDoctors: nextValue});
    }

    onStarClickClinic(nextValue, prevValue, name) {
      this.setState({ratingClinics: nextValue});
    }

    render(){

        return(
           
            <div className="AppointmentHistory">
               <Modal show={this.state.rateModalHandler} modalClosed={this.modalClosedHandler}>
                <RateClinic clinicId={this.state.clinicId} reload={this.state.rateModalHandler} />
              </Modal>
              <Modal show={this.state.rateDoctorModalHandler} modalClosed={this.modalClosedHandler}>
                <RateDoctor doctorId={this.state.doctorId} reload={this.state.rateDoctorModalHandler} />
              </Modal>
                <Header/>
                    <div className='appointment-history history-table'>
                     <div className="appointment-history-title">History of appointments</div>
                      <br/>
              
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
                                }, 
                                {
                                    Header: 'Doctors last name',
                                    accessor: 'doctorLastName',
                                },
                                {
                                    Header: 'Appointment type',
                                    accessor: 'type',
                                },
                                {
                                    Header: 'Specialization',
                                    accessor: 'specialization',
                                }
                        ]}
                        defaultPageSize = {10}
                    />

                </div>
                <br/>
                <div className="col-6">
                    <h3>Rating time!</h3>
                    <hr/>
                </div>
                <div className="row">
                  <div className="col h-table1">
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
                        columns={[
                                  {
                                    Header: 'Id',
                                    accessor: 'doctorId',
                                }, 
                                {
                                    Header: 'Doctors name',
                                    accessor: 'doctorFirstName',
                                }, 
                                {
                                    Header: 'Doctors last name',
                                    accessor: 'doctorLastName',
                                },
                                {
                                    Header: 'Specialization',
                                    accessor: 'specialization',
                                },
                                {Header:'Rate doctor',
                                Cell: row => (                        
                                  <div>
                              <Button onClick={() => this.rateDoctorModalHandler(row.original.doctorId)}>Rate</Button>
                                  </div>
                                  ),
                              }
                        ]}
                        defaultPageSize = {10}
                    />

                  </div>
                  <div className="col h-table2">

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
                        columns={[
                                {
                                    Header: 'Id',
                                    accessor: 'clinicId',
                                }, 
                                {
                                    Header: 'Clinic',
                                    accessor: 'clinicName',
                                }, 
                                {
                                  Header:'Rate clinic',
                                  Cell: row => (                        
                                    <div>
                                <Button onClick={() => this.rateModalHandler(row.original.clinicId)}>Rate</Button>
                                    </div>
                                    ),
                                }
                        ]}
                        defaultPageSize = {10}
                    />
                  </div>
                </div>

                <Footer/>
            </div>
        );
    }

}

export default withRouter(AppointmentHistory);