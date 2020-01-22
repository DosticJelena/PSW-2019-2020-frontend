import React from 'react';
import { Button} from 'react-bootstrap';
import axios from 'axios';
import Header from '../../Header/Header';
import {NotificationManager} from 'react-notifications';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router';


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


class EditExaminationReport extends React.Component {

  constructor(props){
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.publishExaminationReport = this.publishExaminationReport.bind(this);

      this.state = {
        examinationReport: {
            timeCreated: "",
            comment: "",
            prescriptions: [],
            appointment: {}
        },
        formErrors: {
            comment: "",
            diagnosisId: "",
            drugIds: "",            
        },
        diagnosisList: [
          {
            id: null,
            name: "",
            description: "",
            examinationReports: [],
            version: null
          }
        ],
        drugsList: [],
        comment: "",
        diagnosisId: {},
        drugIds: [
        ],
        disabled: true
      }
   }

   componentDidMount () {
    axios.get('http://localhost:8080/api/cc-admin/get-all-diagnosis', {
      responseType: 'json'
    })
          .then(response => {
            this.setState({diagnosisList: response.data});
            console.log(this.state.diagnosisList)
    })
    .catch((error) => console.log)

    axios.get('http://localhost:8080/api/cc-admin/get-all-drugs', {
      responseType: 'json'
    })
          .then(response => {
            this.setState({drugsList: response.data});
            console.log(this.state.drugsList)

    })
    .catch((error) => console.log(error))

    const examinationReportId = window.location.pathname.split("/")[2];


    axios.get('http://localhost:8080/api/examination-report/get-examination-report/' + examinationReportId, { 
      responseType: 'json'
    })
          .then(response => {
            this.setState({examinationReport: response.data});
            var examinationReport = {...this.state.examinationReport}
            examinationReport.timeCreated = examinationReport.timeCreated[0] + "-" + examinationReport.timeCreated[1] + "-" + examinationReport.timeCreated[2] + " " + examinationReport.timeCreated[3] + ":" + examinationReport.timeCreated[4];
            
            if (examinationReport.lastEdited != null){
              examinationReport.lastEdited = examinationReport.lastEdited[0] + "-" + examinationReport.lastEdited[1] + "-" + examinationReport.lastEdited[2] + " " + examinationReport.lastEdited[3] + ":" + examinationReport.lastEdited[4];
            }
            this.setState({examinationReport});

            this.setState({
              comment: examinationReport.comment
            });

            this.setState({
              diagnosisId: examinationReport.diagnosis
            });

            this.setState({
              drugIds: examinationReport.drugs
            });
            
            console.log(this.state)
    })
    .catch((error) => console.log(error))

  }

  publishExaminationReport = event => {
      event.preventDefault();
      const examinationReportId = window.location.pathname.split("/")[2];
      let drugIds = this.state.drugIds.map(a => a.id);
      console.log(this.state);
      if (formValid(this.state)) {
          axios.put("http://localhost:8080/api/examination-report/edit/" + examinationReportId, {
            comment: this.state.comment,
            diagnosisId: this.state.diagnosisId.id,
            drugIds: drugIds
        }).then((resp) => {NotificationManager.success('Examination Report Edited', 'Success', 3000);
        this.props.history.push('/doctor-calendar');
      }) 
        .catch((error)=> {NotificationManager.error('System error.', 'Error', 3000);})
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
        if (this.state.comment != "" && this.state.diagnosisId.length !=0 && this.state.drugIds.length != 0){
          this.setState({disabled: false});
          console.log('enabled');
        }
        else {
          this.setState({disabled: true});
          console.log('disabled');
        }
    }
  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "comment":
        formErrors.comment =
              value.length < 10 ? "minimum 10 characaters required" : "";
            break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value}, () => console.log(this.state));
    
    this.checkEnabled();

  }
  

  handleDiagnosis = (e, values) => {
    e.preventDefault();

    let formErrors = { ...this.state.formErrors };

    formErrors.diagnosisId = values == null ? "You must input a diagnosis" : ""

    this.setState({ formErrors, diagnosisId: values}, () => console.log(this.state));

    this.checkEnabled();

  }

  handleDrugIds = (e, values) => {
    e.preventDefault();

    let formErrors = { ...this.state.formErrors};

    formErrors.drugIds = values.length == 0 ? "You must input at least one drug" : ""

    this.setState({ formErrors, drugIds: values}, () => console.log(this.state));

    this.checkEnabled();
  }

  render() {
      const { examinationReport, formErrors } = this.state;
      
      return (
        <div className="RegisterNewCCAdmin">
        <Header/> 
            <div className="row register-form">
                <div className="col-md-6">
                <form onSubmit={this.publishExaminationReport} noValidate>
                <span>
                  <em>
                    Patient: <strong>{examinationReport.patient}</strong>
                  </em>
                  <br></br>
                  <em>
                    Created: <strong>{examinationReport.timeCreated}</strong>
                  </em>
                  <br></br>
                  <em>
                    Last Edited: <strong>{examinationReport.lastEdited != null ? examinationReport.lastEdited : "Never"}</strong>
                  </em>
                </span>
                <div className="comment"><br></br>
                <label htmlFor="comment">Comment: </label>
              <TextField
                        value={this.state.comment}
                        style={{ width: 550 }}
                        id="outlined-multiline-flexible"
                        name="comment"
                        label="Add comment"
                        multiline
                        rows="10"
                        variant="outlined"
                        onChange={this.handleChange}

              />
              {formErrors.comment.length > 0 && (
                <span className="errorMessage">{formErrors.comment}</span>
                )}
            </div>
            <div className="diagnosisId">
              <label htmlFor="diagnosisId">Diagnosis: </label>
              <Autocomplete
                id="combo-box-demo"
                value={this.state.diagnosisId}
                options={this.state.diagnosisList}
                getOptionLabel={option => option.name}
                style={{ width: 400 }}
                onChange={this.handleDiagnosis}
                renderInput={params => (
                    <TextField {...params} label="Choose diagnosis" variant="outlined" fullWidth
                    name="diagnosisId"
                    className={formErrors.diagnosisId.length > 0 ? "error" : null}
                    />
                )}
                />
                {formErrors.diagnosisId.length > 0 && (
                <span className="errorMessage">{formErrors.diagnosisId}</span>
                )}

            </div>
            <div className="drugIds">
              <label htmlFor="drugIds">Drugs: </label>
              <Autocomplete
                    multiple
                    value={this.state.drugIds}
                    id="tags-outlined"
                    options={this.state.drugsList}
                    getOptionLabel={option => option.name}
                    filterSelectedOptions
                    style={{ width: 400 }}
                    onChange={this.handleDrugIds}
                    className={this.state.drugIds.length > 0 ? "error" : null}
                    renderInput={params => (
                    <TextField
                        name="drugIds"
                        {...params}
                        variant="outlined"
                        label="Choose drugs"
                        fullWidth
                    />
                    )}
                    
                />
                {formErrors.drugIds.length > 0 && (
                <span className="errorMessage">{formErrors.drugIds}</span>
                )}
            </div>
                <hr/>
                <Button disabled={this.state.disabled} className="publishExaminationReport" type="submit">Create</Button>
                </form>
                </div>
            </div>
      </div>
  );
}
}

export default withRouter (EditExaminationReport);