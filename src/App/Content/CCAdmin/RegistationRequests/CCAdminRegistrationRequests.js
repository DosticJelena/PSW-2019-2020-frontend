import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : 'silver'
  }
};

class CCAdminRegistrationRequests extends React.Component{
      constructor () {
          super();
          this.handleChange = this.handleChange.bind(this);
          this.handleOpenModal = this.handleOpenModal.bind(this);
          this.handleCloseModal = this.handleCloseModal.bind(this);
          this.fetchData = this.fetchData.bind(this);
          this.handleKeyUp = this.handleKeyUp.bind(this);

          this.state = {
              loading: true,
              disabled: true,
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
                message: "",
                formErrors: {
                  message: ""
                },
                id: ""
          };

      }

      handleKeyUp = e => {
          if (this.state.message != "" && this.state.formErrors.message == ""){
            this.setState({
              disabled: false
            })
          }
      }

      handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "message":
            formErrors.message =
                  value.length < 15 ? "minimum 15 characters required" : "";
                break;
          default:
            break;
        }
        this.setState({ formErrors, [name]: value}, () => console.log(this.state));
      }

      handleOpenModal = (id) =>{
        this.setState({ showModal: true });
        this.setState({ id: id});
      }
      
      handleCloseModal = () =>{
        this.setState({ showModal: false });
        this.setState({ id: ""});
        this.setState({ message: ""});

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
        axios.put("http://localhost:8080/api/cc-admin/send-verification-email/" + id).then(response => {

          this.fetchData(this.state)

        }).then((resp) => {NotificationManager.success('Patient registration request has been sucessfully approved. \n Confirmation email has been sent', '', 3000);}) 
      }

      reject = () =>{
        if (this.state.message != ""){
          axios.put("http://localhost:8080/api/cc-admin/reject-registration-request/" + this.state.id, this.state.message).then(response => {
            
          this.fetchData(this.state)

          }).then((resp) =>{ 
          NotificationManager.success('Patient registration request has been sucessfully rejected. Rejection email has been sent to patient', '', 3000);
          this.handleCloseModal();
          })
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
          <Modal 
            style={customStyles}
            isOpen={this.state.showModal} 
            onRequestClose={this.handleCloseModal}
          >
              <div className="message"><br></br>
                <h4 htmlFor="message">Comment: </h4>
              <TextField
                        value={this.state.message}
                        style={{ width: 550 }}
                        id="outlined-multiline-flexible"
                        name="message"
                        label="Add comment"
                        multiline
                        rows="10"
                        variant="outlined"
                        onChange={this.handleChange}
                        onKeyUp={this.handleKeyUp}

              />
              
              <div className="rejectButton">
                {this.state.formErrors.message.length > 0 && (
                  <span className="errorMessage">{this.state.formErrors.message}</span>
                )}
                <br></br>
                <Button disabled={this.state.disabled} variant="contained" className="submit" onClick={() => this.reject()}>Reject</Button>
              </div>
            </div>
          </Modal>
          <div className='nonccadmins rtable'>
          <ReactTable 
          data={tableData}
          loading={this.state.loading}
          onFetchData={this.fetchData} // Request new data when things change
          columns={[{
                      Header: 'Email',
                      accessor: 'email',
                      width: 200,
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
                                <button className="primary btn" onClick={() => this.handleOpenModal(row.original.id)}>Reject</button>
                            </div>
                        ),
                        width: 100

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