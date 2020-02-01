import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Modal from '../../../UI/Modal/Modal';
import axios from 'axios'
import { withRouter } from 'react-router-dom';

class AbsenceRequests extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ordinations: [],
            modalVisible: false,
            newModalVisible: false,
            deleteModalVisible: false,
            updateModalHandler: false,
            ordinationId: 0,
            appointments: [],
            clinicAdmin: ''
        }
    }

    modalHandler = (ordId) => {
        this.setState({ modalVisible: true, ordinationId: ordId });
        this.getAppointmentsForOrdination(ordId);
    }

    newModalHandler = () => {
        this.setState({ newModalVisible: true });
    }

    deleteModalHandler = (ordId) => {
        this.setState({ deleteModalVisible: true, ordinationId: ordId });
    }

    updateModalHandler = (ordId) => {
        this.setState({ ordinationId: ordId, updateModalHandler: true });
    }

    modalClosedHandler = () => {
        this.setState({ modalVisible: false, newModalVisible: false, deleteModalVisible: false, updateModalHandler: false });
    }

    renderDates = () => {

        let appointments = [...this.state.appointments];

        for (var i = 0; i < appointments.length; i++) {
            appointments[i].start = new Date(appointments[i].start);
            appointments[i].end = new Date(appointments[i].end);

            this.setState({ appointments });
        }
    }

    isDisabled(ordId) {
        for (var i = 0; i < this.state.ordinations.length; i++) {
            if (this.state.ordinations[i].id == ordId) {
                if (this.state.ordinations[i].appointments.length == 0) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    componentDidMount() {

        this.modalClosedHandler();

        axios.get("http://localhost:8080/api/absence/nurse-requests")
            .then(response => {
                let tmpArray = []
                for (var i = 0; i < response.data.length; i++) {
                    tmpArray.push(response.data[i])
                }
                console.log(tmpArray)
                this.setState({
                    ordinations: tmpArray
                })
            })
            .catch((error) => console.log(error))


    }

    render() {

        const columns = [
            {
                Header: 'Id',
                filterable: false,
                id: 'id',
                accessor: d => d.id
            }, {
                Header: 'Comment',
                accessor: 'comment'
            }, {
                Header: 'Start',
                accessor: 'startDateTime'
            }, {
                Header: 'End',
                accessor: 'endDateTime'
            }, {
                Header: 'Type',
                accessor: 'paidTimeOffType'
            },{
                Header: '',
                Cell: row => (
                    <div>
                        <button className="calendar-ord btn" onClick={() => this.modalHandler(row.original.id)}>Accept</button>
                    </div>
                ),
                width: 150,
                filterable: false
            }, {
                Header: '',
                Cell: row => (
                    <div>
                        <button className="delete-ord btn" onClick={() => this.updateModalHandler(row.original.id)}>Deny</button>
                    </div>
                ),
                width: 100,
                filterable: false
            }]

        return (
            <div className="AbsenceRequests">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <br />
                        <h3>Absence Requests</h3>
                        <div className='patients rtable'>
                            <ReactTable
                                data={this.state.ordinations}
                                columns={columns}
                                filterable
                                onFilteredChange={this.handleOnFilterInputChange}
                                defaultPageSize={6}
                                pageSizeOptions={[6, 10, 15]}
                            />
                        </div>
                    </div>
                    <div className="col-2 ordination-list-image">

                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default withRouter(AbsenceRequests);