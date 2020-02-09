import React from 'react';
import './Register.css'
import logo from '../../../images/med128.png'
import { Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom';

import {NotificationManager} from 'react-notifications';

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  
  const phoneRegex = RegExp(
      /06[0-9]{7,8}$/
  );
  
  const capitalLetterRegex = RegExp(
      /^([A-Z][a-z]+)+$/
  );

  const medicalNumberRegex = RegExp(
    /[0-9]{9,10}$/
);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });
  
    return valid;
  };
  

class Register extends React.Component {

  constructor(props){
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.SendRegisterRequest = this.SendRegisterRequest.bind(this);

      this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            medicalNumber:'',
            address: '',
            city: '',
            country: '',
            phoneNumber: '',
            passwordConfirm:'',
            formErrors:{
                email:'',
                password: '',
                firstName:'',
                lastName:'',
                medicalNumber:'',
                address:'',
                city: '',
                country: '',
                phoneNumber: '',
                passwordConfirm:''
            },
            disableSubmit:true
      }
   }

  SendRegisterRequest = event => {
      event.preventDefault();
        console.log(this.state);  
        const { password, passwordConfirm } = this.state;
        if (password !== passwordConfirm) {
            alert("Passwords don't match");
        } else {
        axios.post("https://psw-isa-tim3.herokuapp.com/auth/register", {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            city: this.state.city,
            country: this.state.country,
            phoneNumber: this.state.phoneNumber,
            medicalNumber: this.state.medicalNumber

        }
        ).then((resp) => {
        NotificationManager.success('Registered successfuly. Please log in', 'Success!', 4000);
        this.props.history.push('/login');
        }
        )
        .catch((error)=> NotificationManager.error('Wrong input', 'Error!', 4000))
        }
    }

    handleKeyUp = () => {
        var empty = true;
    
        Object.keys(this.state.formErrors).forEach(e => 
          {if(this.state.formErrors[e] != ""){
            empty = false;
          }
        });
    
        if (!empty){
            this.setState({disableSumbit: true});
            console.log('disabled');
        }
        else{
    
            if (this.state.email != "" && this.state.firstName != "" && this.state.lastName != ""
            && this.state.address != "" && this.state.city != "" && this.state.country != "" && this.state.phoneNumber != "",
            this.state.medicalNumber!="" && this.state.password!="" && this.state.passwordConfirm!=""
            )
            {
              this.setState({disableSumbit: false});
              console.log('enabled');
            }
            else {
              this.setState({disableSumbit: true});
              console.log('disabled');
            }
        }
      }

      isEmpty = (obj)  =>{
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    /*handleChange(e) {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }*/

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "firstName":
            formErrors.firstName = capitalLetterRegex.test(value)
              ? ""
              : "First name must start with a capital letter";
    
            if (formErrors.firstName === ""){  
                formErrors.firstName =
                value.length < 3 ? "Minimum 3 characaters required" : "";
            }
            break;
          case "lastName":
            formErrors.lastName = capitalLetterRegex.test(value)
              ? ""
              : "Last name must start with a capital letter";
            
              if (formErrors.lastName === ""){  
                formErrors.lastName =
                value.length < 3 ? "Minimum 3 characaters required" : "";
            }
            break;
          case "email":
            formErrors.email = emailRegex.test(value)
              ? ""
              : "Invalid email address";
            break;
          case "city":
            formErrors.city =
              value.length < 3 ? "Minimum 3 characaters required" : "";
            break;
          case "country":
            formErrors.country =
              value.length < 3 ? "Minimum 3 characaters required" : "";
            break;
          case "address":
                formErrors.address =
                  value.length < 3 ? "Minimum 3 characaters required" : "";
                break;
          case "phoneNumber":
                formErrors.phoneNumber = phoneRegex.test(value)
                ? ""
                : "Input letters must be numbers, start with '06' and have between 9 and 10 numbers";
              break;
        case "medicalNumber":
                formErrors.medicalNumber = medicalNumberRegex.test(value)
                ? ""
                : "Input must be numbers and have between 9 and 10 numbers";
                break;
        case "password":
                formErrors.password =
                    value.length < 8 ? "Minimum 8 characaters required" : "";
                break;
        case "passwordConfirm":
                formErrors.passwordConfirm =
                    value.length < 8 ? "Minimum 8 characaters required" : "";
                break;
          default:
            break;
        }
        this.setState({ formErrors, [name]: value}, () => console.log(this.state));
    
        this.handleKeyUp();
      }

  render() {
      const{formErrors}=this.state;
      return (
    <div className="Register">
            <div className="row register-form">
            <div className="col-4 welcome">
                        <div className="logo">
                            <img alt="logo" src={logo} />
                            <h1 className="title">Clinic Center</h1>
                        </div>
                    </div>
                <div className="col-8 login">
                <form onSubmit={this.SendRegisterRequest}>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="firstNameR">
                                            <label htmlFor="firstName">First Name</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.firstName.length > 0 ? "error" : null}
                                                id="firstName"
                                                name="firstName"
                                                noValidate
                                                onChange={this.handleChange}
                                                placeholder="Enter first name"
                                            />
                                            {formErrors.firstName.length > 0 && (
                                            <span className="errorMessage">{formErrors.firstName}</span>
                                             )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="lastNameR">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.lastName.length > 0 ? "error" : null}
                                                id="lastName"
                                                name="lastName"
                                                onChange={this.handleChange}
                                                placeholder="Enter last name"
                                                noValidate
                                            />
                                            {formErrors.lastName.length > 0 && (
                                            <span className="errorMessage">{formErrors.lastName}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="email">
                                            <label htmlFor="email">Email Address</label>
                                            <input type="email"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.email.length > 0 ? "error" : null}                                
                                                id="email"
                                                name="email"
                                                onChange={this.handleChange}
                                                placeholder="Enter email address"
                                                noValidate
                                            />
                                             {formErrors.email.length > 0 && (
                                                <span className="errorMessage">{formErrors.email}</span>
                                             )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="phoneNumber">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input type="number"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.phoneNumber.length > 0 ? "error" : null}
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                onChange={this.handleChange}
                                                placeholder="Enter phone pumber"
                                                noValidate
                                            />
                                            {formErrors.phoneNumber.length > 0 && (
                                                <span className="errorMessage">{formErrors.phoneNumber}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="password">
                                            <label htmlFor="password">Password</label>
                                            <input type="password"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.password.length > 0 ? "error" : null}
                                                id="password"
                                                name="password"
                                                onChange={this.handleChange}
                                                placeholder="Enter password"
                                                noValidate
                                            />
                                             {formErrors.password.length > 0 && (
                                                <span className="errorMessage">{formErrors.password}</span>
                                             )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="passwordConfirm">
                                            <label htmlFor="passwordConfirm">Confirm Password</label>
                                            <input type="password"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.passwordConfirm.length > 0 ? "error" : null}
                                                id="passwordConfirm"
                                                name="passwordConfirm"
                                                onChange={this.handleChange}
                                                placeholder="Confirm password"
                                                noValidate
                                            />
                                             {formErrors.passwordConfirm.length > 0 && (
                                                <span className="errorMessage">{formErrors.passwordConfirm}</span>
                                             )}
                                        </div>
                                    </div>
                                </div> 
                                <hr/>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="country">
                                            <label htmlFor="country">Country</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.country.length > 0 ? "error" : null}
                                                id="country"
                                                name="country"
                                                onChange={this.handleChange}
                                                placeholder="Enter country"
                                                noValidate
                                            />
                                             {formErrors.country.length > 0 && (
                                                <span className="errorMessage">{formErrors.country}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="city">
                                            <label htmlFor="city">City</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.city.length > 0 ? "error" : null}
                                                id="city"
                                                name="city"
                                                onChange={this.handleChange}
                                                placeholder="Enter city"
                                                noValidate
                                            />
                                             {formErrors.city.length > 0 && (
                                                <span className="errorMessage">{formErrors.city}</span>
                                             )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="address">
                                            <label htmlFor="address">Address</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.address.length > 0 ? "error" : null}
                                                id="address"
                                                name="address"
                                                onChange={this.handleChange}
                                                placeholder="Enter address"
                                                noValidate
                                            />
                                            {formErrors.address.length > 0 && (
                                                <span className="errorMessage">{formErrors.address}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="medicalNumber">
                                            <label htmlFor="medicalNumber">Medical number:</label>
                                            <input type="text"
                                                onKeyUp={this.handleKeyUp}
                                                className={formErrors.medicalNumber.length > 0 ? "error" : null}
                                                id="medicalNumber"
                                                name="medicalNumber"
                                                onChange={this.handleChange}
                                                placeholder="Enter medical number"
                                                noValidate
                                            />
                                             {formErrors.medicalNumber.length > 0 && (
                                                <span className="errorMessage">{formErrors.medicalNumber}</span>
                                             )}
                                        </div>
                                    </div>
                                </div>         
                            <hr/>
                            <small id="newAccount" className="form-text text-muted"><Link to="/login">Already have an account?</Link></small> 
                            <br/>                      
                            <Button disabled={this.state.disableSumbit} className="register" type="submit">Create</Button>
                        </form>
                </div>
            </div>
    </div>
  );}
}

export default withRouter(Register);