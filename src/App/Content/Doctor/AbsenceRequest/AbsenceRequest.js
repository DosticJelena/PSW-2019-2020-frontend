import React from 'react';
import "react-table/react-table.css";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './AbsenceRequest.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NotificationManager } from 'react-notifications';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import moment from 'moment'

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


class AbsenceRequest extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.SendRegisterRequest = this.SendRegisterRequest.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this)
    this.onFocusChange = this.onFocusChange.bind(this)
    this.handleType = this.handleType.bind(this)
    this.isEmpty = this.isEmpty.bind(this)

    this.state = {
      startDate: "",
      endDate: "",
      role: '',
      focusedInput: "",
      types: ["ANNUAL_LEAVE", "SICK_LEAVE"],
      typeId: "",
      description: "",
      disabled: true,
      formErrors: {
        typeId: "",
        description: "",
      }
    }
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
    console.log(this.state);
  }

  SendRegisterRequest = event => {
    event.preventDefault();
    console.log(this.state)
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://localhost:8080/auth/getMyUser")
      .then(response => {
        console.log(response);
        this.setState({
          role: response.data.authorities[0].name
        })
      }).then(() => {

        if (this.state.role == "ROLE_NURSE") {
          axios.post("http://localhost:8080/api/nurse/request-leave", {

            startDateTime: this.state.startDate._d,
            endDateTime: this.state.endDate._d,
            paidTimeOffType: this.state.typeId,
            comment: this.state.description

          }).then((resp) => {
            NotificationManager.success('Request has been sent. Please wait until administrator informs you if it is accepted.', '', 3000);
            console.log(resp);
          })
            .catch((error) => {
              NotificationManager.error(error.response.data, 'Error', 3000)
            })
        } else if (this.state.role == "ROLE_DOCTOR") {
          axios.post("http://localhost:8080/api/doctor/request-leave", {

            startDateTime: this.state.startDate._d,
            endDateTime: this.state.endDate._d,
            paidTimeOffType: this.state.typeId,
            comment: this.state.description

          }).then((resp) => {
            NotificationManager.success('Request has been sent. Please wait until administrator informs you if it is accepted.', '', 3000);
            console.log(resp);
          })
            .catch((error) => {
              NotificationManager.error('Sorry, something went wrong.', 'Error', 3000)
            })
        }

      }).catch((error) => console.log(error));

  }

  handleKeyUp = () => {
    var empty = true;

    Object.keys(this.state.formErrors).forEach(e => {
      if (this.state.formErrors[e] != "") {
        empty = false;
      }
    });

    if (!empty) {
      this.setState({ disabled: true });
      console.log('disabled');
    }

    else {
      if (this.state.typeId != (null && "") && this.state.description != "" && !this.isEmpty(this.state.startDate) && !this.isEmpty(this.state.endDate)) {
        this.setState({ disabled: false });
        console.log('enabled');
      }
      else {
        this.setState({ disabled: true });
        console.log('disabled');
      }
    }
  }

  isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  handleType = (e, values) => {
    e.preventDefault();

    let formErrors = { ...this.state.formErrors };

    formErrors.typeId = values == "" ? "You must select a type" : ""

    this.setState({ formErrors, typeId: values }, () => console.log(this.state));

    this.handleKeyUp();

  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "description":
        formErrors.description =
          value.length < 10 ? "minimum 10 characaters required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));

    this.handleKeyUp();
  }

  render() {

    const { formErrors } = this.state;
    const { focusedInput, startDate, endDate } = this.state;

    return (
      <div className="AbsenceRequest">
        <Header />
        <div className="row">
          <div className="col-10">
            <br />
            <h3>Absence Request</h3>
            <div className="row register-form">
              <div className="col-md-6">
                <form onSubmit={this.SendRegisterRequest} noValidate>
                  <div className="type">
                    <Autocomplete
                      id="combo-box-demo"
                      value={this.state.typeId}
                      options={this.state.types}
                      style={{ width: 400 }}
                      onChange={this.handleType}
                      onKeyUp={this.handleKeyUp}
                      renderInput={params => (
                        <TextField {...params} label="Choose type" variant="outlined" fullWidth
                          name="typeId"
                          className={formErrors.typeId.length > 0 ? "error" : null}
                          onKeyUp={this.handleKeyUp}
                        />
                      )}
                    />
                  </div>
                  <div className="datePicker">
                    Date:
                <DateRangePicker
                      onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                      onFocusChange={this.onFocusChange}
                      focusedInput={focusedInput}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </div>
                  <div className="description">
                    <label htmlFor="description">Comment: </label>
                    <textarea
                      className={formErrors.description.length > 0 ? "error" : null}
                      rows="7"
                      placeholder="Comment"
                      type="text"
                      name="description"
                      noValidate
                      onChange={this.handleChange}
                      onKeyUp={this.handleKeyUp}

                    />
                    {formErrors.description.length > 0 && (
                      <span className="errorMessage">{formErrors.description}</span>
                    )}
                  </div>
                  <hr />
                  <Button disabled={this.state.disabled} className="createAccount" type="submit">Create</Button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-2 absence-img">

          </div>
        </div>
        <Footer />

      </div>
    );
  }
}

export default AbsenceRequest;