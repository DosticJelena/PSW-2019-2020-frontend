import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import { Button} from 'react-bootstrap';
import './Diagnosis.css'
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : 'silver',
    width                 : '40em'
  }
};


class Diagnosis extends React.Component{

      constructor (props) {
          super(props);
          this.handleChange = this.handleChange.bind(this);
          this.handleEditChange = this.handleEditChange.bind(this);
          this.addNewDiagnosis = this.addNewDiagnosis.bind(this);
          this.fetchData = this.fetchData.bind(this);

          this.state = {
              tableData: [
                {
                  id: '',
                  name: '',
                  description: ''
                }
              ],
              modal: {
                id: '',
                name: '',
                description: ''
              },
              editModal: {
                id: '',
                name: '',
                description: ''
              },
              modalIsOpen: false,
              editModalIsOpen: false,
              loading: false,
              id: '',
              name: '',
              description: ''
          };
          this.openModal = this.openModal.bind(this);
          this.openEditModal = this.openEditModal.bind(this);
          this.closeModal = this.closeModal.bind(this);
          this.closeEditModal = this.closeEditModal.bind(this);

      }

      openModal() {
        this.setState({modalIsOpen: true});
      }

      openEditModal(p_id, p_name, p_description) {

        this.setState({id: p_id})
        this.setState({name: p_name})
        this.setState({description: p_description})
        this.setState({editModalIsOpen: true});
      }
     
      closeModal() {
        const modal = {...this.state.modal}
        modal.id = "";
        modal.name = "";
        modal.description = "";
        this.setState({modal})
        this.setState({
          name: "",
          description: ""
        })
        this.setState({modalIsOpen: false});
      }

      closeEditModal() {
        const editModal = {...this.state.editModal}
        editModal.id = "";
        editModal.name = "";
        editModal.description = "";
        this.setState({editModal})
        this.setState({
          name: "",
          description: ""
        })
        this.setState({editModalIsOpen: false});
      }

      fetchData(state, instance) {
        this.setState({ loading: true });
        axios.get('https://psw-isa-tim3.herokuapp.com/api/cc-admin/get-all-diagnosis', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data, loading: false});
          });
      }

      addNewDiagnosis =  (name, description) => {
        this.setState({modalIsOpen: false});
        console.log(this.state);
        axios.post("https://psw-isa-tim3.herokuapp.com/api/cc-admin/add-diagnosis/", {
          name: name,
          description: description
        })
        .then(response => {
          this.fetchData(this.state)
          NotificationManager.success('Diagnosis successfuly added!', '', 3000);
        })
        .catch((error)=> {
          NotificationManager.error('Wrong input.', 'Error', 3000);
        }) 
      }

      
      deleteDiagnosis = (id) =>{
        axios.put("https://psw-isa-tim3.herokuapp.com/api/cc-admin/delete-diagnosis/" + id).then(response => {
         
          this.fetchData(this.state)

        }).then(response => {
          NotificationManager.success('Diagnosis successfuly deleted', '', 3000);
          ;})
          .catch((error) => {
            NotificationManager.error('This diagnosis is currently assigned to at least one patient. You can not delete it', '', 3000);
          })
      
      }

      handleChange(e) {
        e.preventDefault();

        this.setState({...this.state, [e.target.name]: e.target.value});
        console.log(this.state)
      }

      handleEditChange(e) {
        e.preventDefault();

        this.setState({...this.state, [e.target.name]: e.target.value});
        console.log(this.state)
      }

      editDiagnosis =  (id) => {
        this.setState({editModalIsOpen: false});
        axios.put("https://psw-isa-tim3.herokuapp.com/api/cc-admin/update-diagnosis/" + id, {
          name: this.state.name,
          description: this.state.description
      }).then(response => {

          this.fetchData(this.state)
          NotificationManager.success('Diagnosis successfuly updated', '', 3000);
        })
        .catch((error) => {
          NotificationManager.error('Server error. Please try again', '', 3000);
        })
      }

      render() {
        let { tableData } = this.state;
        return (
          <div className="AssignCCAdmin">
          <Header/>
          <div>
        <Modal
          style={customStyles}
          isOpen={this.state.editModalIsOpen}
          onRequestClose={this.closeEditModal}
          contentLabel="Example Modal"
        >
          <button onClick={this.closeEditModal} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
          </button>
                    <div class="form-group">
                      <label htmlFor="name" class="col-form-label">Name:</label>
                      <TextField 
                             id="name"
                             name="name"
                             defaultValue={this.state.name}
                             onChange={this.handleEditChange}
                             placeholder="Enter Name"
                             variant="outlined"
                             style={{ width: 550 }}
                             required/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField 
                      
                             id="description"
                             name="description"
                             defaultValue={this.state.description}
                             onChange={this.handleEditChange}
                             placeholder="Enter Description"
                             variant="outlined"
                             style={{ width: 550 }}
                             required/>
                    </div>
                    <hr/>
                    <div>
                      <Button onClick={() => this.editDiagnosis(this.state.id)}>Save</Button>
                    </div>
        </Modal>

        <button className="btn primary jej" onClick={this.openModal}>Add new Diagnosis</button>
        <Modal
          style={customStyles}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          <div>
          <button onClick={this.closeModal} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
          </button>
                    <div>
                      <label htmlFor="name" class="col-form-label">Name:</label>
                      <TextField
                             id="name"
                             name="name"
                             style={{ width: 550 }}
                             onChange={this.handleChange}
                             placeholder="Enter Name"
                             variant="outlined"
                             required/>
                    </div>
                    <div>
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField 
                            style={{ width: 550 }}
                            id="outlined-multiline-flexible"
                             name="description"
                             onChange={this.handleChange}
                             placeholder="Enter Description"
                             multiline
                            rows="5"
                            variant="outlined"
                             required/>
                    </div>
                    <hr/>
                    <div>
                      <Button onClick={() => this.addNewDiagnosis(this.state.name, this.state.description)}>>Save</Button>
                    </div>
            </div>
        </Modal>
      </div>
          <div className='newDrug'>
          </div>
          <div className='nonccadmins rtable'>
          <ReactTable 
          data={tableData}
          loading={this.state.loading}
          onFetchData={this.fetchData} // Request new data when things change
          columns={[{
                      Header: 'Name',
                      accessor: 'name',
                      width: 300
                    },{
                      Header: 'Description',
                      accessor: 'description',
                      width: 475
                    },
                    {
                      Header: '',
                      Cell: row => (                        
                        <div>
                          <button className="btn primary" onClick={() => this.openEditModal(row.original.id, row.original.name, row.original.description)}>Edit</button>
                        </div>
                      ),
                      width: 150
                    },
                    {
                        Header: '',
                        Cell: row => (
                            <div>
                                <button className="primary btn" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteDiagnosis(row.original.id) } }>Delete</button>
                            </div>
                        ),                      
                        width: 125

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

export default Diagnosis