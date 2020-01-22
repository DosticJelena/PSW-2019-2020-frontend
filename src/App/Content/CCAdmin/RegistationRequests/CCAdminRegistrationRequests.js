import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';

class CCAdminRegistrationRequests extends React.Component{
      constructor () {
          super();
          this.handleChange = this.handleChange.bind(this);
          this.handleOpenModal = this.handleOpenModal.bind(this);
          this.handleCloseModal = this.handleCloseModal.bind(this);
          this.fetchData = this.fetchData.bind(this);

          this.state = {
              loading: true,
              tableData: [
                {
                  email: '',
                  firstName: '',
                  lastName: '',
                  address: '',
                  city: '',
                  country: '',
                  phoneNumber: ''
                }
                ],
                showModal: false,
                message: ""
          };

      }

      handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
        console.log(this.state)
      }

      handleOpenModal () {
        this.setState({ showModal: true });
      }
      
      handleCloseModal () {
        this.setState({ showModal: false });
      }

      fetchData(state, instance) {
        this.setState({ loading: true });
        axios.get('http://localhost:8080/api/cc-admin/all-registration-requests', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data, loading: false});
          });
      }

      accept = (id) =>{
        console.log(id)
        axios.put("http://localhost:8080/api/cc-admin/send-verification-email/" + id).then(response => {

          this.fetchData(this.state)

        }).then((resp) => {NotificationManager.success('Patient registration request has been sucessfully approved. \n Confirmation email has been sent', '', 3000);}) 
      }

      reject = (id) =>{
        if (this.state.message != ""){
          axios.put("http://localhost:8080/api/cc-admin/reject-registration-request/" + id, this.state.message).then(response => {
            
          this.fetchData(this.state)

          }).then((resp) => NotificationManager.success('Patient registration request has been sucessfully rejected. Rejection email has been sent to patient', '', 3000))
          }
        else{
            NotificationManager.error('Wrong input.', '', 3000)
          }
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
                      Header: 'Email',
                      accessor: 'email',
                      width: 200
                    },{
                      Header: 'First Name',
                      accessor: 'firstName'
                    },{
                      Header: 'Last Name',
                      accessor: 'lastName'
                    },
                    {
                      Header: 'City',
                      accessor: 'city'
                    },
                    {
                      Header: 'Country',
                      accessor: 'country'
                    },
                    {
                      Header: '',
                      Cell: row => (
                          <div>
                              <button className="primary btn" onClick={() => this.accept(row.original.id)}>Accept</button>
                          </div>
                      ),
                      width: 100

                    },
                    {
                        Header: '',
                        Cell: row => (
                            <div id="row">
                                <button className="primary btn" onClick={() => this.reject(row.original.id)}>Reject</button>
                            </div>
                        ),
                        width: 100

                      },
                      {
                        Header: 'Reason',
                        Cell: row => (
                            <div>
                                <input type="text" 
                                className="form-control form-control-sm"
                                id="message"
                                name="message"
                                //onChange={this.handleChange}
                                placeholder="Reason"/>
                            </div>
                        ),
                        width: 250
  
                      }
          ]}
          defaultPageSize = {10}
          pageSizeOptions = {[5, 10, 15]}
          />
          </div>
           <Footer/>
           </div>
        )
      }
    }

export default CCAdminRegistrationRequests