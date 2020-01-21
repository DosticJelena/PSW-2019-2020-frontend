import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './PredefinedExaminations.css'
import { Button} from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom'

class PredefinedExaminations extends React.Component {

    constructor(props){
        super(props);

        this.state={
            examinations: [{
                id:'',
                type:'',
                date:'',
                time:'',
                price:'',
                duration:'',
                ordination:'',
                doctor:'',
                discount:''
            }],
            filtered:[],
            selected: undefined,
            idP:''
        }
    }

    
    componentDidMount() {
        const id = window.location.pathname.split("/")[2];
        axios.get("http://localhost:8080/api/predefined-appointments/"+id).then(response => {
            let tmpArray = []
            for (var i = 0; i < response.data.length; i++) {
                tmpArray.push(response.data[i])
            }
  
            this.setState({
                examinations: tmpArray
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

 

schedule = (id) =>{
        
    axios.get("http://localhost:8080/auth/getMyUser")  
    .then(response => {
        console.log(response.data.id);
        this.state.idP=response.data.id;
    }).catch((error) => console.log(error))

    axios.post("http://localhost:8080/api/schedule-predefined-appointment/" + id, this.state.idP ).then(response => {
    const {examinations} = this.state;
    examinations.pop(response.data);
    this.setState({examinations});
    }).then((resp) => this.onSuccessHandler(resp))
    console.log('Id: ' + id);
};


    render() {

        let{examinations}=this.state;
        console.log(examinations);
        const columns=[{
            Header: 'Id',
            id: 'id',
            accessor: d=>d.id
        },{
            Header:'Type',
            accessor:'type'
        },{
            Header:'Date',
            accessor:'date'
        },{
            Header:'Time',
            accessor:'time'
        },{
            Header:'Price',
            accessor:'price'
        },{
            Header:'Duration',
            accessor:'duration'
        },{
            Header:'Doctor',
            accessor:'doctor'
        },{
            Header:'Ordination',
            accessor:'ordination'
        },{
            Header:'Discount',
            accessor:'discount'
        },{
            Header:'Schedule',
            Cell: row => (
                <div>
                    <button onClick={() => this.schedule(row.original.id)}>Schedule</button>
                </div>
            )
        }
    ]

        return(
            
            <div className="Predefined-Examinations">
                <Header/>

                <div className="Predefined-Examinations-title">Predefined appointments</div>

                <div className='clinics rtable'>
                    <ReactTable 
                    data={this.state.examinations}
                    //columns={columns}
                    filterable
                    onFilteredChange = {this.handleOnFilterInputChange}
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
                    />
                </div>

                <Footer/>
            </div>

            );
        }
    }
    
export default withRouter (PredefinedExaminations);