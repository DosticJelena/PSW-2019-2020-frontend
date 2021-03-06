import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { withRouter } from 'react-router-dom';


class PatientProfile extends React.Component {
 
 constructor(props){
   super(props); 

   this.state={
       id: '',
      firstName: '',
      lastName:'',
      email:'',
      medicalNumber:'',
      address:'',
      city:'',
      country:'',
      phoneNumber: '',
      role: '',
      doctorStars: '',
      doctorVotes: ''
   }
 }
 
 componentDidMount(){
    const id = window.location.pathname.split("/")[2];
    this.setState({id: id});
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("https://deployment-isa.herokuapp.com/api/patients/" + id)  
      .then(response => {
          console.log(response.data);
          this.setState({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.username,
              address: response.data.address,
              city: response.data.city,
              country: response.data.country,
              phoneNumber: response.data.phoneNumber,
              role: response.data.authorities[0].name,
              medicalNumber: response.data.medicalNumber,
              doctorStars: response.data.stars,
              doctorVotes: response.data.num_votes
          })
      })
    .catch((error) => console.log(error))
 }
 
  render() {

    var additionalInfo;
    if (this.state.role === "ROLE_CLINIC_ADMIN"){
      additionalInfo = (
        <div className="col-6">
            <h3>Clinic Admin Information</h3>
            <hr/>
        </div>
      )
    } else if (this.state.role === "ROLE_PATIENT"){
      additionalInfo = (
        <div className="col-6">
            <h3>Patient Information</h3>
            <hr/>
            <div className="form-group">
              <label><strong>Medical number:</strong> {this.state.medicalNumber}</label>
            </div>
        </div>
      )
    } else if (this.state.role === "ROLE_DOCTOR"){
      additionalInfo = (
        <div className="col-6">
            <h3>Doctor Information</h3>
            <hr/>
            <div className="form-group">
              <label><strong>Stars:</strong> {this.state.doctorStars}</label>
            </div>
            <div className="form-group">
              <label><strong>Number of Votes:</strong> {this.state.doctorVotes}</label>
            </div>
        </div>
      )
    }
    
  return (
    <div className="PatientProfile">
      <Header/>
      <div className="">
          <div className="row">
            <div className="col-10">
            <br/>
            <h3>{this.state.firstName} {this.state.lastName}</h3>
            <br/>
              <div className="info">
              <div className="">
                <div className="row">
                  <div className="col-6">
                      <h3>Personal Information</h3>
                      <hr/>
                      <div className="form-group">
                        <label><strong>First name:</strong> {this.state.firstName} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Last name:</strong> {this.state.lastName} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Email:</strong> {this.state.email} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Address:</strong> {this.state.address} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>City:</strong> {this.state.city} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Country:</strong> {this.state.country} </label>
                      </div>
                      <div className="form-group">
                        <label><strong>Phone number:</strong> {this.state.phoneNumber} </label>
                      </div>
                      <Link to={"/medical-card/" + this.state.id} className="btn link-btn-patient edit-button">Medical Card</Link>
                  </div>
                  {additionalInfo}
                </div>
              </div>
            </div>
            </div>
            <div className="col-2 personal-profile-image">
            </div>
          </div>
      </div>
      <Footer/>

    </div>
  );
  }
}

export default withRouter(PatientProfile);