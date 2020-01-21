import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Ordinations.css';
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Ordinations extends React.Component{
   
    constructor(props){
        super(props);
    
        this.state = {
            ordinations: []
        }
    
        this.cancel = '';
      }
    
      componentDidMount() {
        var token = localStorage.getItem('token');
        axios.get("http://localhost:8080/api/ordinations")  
          .then(response => {
              let tmpArray = []
              for (var i = 0; i < response.data.length; i++) {
                  tmpArray.push(response.data[i])
              }
    
              this.setState({
                  ordinations: tmpArray
              })
          })
        .catch((error) => console.log(error))
      }
    
      render() {
    
        const columns=[
          {
            Header:'Id',
            id: 'id',
            accessor: d => d.id
        },{
          Header:'Number',
          accessor: 'number'
        },{
          Header:'Type',
          accessor: 'type'
        },{
            Header: '',
            Cell: row => (
                <div>
                   <button className="primary btn">See calendar</button>
                 </div>
            ),
            width: 200,
            filterable: false
          }]
    
      return (
        <div className="Ordinations">
          <Header/>
          <div className="row">
            <div className="col-10">
              <br/>
            <h3>Ordination List</h3>
              <div className='patients rtable'>
                <ReactTable 
                  data={this.state.ordinations}
                  columns={columns}
                  filterable
                  onFilteredChange = {this.handleOnFilterInputChange}
                  defaultPageSize = {6}
                  pageSizeOptions = {[6, 10, 15]}
                />
                </div>
            </div>
            <div className="col-2 ordination-list-image">
    
            </div>
          </div>
           
          <Footer/>
    
        </div>
      );
      }
    }

export default withRouter (Ordinations);