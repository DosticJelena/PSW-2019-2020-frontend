import React from 'react';
import { Link,withRouter } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ClinicPage.css';
import axios from 'axios';
import ReactTable from "react-table";

class ClinicPage extends React.Component {

    constructor(props){
        super(props); 
    
        this.state = {
            id: '',
            name: '',
            avg: '',
            doctors: [],
            ordinations: [{
                number: '',
                type: ''
            }],
            address: '',
            city: '',
            description: ''
        }
    }
    
    componentDidMount(){
        const id = window.location.pathname.split("/")[2];
        axios.get("http://localhost:8080/api/clinic/"+ id).then(response => {
                console.log(response.data);
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    address: response.data.address,
                    city: response.data.city,
                    description: response.data.description
                })
            }).then(() => {
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

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/api/ordination/get-all")  
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
        
    }

    visitPredefExam = () =>{
        const id=window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/predefined-examinations/'+id);
    }

    visitDoctors= () =>{
        const id=window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/doctors-list/'+id);
    }

    render() {

        const columns1=[
            {
              Header:'Id',
              id: 'id',
              accessor: d => d.id,
              width: 50,
              filterable: false
          },{
            Header:'Number',
            accessor: 'number'
          },{
            Header:'Type',
            accessor: 'type'
          }]

            const columns2=[
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
                  width: 70
              }]

        var path = "/business-report/" + this.state.id;
        return(
            
            <div className="Clinic-page">
                <Header/>

                <div className="clinic-page-title">Clinic page</div>
                <h3>{this.state.name}</h3>

                <div className="btn-predefined-exam">
                 <button className="btn link-btn-patient predefined-btn" onClick={() => this.visitPredefExam()}>Predefined examinations</button>
               </div>

                <div className="btn-predefined-exam">
                 <button className="btn link-btn-patient predefined-btn" onClick={() => this.visitDoctors()}>Doctors of the clinic</button>
               </div>

                <div className="row">
                    <div className="col-10">
                        <div className="row cp-header">
                            <br/>
                            <h3>{this.state.name}</h3>
                            <h5><em>{this.state.address}, {this.state.city}</em></h5>
                            <hr/>
                            <h5>Description: <p>{this.state.description}</p></h5>
                            <Link to={path} className="btn update-clinic predefined-btn">Update Clinic info</Link>
                            <div className="btn-predefined-exam">
                                <Link to="/predefined-examinations" className="btn link-btn-patient predefined-btn">Predefined examinations</Link>
                                <Link to={path} className="btn link-btn-patient predefined-btn">Business Report</Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <h4>Ordinations</h4>
                                <div className='ord-table'>
                                    <ReactTable 
                                    data={this.state.ordinations}
                                    columns={columns1}
                                    filterable
                                    onFilteredChange = {this.handleOnFilterInputChange}
                                    defaultPageSize = {5}
                                    pageSizeOptions = {[5, 10, 15]}
                                    />
                                </div>
                            </div>
                            <div className="col-8">
                                <h4>Doctors</h4>
                                <div className='doc-table'>
                                    <ReactTable 
                                    data={this.state.doctors}
                                    columns={columns2}
                                    filterable
                                    onFilteredChange = {this.handleOnFilterInputChange}
                                    defaultPageSize = {5}
                                    pageSizeOptions = {[5, 10, 15]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 clinic-page-image">
            
                    </div>
                </div>
                <Footer/>
            </div>

            );
        }
    }
    
export default withRouter (ClinicPage);