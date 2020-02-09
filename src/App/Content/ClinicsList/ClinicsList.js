import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ClinicsList.css'
import Select from "react-select";
import axios from 'axios'
import { NotificationManager } from 'react-notifications';
import { Link, withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap';

class ClinicsList extends React.Component{

    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.FilterClinics = this.FilterClinics.bind(this);

        this.state={

            clinics: [{
              id:'',
              name :'',
              description:'',
              address:'',
              city:'',
              stars:'',
              num_votes:'',
              price:''
            }],
            data:[],
            filtered:[],
            selected: undefined,
            date:'',
            type:'',
            types:[],
            specialized:'',
        }
    }

    FilterClinics = event => {
      event.preventDefault();
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(this.state.date);
      console.log(this.state.type);
      axios.get("http://localhost:8080/api/filter-clinics/"+this.state.date+'/'+this.state.type).then(response => {
        console.log(response.data);
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }

        this.setState({
          clinics: tmpArray,
          specialized:1

        })
      }).catch((error) => console.log(error))
    } 

    handleChange(e) {
      this.setState({ ...this.state, [e.target.name]: String(e.target.value) });
    }

    componentDidMount() {
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get("http://localhost:8080/api/clinics").then(response => {
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
            tmpArray.push(response.data[i])
        }

        this.setState({
            clinics: tmpArray,
            specialized:0
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
       

    onFilteredChangeCustom = (value, accessor) => {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
    
        if (filtered.length) {
          filtered.forEach((filter, i) => {
            if (filter["id"] === accessor) {
              if (value === "" || !value.length) filtered.splice(i, 1);
              else filter["value"] = value;
    
              insertNewFilter = 0;
            }
          });
        }
        if (insertNewFilter) {
            filtered.push({ id: accessor, value: value });
          }
      
          this.setState({ filtered: filtered });
     };

    visit = (id) =>{
        console.log(id);
        this.props.history.push('/clinic/'+id);
    }

    availableDoctors = (clinicId) =>{
      console.log(this.state.type);
      console.log(this.state.date);

      this.props.history.push('/doctors-list/' + clinicId +'/'+ this.state.type+ '/' + this.state.date);
  }

    allClinics = () =>{
      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
      axios.get("http://localhost:8080/api/clinics").then(response => {
        let tmpArray = []
        for (var i = 0; i < response.data.length; i++) {
          tmpArray.push(response.data[i])
        }

        this.setState({
          clinics: tmpArray,
          specialized: 0
        })
      }) .catch((error) => console.log(error))
        }

    render(){
        console.log(this.state.specialized)
        let { clinics } = this.state;
        
        const columns=[
        {
          Header:'Name',
          accessor: 'name'
        },{
            Header:'Address',
            accessor: 'address'
        },{
            Header:'Stars',
            accessor: 'stars'
        },{
          Header: '',
          Cell: row => (
              <div>
                 <button className="primary btn" onClick={() => this.visit(row.original.id)}>Visit</button>
               </div>
            ),
          width: 100,
          filterable:false

        }]

        const columns1=[
          {
          Header:'Name',
          accessor: 'name'
        },{
            Header:'Address',
            accessor: 'address'
        },{
            Header:'Stars',
            accessor: 'stars'
        },{
            Header:'Price',
            accessor: 'price'
        },{
          Header: '',
          Cell: row => (
              <div>
                 <button className="primary btn" onClick={() => this.availableDoctors(row.original.id)}>Available doctors</button>
               </div>
            ),
          width: 150,
          filterable:false

        },{
          Header: '',
          Cell: row => (
              <div>
                 <button id="visit" className="primary btn" onClick={() => this.visit(row.original.id)}>Visit</button>
               </div>
            ),
          width: 100,
          filterable:false

        }]


        var availableDoctors;
        if (this.state.specialized==1) {
         availableDoctors=( <ReactTable 
          data={clinics}
          filterable
          filtered={this.state.filtered}
          onFilteredChange={(filtered, column, value) => {
            this.onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            if (typeof filter.value === "object") {
              return row[id] !== undefined
                ? filter.value.indexOf(row[id]) > -1
                : true;
            } else {
              return row[id] !== undefined
                ? String(row[id]).indexOf(filter.value) > -1
                : true;
            }
          }}
          columns={columns1}
          defaultPageSize = {10}
          pageSizeOptions = {[5, 10, 15]}
        />
         )}
        else{
          availableDoctors=(<ReactTable 
          data={clinics}
          filterable
          filtered={this.state.filtered}
          onFilteredChange={(filtered, column, value) => {
            this.onFilteredChangeCustom(value, column.id || column.accessor);
          }}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            if (typeof filter.value === "object") {
              return row[id] !== undefined
                ? filter.value.indexOf(row[id]) > -1
                : true;
            } else {
              return row[id] !== undefined
                ? String(row[id]).indexOf(filter.value) > -1
                : true;
            }
          }}
          columns={columns}
          defaultPageSize = {10}
          pageSizeOptions = {[5, 10, 15]}
        />)

        }

        return (
            <div className="ClinicsList">
              <Header/>
              <div >
              <div className="clinics-title">Clinic list</div>
                <br/>
                <br/>
                <div className='clinics rtable'>
                <form onSubmit={this.FilterClinics}>
                  <div className="row">
                    <div className="col-5">
                      <div className="form-group">
                        <div className="col">
                          <label htmlFor="type" >Type:</label>
                          <select required className="custom-select mr-sm-2" name="type" id="type" onChange={this.handleChange} >
                            <option defaultValue="0"></option>
                            {this.state.types.map((type, index) => (
                              <option id="optionSelected" key={type.name} value={type.name}>{type.name}</option>
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
                    <div className="col-2">
                      <br/>
                      <Button id="filterButton" type="submit" className="btn clinics-list-button">Filter</Button>
                      <Button className="btn clinics-list-all " onClick={() => this.allClinics()}>All</Button>
                    </div>
                     </div>       
                </form>
                {availableDoctors}
                
                </div>
                </div> 
              <Footer/>
        
            </div>
          );
    }

}

export default withRouter (ClinicsList);