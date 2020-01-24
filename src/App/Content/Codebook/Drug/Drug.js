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

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : 'silver',
    width                 : '30em'
  }
};

class Drug extends React.Component{

      constructor (props) {
          super(props);
          this.handleChange = this.handleChange.bind(this);
          this.addNewDrug = this.addNewDrug.bind(this);
          this.fetchData = this.fetchData.bind(this);

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
              name: '',
              description: '',
              ingredient: '',
              modalIsOpen: false,
              editModalIsOpen: false,
              loading: false
          };
          this.openModal = this.openModal.bind(this);
          this.openEditModal = this.openEditModal.bind(this);
          this.closeModal = this.closeModal.bind(this);
          this.closeEditModal = this.closeEditModal.bind(this);
      }

      openModal() {
        this.setState({modalIsOpen: true});
      }

      openEditModal(p_id, p_name, p_description, p_ingredient) {
        const editModal = {...this.state.editModal}
        editModal.id = p_id;
        editModal.name = p_name;
        editModal.description = p_description;
        editModal.ingredient = p_ingredient;
        this.setState({editModal})
        this.setState({editModalIsOpen: true});
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
      }

      fetchData(state, instance) {
        this.setState({ loading: true });
        axios.get('http://localhost:8080/api/cc-admin/get-all-drugs', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data, loading: false });
          });
      }

      addNewDrug =  event => {
        event.preventDefault();
        this.setState({modalIsOpen: false});
        console.log(this.state);
        axios.post("http://localhost:8080/api/cc-admin/add-drug/", {
          name: this.state.name,
          description: this.state.description,
          ingredient: this.state.ingredient
      }).then(response => {
          NotificationManager.success('Drug successfuly added!', '', 3000);
          this.fetchData(this.state)
        })
        .catch((error)=> {
          NotificationManager.error('Wrong input.', 'Error', 3000);
        }) 
      }

      deleteDrug = (id) =>{
        axios.put("http://localhost:8080/api/cc-admin/delete-drug/" + id).then(response => {

          this.fetchData(this.state);

        }).then(response => {
          NotificationManager.success('Drug successfuly deleted', '', 3000);
          ;})
          .catch( (error) => {
            NotificationManager.error('This drug is currently useb by at least one patient. You can not delete it', '', 3000);
          })
      }

      handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
        console.log(this.state)
      }

      editDrug =  (id) => {
        axios.put("http://localhost:8080/api/cc-admin/update-drug/" + id, {
          name: this.state.name,
          description: this.state.description,
          ingredient: this.state.ingredient
      }).then(response => {
          NotificationManager.success('Drug successfuly updated', '', 3000);
          this.fetchData(this.state)
        })
      }

      render() {
        let { tableData } = this.state;
        return (
          <div className="AssignCCAdmin">
          <Header/>
          <div className='newDrug'>
          <Modal
          style={customStyles}
          isOpen={this.state.editModalIsOpen}
          onRequestClose={this.closeEditModal}
          contentLabel="Example Modal"
          >
          <button onClick={this.closeEditModal} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
          </button>
          <form>
                    <div class="form-group">
                      <label htmlFor="name" class="col-form-label">Name:</label>
                      <input type="text" 
                             className="form-control form-control-sm"
                             id="name"
                             name="name"
                             defaultValue={this.state.editModal.name}
                             onChange={this.handleChange}
                             placeholder="Enter Name"
                             required/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="ingredient" class="col-form-label">Ingredient:</label>
                      <input type="text" 
                             className="form-control form-control-sm"
                             id="ingredient"
                             name="ingredient"
                             defaultValue={this.state.editModal.ingredient}
                             onChange={this.handleChange}
                             placeholder="Enter Name"
                             required/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <textarea 
                             rows="7"
                             type="text" 
                             className="form-control form-control-sm"
                             id="description"
                             name="description"
                             defaultValue={this.state.editModal.description}
                             onChange={this.handleChange}
                             placeholder="Enter Description"
                             required/>
                    </div>
                    <div class="modal-footer">
                      <Button onClick={() => this.editDrug(this.state.editModal.id)}>Save</Button>
            </div>
          </form>
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
          <form onSubmit={this.addNewDrug}>
          <div class="form-group">
                      <label htmlFor="name" class="col-form-label">Name:</label>
                      <input type="text" 
                             className="form-control form-control-sm"
                             id="name"
                             name="name"
                             onChange={this.handleChange}
                             placeholder="Enter Name"
                             required/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="ingredient" class="col-form-label">Ingredient:</label>
                      <input type="text" 
                             className="form-control form-control-sm"
                             id="ingredient"
                             name="ingredient"
                             onChange={this.handleChange}
                             placeholder="Enter Ingredient"
                             required/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="description" class="col-form-label">Description:</label>
                      <textarea 
                             rows="7"
                             type="text" 
                             className="form-control form-control-sm"
                             id="description"
                             name="description"
                             onChange={this.handleChange}
                             placeholder="Enter Description"
                             required/>
                    </div>
                    <div class="modal-footer">
                      <Button type="submit">Save</Button>
                  </div>
          </form>
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
                                <button className="primary btn" onClick={() => this.deleteDrug(row.original.id)}>Delete</button>
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