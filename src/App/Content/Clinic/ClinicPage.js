import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ClinicPage.css';
import axios from 'axios';
import ReactTable from "react-table";

class ClinicPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            clinicId: '',
            name: '',
            avg: '',
            doctors: [],
            ordinations: [{
                number: '',
                type: ''
            }],
            address: '',
            city: '',
            description: '',
            clinicAdmin: '',
            role: ''
        }
    }

    componentDidMount() {

        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/auth/getMyUser")
            .then(response => {
                console.log(response.data);
                this.setState({
                    clinicAdmin: response.data.id,
                    role: response.data.authorities[0].name
                })
            })
            .then(() => {

                if (this.state.role == "ROLE_PATIENT") {
                    const id = window.location.pathname.split("/")[2];
                    axios.get("http://localhost:8080/api/clinic/" + id)
                        .then(response => {
                            console.log(response.data);
                            this.setState({
                                name: response.data.name,
                                address: response.data.address,
                                city: response.data.city,
                                description: response.data.description
                            })
                        }).catch((error) => console.log(error))
                } else if (this.state.role == "ROLE_CLINIC_ADMIN") {
                    axios.get("http://localhost:8080/api/clinic-admin-clinic/" + this.state.clinicAdmin)
                        .then(response => {
                            console.log(response.data);
                            this.setState({
                                clinicId: response.data
                            })
                        })
                        .then(() => {

                            axios.get("http://localhost:8080/api/clinic/" + this.state.clinicId)
                                .then(response => {
                                    console.log(response.data);
                                    this.setState({
                                        name: response.data.name,
                                        address: response.data.address,
                                        city: response.data.city,
                                        description: response.data.description
                                    })
                                }).catch((error) => console.log(error))

                            axios.get("http://localhost:8080/api/ordination/clinic-ordinations/" + this.state.clinicId)
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

                            axios.get("http://localhost:8080/api/clinic-doctors/" + this.state.clinicId)
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
                }



            }).catch((error) => console.log(error))

    }

    visitPredefExam = () => {
        const id = window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/predefined-examinations/' + id);
    }

    visitDoctors = () => {
        const id = window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/doctors-list/' + id);
    }

    render() {

        const columns1 = [
            {
                Header: 'Id',
                id: 'id',
                accessor: d => d.id,
                width: 50,
                filterable: false
            }, {
                Header: 'Number',
                accessor: 'number'
            }, {
                Header: 'Type',
                accessor: 'type'
            }]

        const columns2 = [
            {
                Header: 'Id',
                id: 'id',
                accessor: d => d.id,
                width: 50,
                filterable: false
            }, {
                Header: 'First Name',
                accessor: 'firstName'
            }, {
                Header: 'Last Name',
                accessor: 'lastName'
            }, {
                Header: 'Phone Number',
                accessor: 'phoneNumber'
            }, {
                Header: 'Address',
                accessor: 'address'
            }, {
                Header: 'Stars',
                accessor: 'stars',
                width: 70
            }]


        var busRepBtn;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            busRepBtn = (<Link to="/business-report" className="btn link-btn-patient predefined-btn">Business Report</Link>)
        }

        var updateBtn;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            updateBtn = (<Link to={{pathname: "/edit-clinic", state: {clinicId: this.state.clinicId}}} className="btn update-clinic predefined-btn">Update Clinic info</Link>)
        }

        var doctorsPatient;
        if (this.state.role === "ROLE_PATIENT") {
            const id = window.location.pathname.split("/")[2];
            var pathDoc = "/doctors-list/" + id;
            doctorsPatient = (<Link to={pathDoc} className="btn link-btn-patient predefined-btn">Doctors</Link>)
        }

        var predefExam;
        if (this.state.role === "ROLE_PATIENT") {
            const id = window.location.pathname.split("/")[2];
            var pathPredef = "/predefined-examinations/" + id;
            predefExam = (<Link to={pathPredef} className="btn link-btn-patient predefined-btn">Predefined examinations</Link>)
        } else if (this.state.role === "ROLE_CLINIC_ADMIN") {
            predefExam = (<Link to="/predefined-examinations" className="btn link-btn-patient predefined-btn">Predefined examinations</Link>)
        }

        var docTables;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            docTables = (
                <div className="row">
                    <div className="col-4">
                        <h4>Ordinations</h4>
                        <div className='ord-table'>
                            <ReactTable
                                data={this.state.ordinations}
                                columns={columns1}
                                filterable
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={5}
                                pageSizeOptions={[5, 10, 15]}
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
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={5}
                                pageSizeOptions={[5, 10, 15]}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        return (

            <div className="Clinic-page">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <div className="row cp-header">
                            <br />
                            <h3>{this.state.name}</h3>
                            <h5><em>{this.state.address}, {this.state.city}</em></h5>
                            <hr />
                            <h5>Description: <p>{this.state.description}</p></h5>
                            {updateBtn}
                            <div className="btn-predefined-exam">
                                {predefExam}
                                {busRepBtn}
                                {doctorsPatient}
                            </div>
                        </div>
                        {docTables}
                    </div>
                    <div className="col-2 clinic-page-image">

                    </div>
                </div>
                <Footer />
            </div>

        );
    }
}

export default withRouter(ClinicPage);