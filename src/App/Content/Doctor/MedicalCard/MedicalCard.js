import React from 'react';
import Header from '../../Header/Header';
import axios from 'axios';
import { withRouter } from 'react-router';
import Footer from '../../Footer/Footer';
import Button from '@material-ui/core/Button';
import "react-table/react-table.css";
import ReactTable from "react-table";
import {NotificationManager} from 'react-notifications';

const heightRegex = RegExp(
    /^(\d*\.?\d+)\s*(cm)$/
);

const weightRegex = RegExp(
    /^(\d*\.?\d+)\s*(kg)$/
);

class MedicalCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            saveDisabled: false,
            buttonEditHidden: false,
            buttonSaveHidden: true,
            buttonCancelHidden: true,
            height: "",
            weight: "",
            bloodType: "",
            allergies: "",
            medicalCard: {
                id: "",
                patient: {},
                height: "",
                weight: "",
                bloodType: "",
                allergies: "",
                examinationReports: []
            },
            formErrors: {
                height: "",
                weight: "",
                bloodType: "",
                allergies: ""
            }
        }

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.editExaminationReport = this.editExaminationReport.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

    }

    editExaminationReport = (id) => {
        this.props.history.push("/edit-examination-report/" + id);
    }

    handleEditClick = () => {
        this.setState({
            disabled: false,
            buttonEditHidden: true,
            buttonSaveHidden: false,
            buttonCancelHidden: false,
        });
    }

    handleCancelClick = () => {
        const patientId = window.location.pathname.split("/")[2];
        axios.get('http://localhost:8080/api/medicalRecords/' + patientId, {
          responseType: 'json'
        })
              .then(response => {
                this.setState({medicalCard: response.data});
                this.setState({height: response.data.height});
                this.setState({weight: response.data.weight});
                this.setState({bloodType: response.data.bloodType});
                this.setState({allergies: response.data.allergies});
                this.setState({
                    disabled: true,
                    buttonEditHidden: false,
                    buttonSaveHidden: true,
                    buttonCancelHidden: true,
                });
                this.setState({
                    formErrors: {
                         height: "",
                weight: "",
                bloodType: "",
                allergies: ""
                    }
                });

                console.log(this.state);
        })
        .catch((error) => console.log(error))
    }

    handleSaveClick = () => {
        axios.post("http://localhost:8080/api/medicalRecords/save", {
            patientId: this.state.medicalCard.patient.id,
            height: this.state.height,
            weight: this.state.weight,
            bloodType: this.state.bloodType,
            allergies: this.state.allergies
        }).then((resp) => {
          NotificationManager.success('Medical Record Information has been changed successfully', '', 3000);
        }) 
        .catch((error)=> {
          NotificationManager.error('System error. Please try again later.', 'Error', 3000);
        })

        this.setState({
            disabled: true,
            buttonEditHidden: false,
            buttonSaveHidden: true,
            buttonCancelHidden: true,
        });
    }

    handleChange = e => {
        e.preventDefault();
        const {name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "height":
    
            formErrors.height =
            value.length < 2 ? "minimum 2 digits required" : "";

            if (formErrors.height === ""){  
                formErrors.height =
                value > 240 ? "maximum value allowed is 240cm" : "";
            }
            break;
          case "weight":
            
            formErrors.weight =
            value.length < 2 ? "minimum 2 digits required" : "";
            
            if (formErrors.weight === ""){  
                formErrors.weight =
                value > 300 ? "maximum value allowed is 300kg" : "";
            }
            break;
          case "bloodType":
            formErrors.bloodType =
            value.length < 1 ? "minimum 1 character required" : "";
            
            if (formErrors.bloodType === ""){  
                formErrors.bloodType =
                value.length > 3 ? "maximum 3 character allowed" : "";
            }
            break;
          case "allergies":
            formErrors.allergies =
              value.length < 3 ? "minimum 3 characaters required" : "";
            break;
          default:
            break;
        }
        
        if ((name === 'height' || name === 'weight') && value.length > 0){
            this.setState({ formErrors, [name]: parseInt(value) }, () => console.log(this.state));
        }
        else {
            this.setState({ formErrors, [name]: value }, () => console.log(this.state));
        }
      }

    componentDidMount () {    
        const patientId = window.location.pathname.split("/")[2];
        axios.get('http://localhost:8080/api/medicalRecords/' + patientId, {
          responseType: 'json'
        })
              .then(response => {
                this.setState({medicalCard: response.data});
                this.setState({height: response.data.height});
                this.setState({weight: response.data.weight});
                this.setState({bloodType: response.data.bloodType});
                this.setState({allergies: response.data.allergies});
                console.log(this.state);
        })
        .catch((error) => console.log(error))
    
      }

    handleKeyUp = () => {
        
        var empty = true;

        Object.keys(this.state.formErrors).forEach(e => 
        {if(this.state.formErrors[e] != ""){
            empty = false;
        }
        });

        if (!empty){
            this.setState({saveDisabled: true});
            console.log('disabled');
        }
        else{

            if (this.state.height != "" && this.state.weight != "" && this.state.bloodType != ""
            && this.state.allergies)
            {
                this.setState({saveDisabled: false});
                console.log('enabled');
            }
            else {
                this.setState({saveDisabled: true});
                console.log('disabled');
            }
        }
    }

    render() {
        const { formErrors } = this.state;

        return(
            <div className="CalendarEventClickWindow">
            <Header/>

            <div className="patientInfo">
                <h1>{this.state.medicalCard.patient.firstName} {this.state.medicalCard.patient.lastName}</h1>
                </div>
            <div className="mainWindow">
                <div className="height">
                <label htmlFor="height">Height: </label>
                <input
                    disabled={this.state.disabled}
                    value={this.state.height}
                    onKeyUp={this.handleKeyUp}
                    className={formErrors.height.length > 0 ? "error" : null}
                    placeholder="Height"
                    type="height"
                    name="height"
                    noValidate
                    onChange={this.handleChange}
                /> cm
                {formErrors.height.length > 0 && (
                    <span className="errorMessage">{formErrors.height}</span>
                )}
                </div>

                <div className="weight">
                <label htmlFor="weight">Weight: </label>
                <input
                    disabled={this.state.disabled}
                    value={this.state.weight}
                    onKeyUp={this.handleKeyUp}
                    className={formErrors.weight.length > 0 ? "error" : null}
                    placeholder="Weight"
                    type="weight"
                    name="weight"
                    noValidate
                    onChange={this.handleChange}
                /> kg
                {formErrors.weight.length > 0 && (
                    <span className="errorMessage">{formErrors.weight}</span>
                )}
                </div>

                <div className="bloodType">
                <label htmlFor="bloodType">Blood Type: </label>
                <input
                    disabled={this.state.disabled}
                    value={this.state.bloodType}
                    onKeyUp={this.handleKeyUp}
                    className={formErrors.bloodType.length > 0 ? "error" : null}
                    placeholder="Blood Type"
                    type="bloodType"
                    name="bloodType"
                    noValidate
                    onChange={this.handleChange}
                />
                {formErrors.bloodType.length > 0 && (
                    <span className="errorMessage">{formErrors.bloodType}</span>
                )}
                </div>

                <div className="allergies">
                <label htmlFor="allergies">Allergies: </label>
                <input
                    disabled={this.state.disabled}
                    value={this.state.allergies}
                    onKeyUp={this.handleKeyUp}
                    className={formErrors.allergies.length > 0 ? "error" : null}
                    placeholder="Allergies"
                    type="allergies"
                    name="allergies"
                    noValidate
                    onChange={this.handleChange}
                />
                {formErrors.allergies.length > 0 && (
                    <span className="errorMessage">{formErrors.allergies}</span>
                )}
                </div>

                { this.state.buttonEditHidden === false ? (
                <Button className="editData" onClick={this.handleEditClick}>Edit</Button>
                ) : null
                }

                { this.state.buttonCancelHidden === false ? (
                <Button className="cancelData" onClick={this.handleCancelClick}>Cancel</Button>
                ) : null
                }

                { this.state.buttonSaveHidden === false ? (
                <Button disabled={this.state.saveDisabled} className="saveData" onClick={this.handleSaveClick}>Save</Button>
                ) : null
                }

            </div>
            <div className="tabela">
                <h4>Examination Reports signed by you for this patient</h4>
            <ReactTable 
                data={this.state.medicalCard.examinationReports}
                //loading={this.state.loading}
                //onFetchData={this.fetchData} // Request new data when things change
                columns={[{
                            Header: 'Date created',
                            accessor: 'timeCreated',
                        },
                        {
                            Header: 'Edit',
                            Cell: row => (                        
                            <div>
                                <button className="btn primary" onClick={() => this.editExaminationReport(row.original.id)}>Edit</button>
                            </div>
                            ),
                        }
                ]}
                defaultPageSize = {10}
            />
            </div>
            <Footer/>
            </div>
        );

    }
}
export default withRouter(MedicalCard);

