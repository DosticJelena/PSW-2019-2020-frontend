import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './EditPersonalProfile.css';
import { NotificationManager } from 'react-notifications';
import { withRouter, Link } from 'react-router-dom';

const UpdateInfoAlert = withReactContent(Swal)
class EditPersonalProfile extends React.Component {

    constructor(props) {
        super(props);


        this.handleChange = this.handleChange.bind(this);
        this.UpdateInfoRequest = this.UpdateInfoRequest.bind(this);

        this.state = {
            accountId: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            country: '',
            phoneNumber: '',
            passwordConfirm: ''

        }
    }

    componentDidMount() {
        var token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get("https://deployment-isa.herokuapp.com/auth/getMyUser")
            .then(response => {
                this.setState({
                    accountId: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.username,
                    address: response.data.address,
                    city: response.data.city,
                    country: response.data.country,
                    phoneNumber: response.data.phoneNumber
                })
            })
            .catch((error) => console.log(error))
    }

    UpdateInfoRequest = event => {
        event.preventDefault();
        const { password, passwordConfirm } = this.state;
        if (password !== passwordConfirm) {
            NotificationManager.error("Passwords don't match.", 'Error!', 4000);
        } else {
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.put("https://deployment-isa.herokuapp.com/api/update-personal-info/" + this.state.accountId, {
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                city: this.state.city,
                country: this.state.country,
                phoneNumber: this.state.phoneNumber,
                medicalNumber: '234'
            }).then(
                (resp) => {
                    NotificationManager.success("Successfully updated.", 'Success!', 4000);
                    this.props.history.push("/my-profile");
                }
            )
        }
    }

    onSuccessHandler(resp) {
        UpdateInfoAlert.fire({
            title: "Personal information updated successfully",
            text: "",
            type: "success",
        })
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }


    render() {

        return (
            <div className="EditPersonalProfile">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <br />
                        <h3 >Edit Personal Information</h3>
                        <br />
                        <form onSubmit={this.UpdateInfoRequest} className="edit-info">
                            <div className="form-row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="firstName"
                                            name="firstName"
                                            onChange={this.handleChange}
                                            placeholder="Enter first name"
                                            defaultValue={this.state.firstName}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="lastName"
                                            name="lastName"
                                            onChange={this.handleChange}
                                            placeholder="Enter last name"
                                            defaultValue={this.state.lastName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email"
                                            className="form-control form-control"
                                            id="email"
                                            name="email"
                                            onChange={this.handleChange}
                                            defaultValue={this.state.email}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input type="number"
                                            className="form-control form-control"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            onChange={this.handleChange}
                                            placeholder="Enter phone number"
                                            defaultValue={this.state.phoneNumber}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="form-row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="country">Country</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="country"
                                            name="country"
                                            onChange={this.handleChange}
                                            placeholder="Enter country"
                                            defaultValue={this.state.country}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="city"
                                            name="city"
                                            onChange={this.handleChange}
                                            placeholder="Enter city"
                                            defaultValue={this.state.city}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="address"
                                            name="address"
                                            onChange={this.handleChange}
                                            placeholder="Enter address"
                                            defaultValue={this.state.address}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <Button type="submit" className="change-pass">Update</Button>
                            <Link className="btn change-pass" to="change-password">Change password</Link>
                        </form>
                        <br />
                    </div>
                    <div className="col-2 edit-personal-profile-image">
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(EditPersonalProfile);