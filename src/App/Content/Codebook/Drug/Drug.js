import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import { Button} from 'react-bootstrap';
import './Drug.css'
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

class Drug extends React.Component{

      constructor (props) {
          super(props);
          this.handleChange = this.handleChange.bind(this);
          this.handleKeyUp = this.handleKeyUp.bind(this);
          this.addNewDrug = this.addNewDrug.bind(this);
          this.fetchData = this.fetchData.bind(this);
          this.openModal = this.openModal.bind(this);
          this.openEditModal = this.openEditModal.bind(this);
          this.closeModal = this.closeModal.bind(this);
          this.closeEditModal = this.closeEditModal.bind(this);

          this.state = {
              tableData: [
                {
                  id: '',
                  name: '',
                  description: '',
                  ingredient: ''
                }
              ],
              modal: {
                id: '',
                name: '',
                description: '',
                ingredient: ''
              },
              editModal: {
                id: '',
                name: '',
                description: '',
                ingredient: ''
              },
              formErrors: {
                name: '',
                description: '',
                ingredient: ''
              },
              id: '',
              name: '',
              description: '',
              ingredient: '',
              modalIsOpen: false,
              editModalIsOpen: false,
              loading: false,
              disabled: true
          };
      }

      openModal() {
        this.setState({modalIsOpen: true});
      }

      openEditModal(p_id, p_name, p_ingredient, p_description) {
        this.setState({id: p_id})
        this.setState({name: p_name})
        this.setState({ingredient: p_ingredient})
        this.setState({description: p_description})
        this.setState({editModalIsOpen: true});
        this.setState({disabled: true});
      }
     
      closeModal() {
        const modal = {...this.state.modal}
        modal.id = "";
        modal.name = "";
        modal.description = "";
        modal.ingredient = "";
        this.setState({modal})
        this.setState({
          name: "",
          description: "",
          ingredient: ""
        })
        this.setState({modalIsOpen: false});
        this.setState({disabled: true});
      }

      closeEditModal() {
        const editModal = {...this.state.editModal}
        editModal.id = "";
        editModal.name = "";
        editModal.description = "";
        editModal.ingredient = "";
        this.setState({editModal})
        this.setState({
          name: "",
          description: "",
          ingredient: ""
        })
        this.setState({editModalIsOpen: false});
        this.setState({disabled: true});
      }

      fetchData(state, instance) {
        this.setState({ loading: true });
        axios.get('https://deployment-isa.herokuapp.com/api/cc-admin/get-all-drugs', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data, loading: false });
          });
      }

      addNewDrug =  (name, ingredient, description) => {
        this.setState({modalIsOpen: false});
        console.log(this.state);
        axios.post("https://deployment-isa.herokuapp.com/api/cc-admin/add-drug/", {
          name: name,
          description: description,
          ingredient: ingredient
      }).then(response => {
          NotificationManager.success('Drug successfuly added!', '', 3000);
          this.fetchData(this.state)
        })
        .catch((error)=> {
          NotificationManager.error('Wrong input.', 'Error', 3000);
        }) 
      }

      deleteDrug = (id) =>{
        axios.put("https://deployment-isa.herokuapp.com/api/cc-admin/delete-drug/" + id).then(response => {

          this.fetchData(this.state);

        }).then(response => {
          NotificationManager.success('Drug successfuly deleted', '', 3000);
          ;})
          .catch( (error) => {
            NotificationManager.error('This drug is currently useb by at least one patient. You can not delete it', '', 3000);
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
            if (this.state.name != "" && this.state.description != "" && this.state.ingredient != ""){
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
                value.length < 10 ? "minimum 10 characaters required" : "";
            break;
          case "ingredient":
                formErrors.ingredient =
                value.length < 3 ? "minimum 3 characaters required" : "";
            break;
          default:
            break;
        }
        this.setState({ formErrors, [name]: value}, () => console.log(this.state));
      }

      editDrug =  (id) => {
        this.setState({editModalIsOpen: false});
        axios.put("https://deployment-isa.herokuapp.com/api/cc-admin/update-drug/" + id, {
          name: this.state.name,
          description: this.state.description,
          ingredient: this.state.ingredient
      }).then(response => {
          NotificationManager.success('Drug successfuly updated', '', 3000);
          this.fetchData(this.state)
        })
      }

      render() {
        const { formErrors } = this.state;
        let { tableData } = this.state;
        return (
          <div className="AssignCCAdmin">
          <Header/>
          <div className='newDrug'>
          <Modal
          style={customStyles}
          isOpen={this.state.editModalIsOpen}
          onRequestClose={this.closeEditModal}
          >
                  <div class="form-group">
                      <label htmlFor="name" class="col-form-label">Drug Name:</label>
                      <TextField
                             className={formErrors.name.length > 0 ? "error" : null}
                             id="outlined-multiline-flexible"
                             name="name"
                             style={{ width: 550 }}
                             defaultValue={this.state.name}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Name"
                             variant="outlined"
                             required/>
                        {formErrors.name.length > 0 && (
                          <span className="errorMessage">{formErrors.name}</span>
                        )}
                    </div>
                    <div class="form-group">
                      <label htmlFor="ingredient" class="col-form-label">Ingredient:</label>
                      <TextField 
                             className={formErrors.ingredient.length > 0 ? "error" : null}
                             style={{ width: 550 }}
                             id="outlined-multiline-flexible"
                             name="ingredient"
                             defaultValue={this.state.ingredient}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Ingredient"
                            variant="outlined"
                             required/>
                        {formErrors.ingredient.length > 0 && (
                          <span className="errorMessage">{formErrors.ingredient}</span>
                        )}
                   </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField 
                             className={formErrors.description.length > 0 ? "error" : null}
                             style={{ width: 550 }}
                             id="outlined-multiline-flexible"
                             name="description"
                             defaultValue={this.state.description}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Description"
                             multiline
                            rows="5"
                            variant="outlined"
                             required/>
                        {formErrors.description.length > 0 && (
                          <span className="errorMessage">{formErrors.description}</span>
                        )}
                    </div>
                    <hr/>
                    <div>
                      <Button disabled={this.state.disabled} onClick={() => this.editDrug(this.state.id)}>Save</Button>
                    </div>
        </Modal>

        <button className="btn primary jej" onClick={this.openModal}>Add new Drug</button>
        <Modal
          style={customStyles}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          <button onClick={this.closeModal} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
          </button>
          <div class="form-group">
                      <label htmlFor="name" class="col-form-label">Drug Name:</label>
                      <TextField
                             className={formErrors.name.length > 0 ? "error" : null}
                             id="outlined-multiline-flexible"
                             name="name"
                             value={this.state.name}
                             style={{ width: 550 }}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Name"
                             variant="outlined"
                             required/>
                        {formErrors.name.length > 0 && (
                          <span className="errorMessage">{formErrors.name}</span>
                        )}
                    </div>
                    <div class="form-group">
                      <label htmlFor="ingredient" class="col-form-label">Ingredient:</label>
                      <TextField 
                             className={formErrors.ingredient.length > 0 ? "error" : null}
                             style={{ width: 550 }}
                             id="outlined-multiline-flexible"
                             name="ingredient"
                             value={this.state.ingredient}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Ingredient"
                            variant="outlined"
                             required/>
                             {formErrors.ingredient.length > 0 && (
                          <span className="errorMessage">{formErrors.ingredient}</span>
                        )}
                    </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <TextField 
                             className={formErrors.description.length > 0 ? "error" : null}
                             style={{ width: 550 }}
                             id="outlined-multiline-flexible"
                             name="description"
                             value={this.state.description}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             placeholder="Enter Description"
                             multiline
                            rows="5"
                            variant="outlined"
                             required/>
                                 {formErrors.description.length > 0 && (
                          <span className="errorMessage">{formErrors.description}</span>)}
                    </div>
                    <hr/>
                    <div>
                      <Button disabled={this.state.disabled} onClick={() => this.addNewDrug(this.state.name, this.state.ingredient, this.state.description)}>Save</Button>
                  </div>
        </Modal>
          </div>
          <div className='nonccadmins rtable'>
          <ReactTable 
          data={tableData}
          loading={this.state.loading}
          onFetchData={this.fetchData} // Request new data when things change
          columns={[{
                      Header: 'Name',
                      accessor: 'name',
                      width: 150
                    },{
                      Header: 'Description',
                      //accessor: 'description',
                      Cell: e =><a onClick={this.handleClick}> {e.original.description} </a>
                    },
                    {
                      Header: 'Ingredient',
                      accessor: 'ingredient',
                      width: 175
                    },
                    {
                      Header: '',
                      Cell: row => (                        
                          <div>
                          <button className="btn primary" onClick={() => this.openEditModal(row.original.id, row.original.name, row.original.ingredient, row.original.description)}>Edit</button>
                        </div>
                      ),
                      width: 150
                    },
                    {
                        Header: '',
                        Cell: row => (
                            <div>
                                <button className="primary btn" onClick={() => {if (window.confirm('Are you sure you wish to delete this item?')) this.deleteDrug(row.original.id)}}>Delete</button>
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

export default Drug