import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './EditClinicPage.css';
import axios from 'axios';

class EditClinicPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.UpdateInfoRequest = this.UpdateInfoRequest.bind(this);

        this.state = {
            clinicId: '',
            name: '',
            address: '',
            city: '',
            description: ''
        }
    }

    componentDidMount() {
        const { clinicId } = this.props.location.state;
        this.setState({ clinicId: clinicId });

        axios.get("http://localhost:8080/api/clinic/" + clinicId)
            .then(response => {
                console.log(response.data);
                this.setState({
                    name: response.data.name,
                    address: response.data.address,
                    city: response.data.city,
                    description: response.data.description
                })
            }).catch((error) => console.log(error))
    }

    UpdateInfoRequest = event => {
        event.preventDefault();
        const { password, passwordConfirm } = this.state;
        if (password !== passwordConfirm) {
            alert("Passwords don't match");
        } else {
            var token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.put("http://localhost:8080/api/update-personal-info/" + this.state.accountId, {
                name: this.state.name,
                address: this.state.address,
                city: this.state.city,
                description: this.state.description
            }).then(
                (resp) => this.onSuccessHandler(resp)
            )
        }
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="EditClinicPage">
                <Header />
                <div className="row">
                    <div className="col-10">
                        <br />
                        <h3 >Edit Clinic Information</h3>
                        <br />
                        <form onSubmit={this.UpdateInfoRequest} className="edit-info">
                            <div className="form-row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="name"
                                            name="name"
                                            onChange={this.handleChange}
                                            placeholder="Enter name"
                                            defaultValue={this.state.name}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
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
                            <div className="form-row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <input type="text"
                                            className="form-control form-control"
                                            id="description"
                                            name="description"
                                            onChange={this.handleChange}
                                            placeholder="Enter description"
                                            defaultValue={this.state.description}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="btn update-clinic-btn" type="submit">Update</button>
                        </form>
                        <br />
                    </div>
                    <div className="col-2 image">

                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

export default EditClinicPage;