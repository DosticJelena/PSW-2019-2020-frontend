import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './DoctorsList.css'
import Select from "react-select";
import axios from 'axios'
import { Link,withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap';


class DoctorsList extends React.Component{

    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.FilterDoctors = this.FilterDoctors.bind(this);

        this.state={
            doctors:[{
              firstName:'',
              lastName:'',
              rating:'',
              freeTerms:[],
              free:[],
              selectedTime:''
            }],
            type:'',
            date:'',
            types:[],
            filtered:[],
            selected:null
        }

    }

    FilterDoctors = event => {
      event.preventDefault();
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(this.state.date);
      console.log(this.state.type);
      const clinicId=window.location.pathname.split("/")[2];
      axios.get("http://localhost:8080/api/filter-doctors/"+this.state.date+'/'+this.state.type+'/'+clinicId).then(response => {
        console.log(response.data);
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])

        }
        console.log(tmpArray);
        this.setState({
          doctors: tmpArray,
          filtered:1
        })
      }).catch((error) => console.log(error))
    }

    schedule= (row)=>{
      console.log(row);
    }


    allClinicDoctors = () =>{
      const id = window.location.pathname.split("/")[2];
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
      axios.get("http://localhost:8080/api/doctors-list/"+id) .then(response => {
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }

        this.setState({
          doctors: tmpArray,
          filtered:0
        })
      }) .catch((error) => console.log(error))
    }

    handleChange(e) {
      this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
    }

    onRowClick(e, t, rowInfo) {
      this.setState((oldState) => {
          let data = oldState.data.slice();
          let copy = Object.assign({},  data[rowInfo.index]);
  
          copy.selected = true;
          copy.FirstName = "selected";
          data[rowInfo.index] = copy;
  
          return {
              data: data,
          }
      })
  }

    componentDidMount() { 
        const id = window.location.pathname.split("/")[2];
        const type = window.location.pathname.split("/")[3];
        const date = window.location.pathname.split("/")[4];
        console.log(id);
        console.log( type);
        console.log( date);

        if(type!=null){

            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("http://localhost:8080/api/filter-doctors/"+date+'/'+type+'/'+id).then(response => {
              console.log(response.data);
              let tmpArray = []
              for (var i = 0; i < response.data.length; i++) {
                tmpArray.push(response.data[i])
      
              }
              console.log(tmpArray);
              this.setState({
                doctors: tmpArray,
                //filtered:1
              })
            }).catch((error) => console.log(error))
        }

        if(type==null){
        axios.get("http://localhost:8080/api/doctors-list/"+id)  
          .then(response => {
              let tmpArray = []
              for (var i = 0; i < response.data.length; i++) {
                  tmpArray.push(response.data[i])
              }
    
              this.setState({
                  doctors: tmpArray
              })
          })
        .catch((error) => console.log(error))

        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/api/types")
          .then(response => {
            let tmpArray = []
            for (var i = 0; i < response.data.length; i++) {
              tmpArray.push(response.data[i])
            }

            this.setState({
              types: tmpArray
            })
          })
          .catch((error) => console.log(error))
        }

       
      }

      render() {

        const columnsSpecialized=[
          {
            Header:'Id',
            id: 'id',
            accessor: d => d.id
        },{
          Header:'First Name',
          accessor: 'firstName'
        },{
          Header:'Last Name',
          accessor: 'lastName'
        },{
            Header:'Rating',
            accessor: 'rating'
        },{
          Header:'Avaiable appoint.',
          //accessor:'free'
          Cell: row => (
            <div>
                <select required className="custom-select mr-sm-2" name="freeTerms" id="freeTerms" onChange={this.handleChange} >
                  {row.original.free.map((fr, index) => (
                      <option key={fr} value={fr}>{fr}</option>
                    ))}   
                </select>
             </div>
        )
      }]

      const columnsAll=[
        {
          Header:'Id',
          id: 'id',
          accessor: d => d.id
      },{
        Header:'First Name',
        accessor: 'firstName'
      },{
        Header:'Last Name',
        accessor: 'lastName'
      },{
          Header:'Rating',
          accessor: 'rating'
      }]

      const columnsAllFiltered=[
        {
          Header:'Id',
          id: 'id',
          accessor: d => d.id
      },{
        Header:'First Name',
        accessor: 'firstName'
      },{
        Header:'Last Name',
        accessor: 'lastName'
      },{
          Header:'Rating',
          accessor: 'rating'
      },{
        Header:'Avaiable appoint.',
       // accessor:'free',
        Cell: row => (
             <div className="row">
              <div className="col">
                <label htmlFor="free"></label>
                <select required className="custom-select mr-sm-1" name="freeTerms" id="freeTerms" onChange={this.handleChange} >
                <option defaultValue="0"></option>
                  {row.original.free.map((fr, index) => (
                      <option key={fr} value={fr}>{fr}</option>
                    ))}   
                </select>
              </div>
            </div>
      )
    },{
      Header:'',
      Cell: row=> (
        <div className="col">
          <Button className="btn doctors-list-button" onClick={() => this.schedule(row.original)}>Schedule</Button>
        </div>
      )
  }]

      var clinicDoctors;
      var table;
      var title;
      if(window.location.pathname.split("/")[3]==null){
        clinicDoctors=(
              <form onSubmit={this.FilterDoctors}>
                  <div className="row">
                    <div className="col-5">
                      <div className="form-group">
                        <div className="col">
                          <label htmlFor="type">Type:</label>
                          <select required className="custom-select mr-sm-2" name="type" id="type" onChange={this.handleChange} >
                            <option defaultValue="0"></option>
                            {this.state.types.map((type, index) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}   
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                          <label htmlFor="date">Date:</label>
                          <input required type="date" className="form-control" name="date" id="date" placeholder="Choose date"
                            onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className="col-3">
                      <br/>
                      <Button type="submit" className="btn doctors-list-button">Filter</Button>
                      <Button className="btn doctors-list-button1 " onClick={() => this.allClinicDoctors()}>All</Button>
                    </div>
                  </div>  
                </form>
      )
        if(this.state.filtered==1){

          table=( <ReactTable 
          data={this.state.doctors}
          columns={columnsAllFiltered}
          filterable
          onFilteredChange = {this.handleOnFilterInputChange}
          defaultPageSize = {6}
          pageSizeOptions = {[6, 10, 15]}
          /*getTrProps={(state, rowInfo) => {
            if (rowInfo && rowInfo.row) {
              return {
                onClick: (e) => {
                  this.setState({
                    selected: rowInfo.index
                  })
                },
                style: {
                  background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                  color: rowInfo.index === this.state.selected ? 'white' : 'black'
                }
              }
            }else{
              return {}
            }
          }}*/
          />)
        }else{

          table=( <ReactTable 
          data={this.state.doctors}
          columns={columnsAll}
          filterable
          onFilteredChange = {this.handleOnFilterInputChange}
          defaultPageSize = {6}
          pageSizeOptions = {[6, 10, 15]}
        />)
      }
        title=(  <div className="clinics-title">Clinic doctors</div>)
      
      }else{

        title=( <div className="clinics-title">Available doctors</div>)

        table=(<ReactTable 
          data={this.state.doctors}
          columns={columnsSpecialized}
          filterable
          onFilteredChange = {this.handleOnFilterInputChange}
          defaultPageSize = {6}
          pageSizeOptions = {[6, 10, 15]}
        />)
      }
    
      return (
        <div className="DoctorsList">
          <Header/>
          <div className="row">
            <div className="col-12">
              <br/>
              {title}
              <br/>
              <br/>
              <div className='doctors rtable'>
                {clinicDoctors}   
                <br/>   
                {table}
              </div>
            </div>
        </div>
           
        <Footer/>
        </div>
      );
      }
}

export default withRouter (DoctorsList);