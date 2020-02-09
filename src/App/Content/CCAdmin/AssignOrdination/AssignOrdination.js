import React from 'react';
import { Button} from 'react-bootstrap';
import axios from 'axios';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Footer from '../../Footer/Footer';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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


class AssignOrdination extends React.Component {

  constructor(props){
      super(props);

      this.handleDoctorIds = this.handleDoctorIds.bind(this);
      this.assignOrdination = this.assignOrdination.bind(this);

      this.state = {
        appointment: {},
        doctorIds: [],
        formErrors: {
            doctorIds: "",            
        },
        ordination: {},
        doctors: [],
        disabled: true,
        appointmentId: "",
        ordinationId: ""
      }
   }

   componentDidMount () {

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const appointmentId = params.get('appointmentId');
    const ordinationId = params.get('ordinationId');

    this.setState({appointmentId: appointmentId});
    this.setState({ordinationId: ordinationId});



    axios.get('http://localhost:8080/api/appointment/get-appointment-clinic-admin/' + appointmentId, {
      responseType: 'json'
    })
          .then(response => {
            this.setState({appointment: response.data});

            var appointment = {...this.state.appointment}
            appointment.start = (new Date(appointment.start)).toISOString().slice(5, 16).replace(/-/g, "/").replace("T", " ");
            appointment.end = (new Date(appointment.end)).toISOString().slice(5, 16).replace(/-/g, "/").replace("T", " ");

            this.setState({appointment});
            console.log(this.state.appointment);
    })
    .catch((error) => console.log(error))

    axios.get('http://localhost:8080/api/appointment/get-specialized-doctors/' + appointmentId, {
      responseType: 'json'
    })
          .then(response => {
            this.setState({doctors: response.data});
    })
    .catch((error) => console.log(error))

    axios.get('http://localhost:8080/api/appointment/get-ordination/' + ordinationId, {
      responseType: 'json'
    })
          .then(response => {
            this.setState({ordination: response.data});
    })
    .catch((error) => console.log(error))
  }

  assignOrdination = event => {
      event.preventDefault();
      console.log(this.state);
      if (formValid(this.state)) {
          axios.post("http://localhost:8080/api/ordination/assign-operation-ordination", {
            appointmentId: this.state.appointmentId,
            ordinationId: this.state.ordinationId,
            doctorIds: this.state.doctorIds
        }).then((resp) => {NotificationManager.success('Ordination Assigned', 'Success', 5000);
        this.props.history.push('/clinic-admin');
      }) 
      .catch((error)=> {NotificationManager.error(error.response.data, 'Error', 5000)    })
      }
      else {
        NotificationManager.error('Wrong form input. Please input the correct strings.', 'Error', 3000);
      } 
  }

  checkEnabled = () => {

    var empty = true;

    Object.keys(this.state.formErrors).forEach(e => 
      {if(this.state.formErrors[e] != ""){
        empty = false;
      }
    });

    if (!empty){
        this.setState({disabled: true});
        console.log('disabled');
    }
    else{
        if (this.state.doctorIds.length == 0){
          this.setState({disabled: false});
          console.log('enabled');
        }
        else {
          this.setState({disabled: true});
          console.log('disabled');
        }
    }
  }

  handleDoctorIds = (e, values) => {
    e.preventDefault();

    let result = values.map(a => a.id);

    let formErrors = { ...this.state.formErrors};

    formErrors.doctorIds = values.length == 0 ? "You must select at least one doctor" : ""

    this.setState({ formErrors, doctorIds: result}, () => console.log(this.state));

    this.checkEnabled();
  }

  render() {
      const { appointment, formErrors } = this.state;
      
      var path = "/new-appointment-doctor/" + appointment.patientId;

      console.log(this.state);

      return (
        <div className="RegisterNewCCAdmin">
        <Header/> 
            <div className="row register-form">
                <div className="col-md-6">
                <form onSubmit={this.assignOrdination} noValidate>
                <span>
                  <strong style={{ color: 'red' }}>{appointment.title}</strong>
                  <em>
                  <hr></hr>
                    <br></br> Appointment Start: <em style={{ color: 'red' }}>{appointment.start}</em>
                    <br></br> Appointment End: <em style={{ color: 'red' }}>{appointment.end}</em>
                    <br></br> Appointment Ordination: <em style={{ color: 'red' }}>{this.state.ordination.number}</em>
                    <br></br> Appointment Patient: <em style={{ color: 'red' }}>{appointment.patient} </em>
                  </em>
                </span>
            <div>
            <div className="doctorIds">
              <label htmlFor="doctorIds">Doctors: </label>
              <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    disableCloseOnSelect
                    options={this.state.doctors}
                    getOptionLabel={option => option.firstName + " " + option.lastName}
                    style={{ width: 400 }}
                    onChange={this.handleDoctorIds}
                    className={this.state.doctorIds.length > 0 ? "error" : null}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.firstName + " " + option.lastName}
                      </React.Fragment>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                />
                {formErrors.doctorIds.length > 0 && (
                <span className="errorMessage">{formErrors.doctorIds}</span>
                )}
            </div>
            <hr></hr>
                <div className="buttons">
                  <Button disabled={this.state.disabled} className="publishExaminationReport" type="submit">Assign</Button>
                  </div>
                  </div>
                </form>
                </div>
            </div>
            <Footer/>
      </div>
  );
}
}

export default withRouter (AssignOrdination);