import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import { Button} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import { Link,  withRouter } from 'react-router-dom';

import './SchedulingForm.css';

const SchedulingAlert = withReactContent(Swal)

class SchedulingForm extends React.Component {

        constructor(props){
          super(props); 
          
          this.state={

            patientId:'',
            clinicName:'',
            address:'',
            city:'',
            description:'',
            patientName:'',
            patientLastName:'',
            doctorsFirstName:'',
            doctorsLastName:'',
            price:'',
            appointmentType:''
          }
        }

        sendRequest = ()=>{

          var time="";
          var year="";
          year=window.location.pathname.split("/")[4].split("%20")[1].split(".");
          time=year[2]+'-'+year[1]+'-'+year[0]+" "+window.location.pathname.split("/")[4].split("%20")[0];
          console.log(time);
          var token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.post("http://localhost:8080/api/appointment-request", {
            patientId: this.state.patientId,
            clinicId: window.location.pathname.split("/")[3],
            appointmentType: this.state.appointmentType,
            startTime: time,
            doctorsId: window.location.pathname.split("/")[2]

            }).then((resp) => {
            NotificationManager.success('Successfuly sent request. ', 'Success!', 4000);
            })
            .catch((error)=> NotificationManager.error('Somthing went wrong. Try later.', 'Error!', 4000))
        }
       
        componentDidMount(){
          var token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.get("http://localhost:8080/auth/getMyUser")  
            .then(response => {
                console.log(response.data);
                this.setState({
                  patientId: response.data.id,
                  patientName: response.data.firstName,
                  patientLastName: response.data.lastName
                })
            })
          .catch((error) => console.log(error))

          const clinicId=window.location.pathname.split("/")[3];
          axios.get("http://localhost:8080/api/clinic/" + clinicId)
          .then(response => {
              console.log(response.data);
              this.setState({
                  clinicName: response.data.name,
                  address: response.data.address,
                  city: response.data.city,
                  description: response.data.description
              })
          }).catch((error) => console.log(error))

          const doctorsId=window.location.pathname.split("/")[2];
          axios.get("http://localhost:8080/api/doctors/" + doctorsId)
          .then(response => {
              console.log(response.data);
              this.setState({
                  doctorsFirstName: response.data.firstName,
                  doctorsLastName: response.data.lastName
              })
          }).catch((error) => console.log(error))

        const specializationId=window.location.pathname.split("/")[5];
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("http://localhost:8080/api/get-appointment-details/"+specializationId)
          .then(response => {
            console.log(response.data);
            this.setState({
              price: response.data.appointmentPrice,
              appointmentType: response.data.appointmentType
            })
          })
          .catch((error) => console.log(error))
          

      }
      render() {

      const doctorsId=window.location.pathname.split("/")[2];
      const clinicId=window.location.pathname.split("/")[3];
      const time=window.location.pathname.split("/")[4];
      const specializationId=window.location.pathname.split("/")[5];
      const specialization=window.location.pathname.split("/")[6];
 
      return (
        <div className="PersonalProfile">
          <Header/>
          <div className="">
              <div className="row">
                <div className="col-10">
                <br/>
                <h3 >Request for scheduling appointment</h3> 
                <br/>
                  <div className="info">
                  <div className="">
                    <div className="row">
                      <div className="col-6">
                          <h3>Appointment details</h3>
                          <hr/>
                          <div className="form-group" id="patient">
                            <label><strong> Patient:</strong> {this.state.patientName} {this.state.patientLastName} </label>
                          </div>
                          <div className="form-group" id="clinicName">
                            <label><strong> Clinic:</strong> {this.state.clinicName} </label>
                          </div>
                          <div className="form-group" id="doctor">
                            <label><strong> Doctor:</strong> {this.state.doctorsFirstName} {this.state.doctorsLastName} </label>
                          </div>
                          <div className="form-group" id="specialization">
                            <label><strong> Specialized for:</strong> {specialization}  </label>
                          </div>
                          <div className="form-group" id="date">
                            <label><strong> Date:</strong> {time.split("%20")[1]} </label>
                          </div>
                          <div className="form-group" id="startTime">
                            <label><strong> Start time:</strong> {time.split("%20")[0]} </label>
                          </div>
                          <div className="form-group" id="appType">
                            <label><strong> Type of appointment:</strong> {this.state.appointmentType} </label>
                          </div>
                          <div className="form-group" id="price">
                            <label><strong>Price:</strong> {this.state.price} </label>
                          </div>
                          <Button className="btn send-app-request-button" onClick={() => this.sendRequest()}>Send request</Button>
        
                      </div>
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
 


export default withRouter(SchedulingForm);