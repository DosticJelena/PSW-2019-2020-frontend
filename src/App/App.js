import React from 'react';
import './App.css';
import {BrowserRouter } from 'react-router-dom'
import {Switch, Route} from 'react-router'
import Register from './LoginAndRegistration/Register/Register'
import Login from './LoginAndRegistration/Login/Login'
import Nurse from './Content/Nurse/Nurse'
import Doctor from './Content/Doctor/Doctor'
import PatientsList from './Content/PatientsList/PatientsList'
import AbsenceRequest from './Content/Doctor/AbsenceRequest/AbsenceRequest';
import NewAppointmentDoctor from './Content/Doctor/NewAppointmentDoctor/NewAppointmentDoctor';
import PersonalProfile from './Content/PersonalProfile/PersonalProfile';
import WorkCalendar from './Content/WorkCalendar/WorkCalendar';
import Patient from './Content/Patient/Patient';
import ClinicsList from './Content/ClinicsList/ClinicsList';
import AppointmentHistory from './Content/MedicalRecord/AppointmentHistory/AppointmentHistory';
import MedicalRecord from './Content/MedicalRecord/MedicalRecord';
import CCAdmin from './Content/CCAdmin/CCAdmin';
import ClinicAdmin from './Content/ClinicAdmin/ClinicAdmin';
import QuickReservation from './Content/ClinicAdmin/QuickReservation/QuickReservation';
import EditPersonalProfile from './Content/PersonalProfile/EditPersonalProfile';
import NonCCAdmins from './Content/CCAdmin/Tables/NonCCAdmins'
import ChangePassword from './LoginAndRegistration/ChangePassword/ChangePassword';
import ClinicPage from './Content/Clinic/ClinicPage';
import BusinessReport from './Content/Clinic/BusinessReport/BusinessReport';
import PredefinedExaminations from './Content/Clinic/PredefinedExaminations/PredefinedExaminations'
import Drug from './Content/Codebook/Drug/Drug';
import Diagnosis from './Content/Codebook/Diagnosis/Diagnosis';
import DoctorsList from './Content/DoctorsList/DoctorsList';
import ReservationRequests from './Content/ClinicAdmin/ReservationRequests/ReservationRequests';
import EditClinicPage from './Content/Clinic/EditClinicPage/EditClinicPage';


// React Notification
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import RegisterNewCCAdmin from './Content/CCAdmin/RegisterNewCCAdmin/RegisterNewCCAdmin';
import CCAdminRegistrationRequests from './Content/CCAdmin/RegistationRequests/CCAdminRegistrationRequests';
import RegisterClinic from './Content/CCAdmin/RegisterClinic/RegisterClinic';
import DoctorCalendar from './Content/Doctor/Calendar/DoctorCalendar';
import Prescriptions from './Content/Nurse/AuthenticatePrescriptions/Prescriptions';
import ExaminationReport from './Content/Doctor/ExaminationReport/ExaminationReport';
import VerifyEmail from './LoginAndRegistration/VerifyEmail/VerifyEmail';
import CalendarEventClickWindow from './Content/Doctor/CalendarEventClickWindow/CalendarEventClickWindow';
import MedicalCard from './Content/Doctor/MedicalCard/MedicalCard';
import EditExaminationReport from './Content/Doctor/ExaminationReport/EditExaminationReport';
import Ordinations from './Content/Ordinations/Ordinations';
import RegisterClinicAdmin from './Content/CCAdmin/RegisterClinicAdmin/RegisterClinicAdmin';
import RequestLeaveNurse from './Content/Nurse/RequestLeave/RequestLeaveNurse';
import NurseCalendar from './Content/Nurse/NurseCalendar/NurseCalendar';
import Doctors from './Content/Doctors/Doctors';
import SchedulingForm from './Content/Patient/SchedulingForm/SchedulingForm';
import AppointmentTypes from './Content/AppointmentTypes/AppointmentTypes';
import PatientProfile from './Content/PatientsList/PatientProfile/PatientProfile';
import AbsenceRequests from './Content/ClinicAdmin/AbsenceRequests/AbsenceRequests';
import AssignOrdination from './Content/CCAdmin/AssignOrdination/AssignOrdination';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
        <Route exact path="/" component={Login}>
          </Route>
          <Route path="/login" component={Login}>
          </Route>
          <Route path="/register" component={Register}>
          </Route>
          <Route path="/my-profile" component={PersonalProfile}>
          </Route>
          <Route path="/nurse" component={Nurse}>
          </Route>
          <Route path="/doctor" component={Doctor}>
          </Route>
          <Route path="/patients" component={PatientsList}>
          </Route>
          <Route path="/absence-request" component={AbsenceRequest}>
          </Route>
          <Route path="/new-appointment-doctor" component={NewAppointmentDoctor}/>
          <Route path="/work-calendar" component={WorkCalendar}>
          </Route>
          <Route path="/patient" component={Patient}>
          </Route>
          <Route path="/clinics" component={ClinicsList}>
          </Route>
          <Route path="/doctors" component={Doctors}>
          </Route>
          <Route path="/appointment-types" component={AppointmentTypes}>
          </Route>
          <Route path="/appointment-history" component={AppointmentHistory}>
          </Route>
          <Route path="/medical-record" component={MedicalRecord}>
          </Route>
          <Route path="/ccadmin" component={CCAdmin}>
          </Route>
          <Route path="/clinic-admin" component={ClinicAdmin}>
          </Route>
          <Route path="/absence-requests" component={AbsenceRequests}>
          </Route>
          <Route path="/quick-reservation" component={QuickReservation}>
          </Route>
          <Route path="/edit-personal-page" component={EditPersonalProfile}>
          </Route>
          <Route path="/assign-ccadmin" component={NonCCAdmins}>
          </Route>
          <Route path="/change-password" component={ChangePassword}>
          </Route>
          <Route path="/clinic" component={ClinicPage}>
          </Route>
          <Route path='/edit-clinic' component={EditClinicPage} />
          <Route path="/business-report"component={BusinessReport}/>
          <Route path="/predefined-examinations" component={PredefinedExaminations}>
          </Route>
          <Route path="/drugs" component={Drug}>
          </Route>
          <Route path="/diagnosis" component={Diagnosis}>
          </Route>
          <Route path="/register-ccadmin" component={RegisterNewCCAdmin}>
          </Route>
          <Route path="/reservation-requests" component={ReservationRequests}>
          </Route>
          <Route path="/ccadmin-registration-requests" component={CCAdminRegistrationRequests}>
          </Route>
          <Route path="/register-clinic" component={RegisterClinic}>
          </Route>
          <Route path="/doctor-calendar" component={DoctorCalendar}>
          </Route>
          <Route path="/authenticate-prescriptions" component={Prescriptions}>
          </Route>
          <Route path="/doctors-list" component={DoctorsList}>
		  </Route>
          <Route path="/examination-report" component={ExaminationReport}>
          </Route>
          <Route path="/verify" component={VerifyEmail}>
          </Route>
          <Route path="/doctor-calendar-event" component={CalendarEventClickWindow}>
          </Route>
          <Route path="/medical-card" component={MedicalCard}>
          </Route>
          <Route path="/patient-profile" component={PatientProfile}>
          </Route>
          <Route path="/edit-examination-report" component={EditExaminationReport}>
          </Route>
          <Route path="/ordinations" component={Ordinations}>
          </Route>
          <Route path="/register-clinic-admin" component={RegisterClinicAdmin}>
          </Route>
          <Route path="/request-leave-nurse" component={RequestLeaveNurse}>
          </Route>
          <Route path="/nurse-calendar" component={NurseCalendar}>
          </Route>
          <Route path="/scheduling-form" component={SchedulingForm}>
          </Route>
          <Route path="/assign-ordination" component={AssignOrdination}>
          </Route>
        </Switch>
        <NotificationContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
