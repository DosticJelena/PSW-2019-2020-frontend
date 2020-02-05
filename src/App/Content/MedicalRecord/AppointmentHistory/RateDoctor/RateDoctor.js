import React from 'react';
import Header from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';

class RateDoctor extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.UpdateInfoRequest = this.UpdateInfoRequest.bind(this);

        this.state = {
            doctorId: '',
            rating:'',
            loaded: false,
            appLength:'',
            firstName:'',
            lastName:''
        }
    }

    UpdateInfoRequest = event => {
        event.preventDefault();
        var found = false;   
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log(this.state)
    }

    onStarClickDoctor(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
      }

    rateDoctor = event =>{
        event.preventDefault();
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       /* axios.put("http://localhost:8080/api/doctor/" + this.state.doctorId, {
           // number: this.state.number,
           //dodaj na zbir

        }).then(() => {
            NotificationManager.success('Successfully updated', 'Success!', 4000);
            window.location.replace('/appointment-history');
        }
        ).catch((error) => NotificationManager.error('Something went wrong', 'Error!', 4000))
*/
    }


    render() {
        
        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.doctorId))) {
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const doctorId = window.location.pathname.split("/")[2];
        axios.get("http://localhost:8080/api/doctors/" + doctorId)
            .then(response => {
                console.log(response.data);
                this.setState({
                    firstName: response.data.firstName,
                    doctorId:response.data.id,
                    lastName: response.data.lastName
                })
            }).catch((error) => console.log(error))
        }

        return (
            <div className="RateDoctor">
            <div><h4>Rate doctor</h4>
                <hr/>
                <form onSubmit={this.rateDoctor}>
                    <div className="form-group col">
                        <label className="name">First Name: {this.state.firstName} </label>
                        <label className="address">Last Name:{this.state.lastName}</label>
                    </div>
                    <div className="rating" style={{marginLeft:'20rem'}} >
                    <StarRatingComponent 
                        value={this.state.rating}
                        onStarClick={this.onStarClickDoctor.bind(this)}/>  
                    </div>                             
                    <hr/>
                    <Button type="submit" className="btn rate-btn">Update</Button>
                </form>
                <br /></div>
            </div>
        );
    }
  }

export default RateDoctor;