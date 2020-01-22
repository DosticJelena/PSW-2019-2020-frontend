import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import { Button} from 'react-bootstrap';

class Prescriptions extends React.Component{

    constructor (props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);

        this.state = {
            tableData: [{
                patient: '',
                drug: '',
                doctor: ''
            }],
            loading: true
        };
        this.fetchData = this.fetchData.bind(this);

    }

    /*componentDidMount () {
        this.setState({ loading: true });
        axios.get('http://localhost:8080/api/nurse/get-awaiting-prescriptions', {
            responseType: 'json'
        }).then(response => {
            console.log(response.data)
            this.setState({ 
                tableData: response.data,
                loading: false
             });

        });
    }*/

    fetchData(state, instance) {
      this.setState({ loading: true });
        axios.get('http://localhost:8080/api/nurse/get-awaiting-prescriptions', {
            responseType: 'json'
        }).then(response => {
            console.log(response.data)
            this.setState({ 
                tableData: response.data,
                loading: false
             });

        });
    }

    authenticate = (id) =>{
      axios.post("http://localhost:8080/api/nurse/authenticate/" + id).then(response => {
        this.fetchData(this.state)
      }).then(response => {
        NotificationManager.success('Diagnosis successfuly authenticated', '', 3000);
        ;})
    }

    render() {
      let { tableData } = this.state;
      return (
        <div className="AssignCCAdmin">
        <Header/>
        <div className='nonccadmins rtable'>
        <ReactTable 
        data={tableData}
        loading={this.state.loading}
        onFetchData={this.fetchData} // Request new data when things change
        columns={[{
                    Header: 'Patient',
                    accessor: 'patient',
                  },{
                    Header: 'Drug',
                    accessor: 'drug',
                  },
                  {
                    Header: 'Doctor',
                    accessor: 'doctor',
                  },
                  {
                    Header: '',
                    Cell: row => (                        
                      <div>
                        <button className="btn primary" onClick={() => this.authenticate(row.original.id)}>Authenticate</button>
                      </div>
                    ),
                  }
        ]}
        defaultPageSize = {10}
        />
        </div>
         <Footer/>
         </div>
      )
    }
  }

export default Prescriptions