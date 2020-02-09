import React from 'react';
import "react-table/react-table.css";
import ReactTable from "react-table";
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './NonCCAdmin.css'

const AdminSuccess = withReactContent(Swal)

class NonCCAdmins extends React.Component{

      constructor () {
          super();

          this.state = {
              tableData: [
                {
                  id: '',
                  email: '',
                  firstName: '',
                  lastName: '',
                  address: '',
                  city: '',
                  country: '',
                  phoneNumber: ''
                }
            ],
          };
      }

      componentDidMount () {
          axios.get('http://localhost:8080/api/cc-admin/all-non-ccadmin-accounts', {
              responseType: 'json'
          }).then(response => {
              this.setState({ tableData: response.data });
          });
      }

      assignCCAdmin = (id) =>{
        axios.post("http://localhost:8080/api/cc-admin/assign-cc-admin/" + id).then(response => {
          const {tableData} = this.state;
          tableData.pop(response.data);
          this.setState({tableData});
        }).then((resp) => this.onSuccessHandler(resp))
        console.log('This is the id: ' + id);
      }

      onSuccessHandler(resp){
        AdminSuccess.fire({
            title: "Clinic center admin assigned succesfully!",
            text: "",
            type: "success",
        })
      }

      render() {
        let { tableData } = this.state;
        return (
          <div className="AssignCCAdmin">
          <Header/>
          <div className='nonccadmins rtable'>
          <ReactTable 
          data={tableData}
          columns={[{
                      Header: 'Id',
                      accessor: 'id'
                    },{
                      Header: 'Email',
                      accessor: 'email'
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
                              <button onClick={() => this.assignCCAdmin(row.original.id)}>Assign</button>
                          </div>
                      )
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

export default NonCCAdmins