import React from 'react';
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ReactTable from "react-table";
import './AppointmentHistory.css'
import axios from 'axios';
import { withRouter } from 'react-router';

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
                specialization:''
            }],
            filtered:[]
        }
    }


    componentDidMount () {    
    
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/auth/getMyUser")  
          .then(response => {

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

    render(){

        return(
           
            <div className="AppointmentHistory">
                <Header/>
                    <div className='appointment-history rtable'>
                     <div className="appointment-history-title">History of appointments</div>
              
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
                <Footer/>
            </div>
        );
    }

}

export default AppointmentHistory;