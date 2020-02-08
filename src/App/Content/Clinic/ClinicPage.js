import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ClinicPage.css';
import axios from 'axios';
import ReactTable from "react-table";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

class ClinicPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            clinicId: '',
            name: '',
            avg: '',
            stars: '',
            doctors: [],
            ordinations: [{
                number: '',
                type: ''
            }],
            address: '',
            city: '',
            description: '',
            clinicAdmin: '',
            role: '',
            prices: [],
            lat: '45.254410',
            longi: '19.842550'
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
                                        description: response.data.description,
                                        stars: response.data.avg,
                                        lat: response.data.latitude,
                                        longi: response.data.longitude
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

                            axios.get("http://localhost:8080/api/get-appointment-prices")
                                .then(response => {
                                    let tmpArray = []
                                    for (var i = 0; i < response.data.length; i++) {
                                        tmpArray.push(response.data[i])
                                    }

                                    this.setState({
                                        prices: tmpArray
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
            },{
                Header: 'Specialization',
                accessor: 'specialization'
            },{
                Header: 'Stars',
                accessor: 'stars',
                width: 70
            }]

        const columns3 = [
            {
                Header: 'Id',
                id: 'id',
                accessor: d => d.id,
                width: 50,
                filterable: false
            }, {
                Header: 'Type',
                accessor: 'appointmentType'
            }, {
                Header: 'Price',
                accessor: 'appointmentPrice',
                width: 80
            }]


        var busRepBtn;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            busRepBtn = (<Link to={{ pathname: "/business-report", state: { clinicId: this.state.clinicId, stars: this.state.stars } }} className="btn link-btn-patient predefined-btn">Business Report</Link>)
        }

        var updateBtn;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            updateBtn = (<Link to={{ pathname: "/edit-clinic", state: { clinicId: this.state.clinicId } }} className="btn update-clinic predefined-btn">Update Clinic info</Link>)
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
            predefExam = (<Link id="predefinedButton" to={pathPredef} className="btn link-btn-patient predefined-btn">Predefined examinations</Link>)
        }

        var operationPrices = []
        var examPrices = []
        for (var i = 0; i < this.state.prices.length; i++) {
            if (this.state.prices[i].appointmentEnum == "OPERATION") {
                operationPrices.push(this.state.prices[i]);
            } else {
                examPrices.push(this.state.prices[i]);
            }
        }

        var docTables;
        if (this.state.role === "ROLE_CLINIC_ADMIN") {
            docTables = (<div>
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
                    <div className="col-4">
                        <h4>Price List (Operations)</h4>
                        <div className='ord-table'>
                            <ReactTable
                                data={operationPrices}
                                columns={columns3}
                                filterable
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={5}
                                pageSizeOptions={[5, 10, 15]}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <h4>Price List (Examinations)</h4>
                        <div className='ord-table'>
                            <ReactTable
                                data={examPrices}
                                columns={columns3}
                                filterable
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={5}
                                pageSizeOptions={[5, 10, 15]}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-7">
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
                    <div className="col-5">
                        <h4>Location</h4>
                        <Map
                            google={this.props.google}
                            zoom={15}
                            style={{ margin: "0 40px 80px 20px" }}
                            initialCenter={{
                                lat: parseFloat(this.state.lat),
                                lng: parseFloat(this.state.longi)
                            }}>

                            <Marker onClick={this.onMarkerClick}
                                name={'Belgrade,Serbia'} />

                            <InfoWindow onClose={this.onInfoWindowClose}>
                                <div>
                                    <h1>Adresa</h1>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                </div>
            </div>
            )
        }

        var patientMap;
        if (this.state.role === "ROLE_PATIENT"){
            patientMap = (<div className="col-6"><Map
                google={this.props.google}
                zoom={15}
                style={{ margin: "0 40px 80px 20px", height: "40vh" }}
                initialCenter={{
                    lat: parseFloat(this.state.lat),
                    lng: parseFloat(this.state.longi)
                }}>

                <Marker onClick={this.onMarkerClick}
                    name={'Belgrade,Serbia'} />

                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        <h1>Adresa</h1>
                    </div>
                </InfoWindow>
            </Map></div>)
        }

        return (

            <div className="Clinic-page">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <div className="row cp-header">
                            <div className="col-12">
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
                        </div>
                        {docTables}
                        {patientMap}
                    </div>
                    <div className="col-2 clinic-page-image">

                    </div>
                </div>
                <Footer />
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyB6m1BLxud0bteLf3Cxwzt5_q5DpIzMfdM")
})(withRouter(ClinicPage))