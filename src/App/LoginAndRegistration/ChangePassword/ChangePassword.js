import React from 'react';
import { Link } from 'react-router-dom'
import '../Login/Login.css'
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';


import logo from '../../../images/med128.png'

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.SendLoginRequest = this.SendLoginRequest.bind(this);

        this.state = {
            id: this.props.location.pathname.split('/').pop(),
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            role: '',
            firstName: '',
            email: '',
            dto: {
                newPassword: "",
                oldPassword: ""
            }
        }
        NotificationManager.info('Welcome to the Clinic Center System. Upon first login you have to change your password', '', 4000);

    }

    SendLoginRequest = event => {
        event.preventDefault();

        axios.put("http://localhost:8080/auth/change-password", {
            newPassword: this.state.newPassword,
            oldPassword: this.state.oldPassword
        }).then((resp) => {
            console.log(this.state);
            NotificationManager.success('Your password has been changed. You can now log in to the Clinic Center with new password.', '', 4000);
            axios.post("http://localhost:8080/auth/login", {
                email: this.state.email,
                password: this.state.newPassword
            }).then(() => {
                this.props.history.push('/login');
            }).catch((error) => {
                if (this.state.newPassword.length < 6) {
                    NotificationManager.error('Minimum number of caracters is 6. Please change new password.', 'Error!', 4000);
                } else {
                    NotificationManager.error('Wrong input', 'Error!', 4000);
                }
            })
        })
    }


componentDidMount() {
    axios.get("http://localhost:8080/auth/getMyUser")
        .then(response => {
            console.log(response.data);
            this.setState({
                firstName: response.data.firstName,
                email: response.data.username,
                role: response.data.authorities[0].name
            })
        })
        .catch((error) => console.log(error))
}

handleChange(e) {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
}

render() {
    console.log(this.state)
    return (
        <div className="Login" >
            <div className="">
                <div className="row">
                    <div className="col-4 welcome">
                        <div className="logo">
                            <img alt="logo" src={logo} />
                            <h1 className="title">Clinic Center</h1>
                        </div>
                    </div>
                    <div className="col-8 login">
                        <form onSubmit={this.SendLoginRequest}>
                            <h4>You have logged in for the first time. <br></br>Please change your password.</h4>
                            <div className="form-group">
                                <br />
                                <div className="row">
                                    <div className="col-6">
                                        <label>Enter Old Password</label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control"
                                            id="oldPassword"
                                            name="oldPassword"
                                            onChange={this.handleChange}
                                            value={this.state.oldPassword}
                                            placeholder="Old Password" />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-6">
                                        <label>Enter New Password</label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            onChange={this.handleChange}
                                            value={this.state.newPassword}
                                            placeholder="New Password" />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-6">
                                        <label>Confirm New Password</label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            onChange={this.handleChange}
                                            placeholder="Confirm New Password" />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <Button type="submit" className="btn">Change Password</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
}

export default withRouter(ChangePassword);