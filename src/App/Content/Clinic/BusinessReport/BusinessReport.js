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
            income: 0,
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
        axios.get("https://psw-isa-tim3.herokuapp.com/auth/getMyUser")
            .then(response => {
                console.log(response.data);
                this.setState({
                    clinicAdmin: response.data.id
                })
            })
            .then(() => {
                axios.get("https://psw-isa-tim3.herokuapp.com/api/clinic-admin-clinic/" + this.state.clinicAdmin)
                    .then(response => {
                        console.log(response.data);
                        this.setState({
                            id: response.data
                        })
                    })
                    .then(() => {

                        axios.get("https://psw-isa-tim3.herokuapp.com/api/clinic-doctors")
                            .then(response => {
                                console.log(response);
                                let tmpArray = []
                                for (var i = 0; i < response.data.length; i++) {
                                    tmpArray.push(response.data[i])
                                }

                                this.setState({
                                    doctors: tmpArray
                                })
                            })
                            .catch((error) => console.log(error))

                            axios.get("https://psw-isa-tim3.herokuapp.com/api/clinic-income")
                            .then(response => {
                                console.log(response);
                                
                                this.setState({
                                    income: response.data
                                })
                            })
                            .catch((error) => console.log(error))

                    }).catch((error) => console.log(error))

            }).catch((error) => console.log(error))

    }

    filterCaseInsensitive = (filter, row) => {
        const id = filter.pivotId || filter.id;
        return (
          row[id] !== undefined ?
            String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
          :
            true
        );
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
                        <h5>Average grade: {String(this.state.avg).substr(0,3)}</h5>
                        <h5>Income: {this.state.income}€ </h5>
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
                                defaultFilterMethod={this.filterCaseInsensitive}
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