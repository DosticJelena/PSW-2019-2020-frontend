import React from 'react';
import { Link } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './BusinessReport.css';
import axios from 'axios';
import ReactTable from "react-table";

class BusinessReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            avg: '',
            doctors: [{
                id: '',
                firstName: '',
                lastName: '',
                stars: ''
            }]
        }
    }

    componentDidMount() {
        const { clinicId } = this.props.location.state;
        const avg = this.props.location.state.stars;
        this.setState({ id: clinicId, avg: avg });
        console.log(this.props.location);
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

        const columns = [
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
                Header: 'Email Address',
                accessor: 'username'
            }, {
                Header: 'Stars',
                accessor: 'stars',
                width: 70
            }]

        return (

            <div className="BusinessReport">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <br />
                        <h3>Business Report </h3>
                        <h3><em>{this.state.name}</em></h3>
                        <hr />
                        <h5>Average grade: {this.state.avg}</h5>
                        <h5>Monthly Income: {this.state.avg}</h5>
                        <h5>Graph: {this.state.avg}</h5>
                        <br />
                        <h4>Doctors</h4>
                        <div className='doc-table'>
                            <ReactTable
                                data={this.state.doctors}
                                columns={columns}
                                filterable
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={5}
                                pageSizeOptions={[5, 10, 15]}
                            />
                        </div>
                    </div>
                    <div className="col-2 busin-report-image">

                    </div>
                </div>

                <Footer />
            </div>

        );
    }
}

export default BusinessReport;