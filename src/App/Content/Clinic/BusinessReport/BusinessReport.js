import React from 'react';
import { Link } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './BusinessReport.css';
import axios from 'axios';

class BusinessReport extends React.Component {

    constructor(props){
        super(props); 
    
        this.state = {
            id: '',
            name: '',
            avg: '',
            doctors: []
        }
    }
    
    componentDidMount(){
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  
        const id = window.location.pathname.split("/")[2];
        console.log(id);
        axios.get("http://localhost:8080/api/clinic/"+id).then(response => {
                console.log(response.data);
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    address: response.data.address,
                    city: response.data.city
                })
            }) .catch((error) => console.log(error))
        }

    render() {
        return(
            
            <div className="BusinessReport">
                <Header/>
                <br/>
                <h3>Business Report <h4><em>{this.state.name}</em></h4></h3>
                <hr/>
                <h5>Average grade: {this.state.avg}</h5>
                <h5>Doctors grades: {this.state.avg}</h5>
                <h5>Monthly Income: {this.state.avg}</h5>
                <h5>Graph: {this.state.avg}</h5>


                <Footer/>
            </div>

            );
        }
    }
    
export default BusinessReport;