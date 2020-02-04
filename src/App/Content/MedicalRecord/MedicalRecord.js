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


class MedicalRecord extends React.Component{
    constructor(props){
        super(props); 
     
        this.state={
           height:'',
           weight:'',
           bloodType:'',
           allergies:[],
           history:[],
           filtered:[]
        }
    }

    componentDidMount(){
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
  
    render(){
        return(

            <div className="MedicalRecord">
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
                                  Header: 'Diagnosis',
                                  accessor: 'diagnosis',
                                  width:500
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

export default withRouter(MedicalRecord);