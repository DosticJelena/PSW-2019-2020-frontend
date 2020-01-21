import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './DoctorsList.css'
import Select from "react-select";
import axios from 'axios'
import { Link,withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap';


class DoctorsList extends React.Component{

    constructor(props){
        super(props);

        this.state={
            doctors:[],
            type:'',
            date:'',
            types:[]
        }

    }

    componentDidMount() { 
        const id = window.location.pathname.split("/")[2];
        axios.get("http://localhost:8080/api/doctors-list/"+id)  
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

        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/api/types")
          .then(response => {
            let tmpArray = []
            for (var i = 0; i < response.data.length; i++) {
              tmpArray.push(response.data[i])
            }

            this.setState({
              types: tmpArray
            })
          })
          .catch((error) => console.log(error))
      }

      render() {

        const columns=[
          {
            Header:'Id',
            id: 'id',
            accessor: d => d.id
        },{
          Header:'First Name',
          accessor: 'firstName'
        },{
          Header:'Last Name',
          accessor: 'lastName'
        },{
            Header:'Email Address',
            accessor: 'username'
        },{
          Header:'Address',
          accessor: 'address'
      },{
            Header:'City',
            accessor: 'city'
        },{
          Header:'Country',
          accessor: 'country'
      }]
    
      return (
        <div className="DoctorsList">
          <Header/>
          <div className="row">
            <div className="col-10">
              <br/>
            <h3>Doctors List</h3>
              <div className='doctors rtable'>
              <form onSubmit={this.FilterClinics}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <div className="col">
                          <label htmlFor="type">Type:</label>
                          <select required className="custom-select mr-sm-2" name="type" id="type" onChange={this.handleChange} >
                            <option defaultValue="0"></option>
                            {this.state.types.map((type, index) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}   
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                          <label htmlFor="date">Date:</label>
                          <input required type="date" className="form-control" name="date" id="date" placeholder="Choose date"
                            onChange={this.handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                      <br/>
                      <Button type="submit" className="btn">Filter</Button>
                    </div>
                </form>
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
            <div className="col-2 doctor-list-image">
    
            </div>
          </div>
           
          <Footer/>
    
        </div>
      );
      }
}

export default withRouter (DoctorsList);