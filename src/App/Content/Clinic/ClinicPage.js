import React from 'react';
import { Link,withRouter } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ClinicPage.css'
import axios from 'axios'

class ClinicPage extends React.Component {

    constructor(props){
        super(props); 
    
        this.state = {
            id: '',
            name: ''
        }
    }
    
    componentDidMount(){
        const id = window.location.pathname.split("/")[2];
        axios.get("http://localhost:8080/api/clinic/"+ id).then(response => {
                console.log(response.data);
                this.setState({
                    id: response.data.id,
                    name: response.data.name
                })
            }) .catch((error) => console.log(error))
        }

    visitPredefExam = () =>{
        const id=window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/predefined-examinations/'+id);
    }

    visitDoctors= () =>{
        const id=window.location.pathname.split("/")[2];
        console.log(id);
        this.props.history.push('/doctors-list/'+id);
    }

    render() {
        return(
            
            <div className="Clinic-page">
                <Header/>

                <div className="clinic-page-title">Clinic page</div>
                <h3>{this.state.name}</h3>

                <div className="btn-predefined-exam">
                 <button className="btn link-btn-patient predefined-btn" onClick={() => this.visitPredefExam()}>Predefined examinations</button>
               </div>

                <div className="btn-predefined-exam">
                 <button className="btn link-btn-patient predefined-btn" onClick={() => this.visitDoctors()}>Doctors of the clinic</button>
               </div>

                <Footer/>
            </div>

            );
        }
    }
    
export default withRouter (ClinicPage);