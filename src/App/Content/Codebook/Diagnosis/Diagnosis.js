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
          this.handleKeyUp = this.handleKeyUp.bind(this);
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
              formErrors: {
                name: '',
                description: ''
              },
              modalIsOpen: false,
              editModalIsOpen: false,
              loading: false,
              id: '',
              name: '',
              description: '',
              disabled: true
          };
          this.openModal = this.openModal.bind(this);
          this.openEditModal = this.openEditModal.bind(this);
          this.closeModal = this.closeModal.bind(this);
          this.closeEditModal = this.closeEditModal.bind(this);

      }

      openModal() {
        this.setState({modalIsOpen: true});
        this.setState({disabled: true});
      }

      openEditModal(p_id, p_name, p_description) {

        this.setState({id: p_id})
        this.setState({name: p_name})
        this.setState({description: p_description})
        this.setState({editModalIsOpen: true});
        this.setState({disabled: true});
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
        this.setState({disabled: true});
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
        this.setState({disabled: true});
      }

      fetchData(state, instance) {
        this.setState({ loading: true });
        axios.get('https://deployment-isa.herokuapp.com/api/cc-admin/get-all-diagnosis', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data, loading: false});
          });
      }

      addNewDiagnosis =  (name, description) => {
        this.setState({modalIsOpen: false});
        console.log(this.state);
        axios.post("https://deployment-isa.herokuapp.com/api/cc-admin/add-diagnosis/", {
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
        axios.put("https://deployment-isa.herokuapp.com/api/cc-admin/delete-diagnosis/" + id).then(response => {
         
          this.fetchData(this.state)

        }).then(response => {
          NotificationManager.success('Diagnosis successfuly deleted', '', 3000);
          ;})
          .catch((error) => {
            NotificationManager.error('This diagnosis is currently assigned to at least one patient. You can not delete it', '', 3000);
          })
      
      }

      handleKeyUp = e => {
        var empty = true;
    
        Object.keys(this.state.formErrors).forEach(e => 
          {if(this.state.formErrors[e] != ""){
            empty = false;
          }
        });
    
        if (!empty){
            this.setState({disabled: true});
            console.log('disabled');
        }
    
        else{
            if (this.state.name != "" && this.state.description != ""){
              this.setState({disabled: false});
              console.log('enabled');
            }
            else {
              this.setState({disabled: true});
              console.log('disabled');
            }
        }
      }

      handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "name":
                formErrors.name =
                value.length < 3 ? "minimum 3 characaters required" : "";
            break;
          case "description":
                formErrors.description =
                value.length < 5 ? "minimum 5 characaters required" : "";
            break;
          default:
            break;
        }
        this.setState({ formErrors, [name]: value}, () => console.log(this.state));
      }

      editDiagnosis =  (id) => {
        this.setState({editModalIsOpen: false});
        axios.put("https://deployment-isa.herokuapp.com/api/cc-admin/update-diagnosis/" + id, {
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
        const { formErrors } = this.state;
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
                             className={formErrors.name.length > 0 ? "error" : null}
                             id="name"
                             name="name"
                             defaultValue={this.state.name}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Name"
                             variant="outlined"
                             style={{ width: 550 }}
                             required/>
                        {formErrors.name.length > 0 && (
                          <span className="errorMessage">{formErrors.name}</span>
                        )}                    </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField 
                             className={formErrors.description.length > 0 ? "error" : null}
                             id="description"
                             name="description"
                             defaultValue={this.state.description}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Description"
                             variant="outlined"
                             style={{ width: 550 }}
                             required/>
                        {formErrors.description.length > 0 && (
                          <span className="errorMessage">{formErrors.description}</span>
                        )}                    </div>
                    <hr/>
                    <div>
                      <Button disabled={this.state.disabled} onClick={() => this.editDiagnosis(this.state.id)}>Save</Button>
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
                             className={formErrors.name.length > 0 ? "error" : null}
                             id="name"
                             name="name"
                             style={{ width: 550 }}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Name"
                             variant="outlined"
                             required/>
                        {formErrors.name.length > 0 && (
                          <span className="errorMessage">{formErrors.name}</span>
                        )}                       </div>
                    <div>
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField
                             className={formErrors.description.length > 0 ? "error" : null}
                             style={{ width: 550 }}
                            id="outlined-multiline-flexible"
                             name="description"
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Description"
                             multiline
                            rows="5"
                            variant="outlined"
                            required/>
                            {formErrors.description.length > 0 && (
                              <span className="errorMessage">{formErrors.description}</span>
                            )}                       </div>
                    <hr/>
                    <div>
                      <Button disabled={this.state.disabled} onClick={() => this.addNewDiagnosis(this.state.name, this.state.description)}>Save</Button>
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