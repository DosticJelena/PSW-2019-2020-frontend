import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Modal from '../../../UI/Modal/Modal';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';


class AbsenceRequests extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nurses: [],
            doctors: [],
            acceptModalVisible: false,
            denyModalVisible: false,
            ordinationId: 0,
            appointments: [],
            clinicAdmin: '',
            denialComment: '',
            isNurseOrDoctor: '',
            id: '',
            start: '',
            end: '',
            email: '',
            name: ''
        }
    }

    sendDenialRequest = () => {
        if (this.state.denialComment == ""){
            NotificationManager.error('You have to enter denial comment.', 'Error!', 4000)
        } else {
            axios.post("https://deployment-isa.herokuapp.com/api/absence/" + this.state.isNurseOrDoctor + "-deny", {
                id: this.state.id,
                startDateTime: this.state.start,
                endDateTime: this.state.end,
                firstName: this.state.name,
                email: this.state.email,
                denialComment: this.state.denialComment
            })
                .then(() => {
                    NotificationManager.success('Succesfully denied!', 'Success!', 4000);
                    window.location.reload();
                })
                .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))
        }
        
    }

    DenyModalHandler = (isNurseOrDoc, id, start, end, name, email) => {
        this.setState({ denyModalVisible: true, isNurseOrDoctor: isNurseOrDoc, id: id, start: start, end: end, email: email, name: name });
    }

    AcceptDoc = (id, start, end, name, email) => {
        axios.post("https://deployment-isa.herokuapp.com/api/absence/doctor-accept", {
            id: id,
            startDateTime: start,
            endDateTime: end,
            firstName: name,
            email: email
        })
            .then(() => {
                NotificationManager.success('Succesfully accepted!', 'Success!', 4000);
                window.location.reload();
            })
            .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))
    }

    AcceptNur = (id, start, end, name, email) => {
        axios.post("https://deployment-isa.herokuapp.com/api/absence/nurse-accept", {
            id: id,
            startDateTime: start,
            endDateTime: end,
            firstName: name,
            email: email
        })
            .then(() => {
                NotificationManager.success('Succesfully accepted!', 'Success!', 4000);
                window.location.reload();
            })
            .catch((error) => NotificationManager.error('Something went wrong.', 'Error!', 4000))
    }

    modalClosedHandler = () => {
        this.setState({ acceptModalVisible: false, denyModalVisible: false });
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

    componentDidMount() {

        this.modalClosedHandler();

        axios.get("https://deployment-isa.herokuapp.com/api/absence/nurse-requests")
            .then(response => {
                let tmpArray = []
                for (var i = 0; i < response.data.length; i++) {
                    tmpArray.push(response.data[i])
                }
                console.log(tmpArray)
                this.setState({
                    nurses: tmpArray
                })
            })
            .catch((error) => console.log(error))

        axios.get("https://deployment-isa.herokuapp.com/api/absence/doctor-requests")
            .then(response => {
                let tmpArray = []
                for (var i = 0; i < response.data.length; i++) {
                    tmpArray.push(response.data[i])
                }
                console.log(tmpArray)
                this.setState({
                    doctors: tmpArray
                })
            })
            .catch((error) => console.log(error))


    }

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    render() {

        const columnsNurse = [
            {
                Header: 'Id',
                filterable: false,
                id: 'id',
                accessor: d => d.id,
                width: 30
            }, {
                Header: 'Comment',
                accessor: 'comment',
                style: { 'whiteSpace': 'unset', 'font-size': 'small' }
            }, {
                Header: 'Start',
                accessor: 'startDateTime',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'End',
                accessor: 'endDateTime',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'Type',
                accessor: 'paidTimeOffType',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'Email',
                accessor: 'email',
                style: { 'font-size': 'small' },
                width: 150
            }, {
                Header: 'First Name',
                accessor: 'firstName',
                style: { 'font-size': 'small' },
                width: 80
            }, {
                Header: 'Last Name',
                accessor: 'lastName',
                style: { 'font-size': 'small' },
                width: 80
            }, {
                Header: '',
                Cell: row => (
                    <div>
                        <button
                            className="calendar-ord btn"
                            style={{ fontSize: 'small' }}
                            onClick={() => this.AcceptNur(row.original.id, row.original.startDateTime, row.original.endDateTime, row.original.firstName, row.original.email)}>
                            Accept</button>
                    </div>
                ),
                style: { 'font-size': 'small' },
                width: 80,
                filterable: false
            }, {
                Header: '',
                Cell: row => (
                    <div>
                        <button
                            className="delete-ord btn"
                            style={{ fontSize: 'small' }}
                            onClick={() => this.DenyModalHandler("nurse", row.original.id, row.original.startDateTime, row.original.endDateTime, row.original.firstName, row.original.email)}>
                            Deny</button>
                    </div>
                ),
                width: 70,
                filterable: false
            }]

        const columnsDoctor = [
            {
                Header: 'Id',
                filterable: false,
                id: 'id',
                accessor: d => d.id,
                width: 30
            }, {
                Header: 'Comment',
                accessor: 'comment',
                style: { 'whiteSpace': 'unset', 'font-size': 'small' }
            }, {
                Header: 'Start',
                accessor: 'startDateTime',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'End',
                accessor: 'endDateTime',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'Type',
                accessor: 'paidTimeOffType',
                style: { 'font-size': 'small' },
                width: 110
            }, {
                Header: 'Email',
                accessor: 'email',
                style: { 'font-size': 'small' },
                width: 150
            }, {
                Header: 'First Name',
                accessor: 'firstName',
                style: { 'font-size': 'small' },
                width: 80
            }, {
                Header: 'Last Name',
                accessor: 'lastName',
                style: { 'font-size': 'small' },
                width: 80
            }, {
                Header: '',
                Cell: row => (
                    <div>
                        <button className="calendar-ord btn" style={{ fontSize: 'small' }}
                            onClick={() => this.AcceptDoc(row.original.id, row.original.startDateTime, row.original.endDateTime, row.original.firstName, row.original.email)}>
                            Accept</button>
                    </div>
                ),
                style: { 'font-size': 'small' },
                width: 80,
                filterable: false
            }, {
                Header: '',
                Cell: row => (
                    <div>
                        <button className="delete-ord btn" style={{ fontSize: 'small' }}
                            onClick={() => this.DenyModalHandler("doctor", row.original.id, row.original.startDateTime, row.original.endDateTime, row.original.firstName, row.original.email)}>
                            Deny</button>
                    </div>
                ),
                width: 70,
                filterable: false
            }]

        return (
            <div className="AbsenceRequests">
                <Modal show={this.state.acceptModalVisible} modalClosed={this.modalClosedHandler}>
                    <h3>Accept</h3>
                </Modal>
                <Modal show={this.state.denyModalVisible} modalClosed={this.modalClosedHandler}>
                            <h3>Deny</h3>
                            <hr />
                            <label>Denial comment:</label>
                            <input style={{marginLeft: "10px", borderRadius: "5px", width: "300px"}} type="text" name="denialComment" onChange={this.handleChange} />
                            <hr/>
                            <button className="btn calendar-ord" onClick={() => this.sendDenialRequest()}>Send</button>
                </Modal>
                <Header />
                <div className="row">
                    <div className="col-10">
                        <br />
                        <h3>Absence Requests</h3>
                        <hr />
                        <div className="row" style={{ marginLeft: '40px' }}>
                            <h4>Doctor Requests</h4>
                            <br/>
                            <div style={{ fontSize: 'small', textAlign: 'center'}}>
                                <ReactTable
                                    data={this.state.doctors}
                                    columns={columnsDoctor}
                                    filterable
                                    onFilteredChange={this.handleOnFilterInputChange}
                                    defaultPageSize={6}
                                    pageSizeOptions={[6, 10, 15]}
                                    defaultFilterMethod={this.filterCaseInsensitive}
                                />
                            </div>
                        </div>
                        <hr />
                        <div className="row" style={{ marginLeft: '40px', marginBottom: '30px' }}>
                            <h4>Nurse Requests</h4>
                            <div style={{ fontSize: 'small', textAlign: 'center'}}>
                                <ReactTable
                                    data={this.state.nurses}
                                    columns={columnsNurse}
                                    filterable
                                    onFilteredChange={this.handleOnFilterInputChange}
                                    defaultPageSize={6}
                                    pageSizeOptions={[6, 10, 15]}
                                    defaultFilterMethod={this.filterCaseInsensitive}
                                />
                            </div>
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