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
              dto:[{
                timeId:'',
                time:''
              }]
            }],
            type:'',
            date:'',
            time:'',
            types:[],
            filtered:[],
            selected:null,
            appointmentType:''
        }

    }

    FilterDoctors = event => {
      event.preventDefault();
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const clinicId=window.location.pathname.split("/")[2];
      axios.get("http://localhost:8080/api/filter-doctors/"+this.state.date+'/'+this.state.type+'/'+clinicId).then(response => {
        let tmpArray = []
        let available=[]
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])

        }
        this.setState({
          doctors: tmpArray,
          filtered:1
        })
      }).catch((error) => console.log(error))
    }

    schedule= (doctorId, time)=>{

      const clinicId=window.location.pathname.split("/")[2];
      const specializationId = window.location.pathname.split("/")[3];
      var specialization="";
      for(let i=0; i<this.state.types.length; i++){
        if(this.state.types[i].id==specializationId){
          specialization=this.state.types[i].name;
        }
      } 
        this.props.history.push('/scheduling-form/'+doctorId+'/'+clinicId+'/'+time+'/'+specializationId+'/'+specialization);
    }

    schedule1= (doctorId, time)=>{

      const clinicId = window.location.pathname.split("/")[2];
      var specialization="";
      var specializationId="";
      for(let i=0; i<this.state.types.length; i++){
        if(this.state.types[i].id==this.state.type){
          specialization=this.state.types[i].name;
          specializationId= this.state.types[i].id;
        }
      }
      this.props.history.push('/scheduling-form/'+doctorId+'/'+clinicId+'/'+time+'/'+specializationId+'/'+specialization);
         
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

    componentDidMount() { 
        const id = window.location.pathname.split("/")[2];
        const type = window.location.pathname.split("/")[3];
        const date = window.location.pathname.split("/")[4];

        if(type!=null){

            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("http://localhost:8080/api/filter-doctors/"+date+'/'+type+'/'+id).then(response => {
              let tmpArray = []
              for (var i = 0; i < response.data.length; i++) {
                tmpArray.push(response.data[i])
      
              }
              this.setState({
                doctors: tmpArray,
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
        }

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
          Cell: row => (
            <div>
                 { row.original.dto.map((t, index) => (
                        <Button className="schedule-appointment-button" key={t.timeId} value={t.timeId} onClick={() => this.schedule(row.original.id, t.time)}>{t.time.split(' ')[0]}</Button>
                   )) }         
             </div>
        )
      },{
        Header:'Rating',
        accessor: 'rating'
    }
    ]

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

      var a=0;
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
        Cell: row => (
          <div>
                 { row.original.dto.map((t, index) => (
                        <Button className="schedule-appointment-button" key={t.timeId} value={t.timeId} onClick={() => this.schedule1(row.original.id, t.time)}>{t.time.split(' ')[0]}</Button>
                        )) } 

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