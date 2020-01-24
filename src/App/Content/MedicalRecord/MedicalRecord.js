import React from 'react';
import { Link } from 'react-router-dom'
import "react-table/react-table.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MedicalRecord.css';
import axios from 'axios';



class MedicalRecord extends React.Component{
    constructor(props){
        super(props); 
     
        this.state={
           patientId:'', 
           height:'',
           weight:'',
           bloodType:'',
           allergies:[],
           examinationReports:[]
        }
    }

    componentDidMount(){
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/api/medicalRecords"+this.state.patientId)  
          .then(response => {
              console.log(response.data[0]);
              this.setState({
                  patientId: response.data[0].patientId,
                  height: response.data[0].height,
                  weight: response.data[0].weight,
                  bloodType: response.data[0].bloodType,
                  allergies: response.data[0].allergies,
                  examinationReports: response.data[0].examinationReports

              })
          })
        .catch((error) => console.log(error))
     }
  
    render(){
        return(

            <div className="MedicalRecord">
                <Header/>
                <div>               
                <div className="row">
                  <div className="col-6">
                      <h3>Medical record</h3>
                      <hr/>
                      <div className="form-group">
                        <label><strong>Height:</strong> {this.state.height} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Body weight:</strong> {this.state.weight} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Blood type:</strong> {this.state.bloodType} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Allergies:</strong> {this.state.allergies} </label>
                      </div>
                  </div>
                </div>

                </div>
                <Footer/>
            </div>

        );
    }
}

export default MedicalRecord;