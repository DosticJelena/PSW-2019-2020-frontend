import React from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';

class RateClinic extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
     
        this.state = {
            clinicId: '',
            rating:'',
            name:'',
            description:'',
            address:''
        }
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log(this.state)
    }

    onStarClickClinic(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    rateClinic = event =>{
        event.preventDefault();
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.put("http://localhost:8080/api/clinic/" + this.state.clinicId, {
           // number: this.state.number,
           //dodaj na zbir

        }).then(() => {
            NotificationManager.success('Successfully updated', 'Success!', 4000);
            window.location.replace('/appointment-history');
        }
        ).catch((error) => NotificationManager.error('Something went wrong', 'Error!', 4000))

    }


    render() {

        if (this.props.reload == true && (window.location.pathname.split("/")[2] != (this.state.clinicId))) {
            const clinicId = window.location.pathname.split("/")[2];
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get("http://localhost:8080/api/clinic/" + clinicId)
                   .then(response => {
                       console.log(response.data);
                       this.setState({
                           name: response.data.name,
                           clinicId: response.data.id,
                           description:response.data.description,
                           address: response.data.address
                       })
                   }).catch((error) => console.log(error))
        }

        return (
            <div className="RateClinic">
            <div><h4>Rate clinic</h4>
                <hr/>
                <form onSubmit={this.rateClinic}>
                    <div className="form-group col">
                        <label className="name">Name:  {this.state.name}</label>
                        <label className="address">Address: {this.state.address} </label>
                        <label  className="description">Description:  {this.state.description}</label>
                    </div>
                    <div className="rating" style={{marginLeft:'20rem'}} >
                    <StarRatingComponent 
                        value={this.state.rating}
                        onStarClick={this.onStarClickClinic.bind(this)}/>  
                    </div>                             
                    <hr/>
                    <Button type="submit" className="btn rate-btn">Update</Button>
                </form>
                <br /></div>
            </div>
        );
    }

}

export default RateClinic;