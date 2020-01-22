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
import ClinicPage from './Content/Clinic/ClinicPage'
import PredefinedExaminations from './Content/Clinic/PredefinedExaminations/PredefinedExaminations'
import Drug from './Content/Codebook/Drug/Drug';
import Diagnosis from './Content/Codebook/Diagnosis/Diagnosis';
import ReservationRequests from './Content/ClinicAdmin/RegistrationRequests/ReservationRequests';

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
        <Route exact path="/">
            <Login />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/my-profile">
            <PersonalProfile />
          </Route>
          <Route path="/nurse">
            <Nurse />
          </Route>
          <Route path="/doctor">
            <Doctor />
          </Route>
          <Route path="/patients">
            <PatientsList />
          </Route>
          <Route path="/absence-request">
            <AbsenceRequest />
          </Route>
          <Route path="/new-appointment-doctor">
            <NewAppointmentDoctor />
          </Route>
          <Route path="/work-calendar">
            <WorkCalendar />
          </Route>
          <Route path="/patient">
            <Patient />
          </Route>
          <Route path="/clinics">
            <ClinicsList />
          </Route>
          <Route path="/appointment-history">
            <AppointmentHistory />
          </Route>
          <Route path="/medical-record">
            <MedicalRecord />
          </Route>
          <Route path="/ccadmin">
            <CCAdmin />
          </Route>
          <Route path="/clinic-admin">
            <ClinicAdmin />
          </Route>
          <Route path="/quick-reservation">
            <QuickReservation />
          </Route>
          <Route path="/edit-personal-page">
            <EditPersonalProfile />
          </Route>
          <Route path="/assign-ccadmin">
            <NonCCAdmins />
          </Route>
          <Route path="/change-password">
            <ChangePassword />
          </Route>
          <Route path="/clinic">
            <ClinicPage />
          </Route>
          <Route path="/predefined-examinations">
            <PredefinedExaminations />
          </Route>
          <Route path="/drugs">
            <Drug />
          </Route>
          <Route path="/diagnosis">
            <Diagnosis />
          </Route>
          <Route path="/register-ccadmin">
            <RegisterNewCCAdmin/>
          </Route>
          <Route path="/reservation-requests">
            <ReservationRequests />
          </Route>
          <Route path="/ccadmin-registration-requests">
            <CCAdminRegistrationRequests/>
          </Route>
          <Route path="/register-clinic">
            <RegisterClinic/>
          </Route>
          <Route path="/doctor-calendar">
            <DoctorCalendar/>
          </Route>
          <Route path="/authenticate-prescriptions">
            <Prescriptions/>
          </Route>
          <Route path="/examination-report">
            <ExaminationReport/>
          </Route>
          <Route path="/verify">
            <VerifyEmail/>
          </Route>
          <Route path="/doctor-calendar-event">
            <CalendarEventClickWindow/>
          </Route>
          <Route path="/medical-card">
            <MedicalCard/>
          </Route>
          <Route path="/edit-examination-report">
            <EditExaminationReport/>
          </Route>
          <Route path="/ordinations">
            <Ordinations/>
          </Route>
        </Switch>
        <NotificationContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
