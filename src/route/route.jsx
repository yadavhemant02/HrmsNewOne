import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import HomeLayout from "../homeLayout/HomeLayout";
import Checkin from "../pages/attendence/Checkin";
import Checkout from "../pages/attendence/Checkout";
import Monitor from "../pages/hrMonitor/Monitor";
import Dashcard from "../pages/hrMonitor/Dashcard";
import Mainlayout from "../Mainlayout/Mainlayout";
import Attendance from "../pages/hrMonitor/Attendance";
import Details from "../pages/hrMonitor/Details";
import Interview from "../pages/hrMonitor/Interview";
import Feedback from "../pages/hrMonitor/Feedback";
import Approval from "../pages/hrMonitor/Approval";
import Dash from "../pages/hrMonitor/Dash";
import AllProject from "../pages/hrMonitor/project/AllProject";
import AddProject from "../pages/hrMonitor/project/AddProject";
import DetailsProjectId from "../pages/hrMonitor/project/details/DetailsProjectId";
import MainLayoutEmp from "../mainLayoutEmp/MainLayoutEmp";
import AttendenceEmp from "../pages/attendence/dashboard/AttendenceEmp";
import Profile from "../pages/attendence/dashboard/Profile";
import Dashboard from "../pages/attendence/dashboard/Dashboard";
import Project from "../pages/attendence/projectEmp/Project";
import ProjectEmpDetails from "../pages/attendence/projectEmp/ProjectEmpDetails";
import ToatalEmp from "../pages/hrMonitor/project/dash/ToatalEmp";
import AddJobPage from "../pages/hrMonitor/AddJob";
import AddJob from "../pages/hrMonitor/jobManagment/AddJob";
import ShowJob from "../pages/hrMonitor/jobManagment/ShowJob";
import ShowAnJob from "../pages/hrMonitor/jobManagment/ShowAnJob";
import EmpInfo from "../pages/attendence/profile/EmpInfo";
import LeaveManagement from "../pages/attendence/leaveSection/LeaveManagement";
import LeaveDetails from "../pages/attendence/leaveSection/LeaveDetails";
import LeaveRequestData from "../pages/hrMonitor/dashCardSection/LeaveRequestData";
import LeaveRequestShow from "../pages/hrMonitor/dashCardSection/LeaveRequestShow";
import ShowInterview from "../pages/hrMonitor/dashCardSection/ShowInterview";
import InterviewEmpShow from "../pages/attendence/interviewSection/InterviewEmpShow";
import DocumentUploadForm from "../pages/attendence/profile/DocumentUploadForm";
import { DataProvider } from "../ContextApi/AuthData";
import EmpAllTrack from "../pages/hrMonitor/monitorDashBord/EmpAllTrack";
import ShowAllPayslip from "../pages/hrMonitor/payslip/ShowAllPayslip";
import ShowCandidate from "../pages/hrMonitor/jobManagment/ShowCandidate";
import ShowAnCandidateDtails from "../pages/hrMonitor/jobManagment/ShowAnCandidateDtails";
import FeedbackEmp from "../pages/attendence/interviewSection/FeedbackEmp";
import InterviewFeedback from "../pages/hrMonitor/dashCardSection/InterviewFeedback";
import CandidateResultsList from "../pages/hrMonitor/dashCardSection/CandidateResultsList";
import EmpPaySlip from "../pages/attendence/EmpPaySlip/EmpPaySlip";
import DocumentVerification from "../pages/hrMonitor/dashCardSection/Documents/DocumentVerification";
import Register from "../pages/auth/Register";
import LoginPage from "../pages/auth/LoginPage";
import OtpPage from "../pages/auth/OtpPage";
import ApplicationManager from "../pages/hrMonitor/project/ApplicationManager";
import Landing from "../pages/LandingPage/Landing";

import HrCore from "../pages/NavbarHover/HrCore";
import Onboarding from "../pages/NavbarHover/Onboarding";
import PayrollMgmt from "../pages/NavbarHover/PayrollMgmt";
import Recruitment from "../pages/NavbarHover/Recruitment";
import TaskManagement from "../pages/NavbarHover/TaskManagement";
import Performance from "../pages/NavbarHover/Performance";
import JobRequisition from "../pages/NavbarHover/JobRequisition";
import CandidateManagement from "../pages/NavbarHover/CandidateManagement";
import CareerPage from "../pages/NavbarHover/CareerPage";
import ReportAndAnalytics from "../pages/NavbarHover/ReportAndAnalytics";
import PreBoarding from "../pages/NavbarHover/PreBoarding";
import CandidateSourcing from "../pages/NavbarHover/CandidateSourcing";
import Surveys from "../pages/NavbarHover/Surveys";
import Support from "../pages/NavbarHover/Support";
import OfferLetter from "../pages/hrMonitor/generateLetter/OfferLetter";
import SalarySlip from "../pages/hrMonitor/generateLetter/payslip/SalarySlip";
import IncrementLetter from "../pages/hrMonitor/generateLetter/increamentletter/IncrementLetter";
import ReleasingLetter from "../pages/hrMonitor/generateLetter/realeasingletter/ReleasingLetter";
import AddressProofLetter from "../pages/hrMonitor/generateLetter/addressproof/AddressProofLetter";
import AttendanceLanding from "../pages/NavbarHover/AttendanceLanding";
import EmployeesList from "../pages/hrMonitor/UserManagement/EmployeesList";
import Unauthorized from "../components/common/Unauthorized";
import OfferLetterEmpList from "../pages/hrMonitor/generateLetter/OfferLetterEmpList";
import ViewOfferLetter from "../pages/hrMonitor/generateLetter/ViewOfferLetter";
import SalarySlipEmpList from "../pages/hrMonitor/generateLetter/payslip/SalarySlipEmpList";
import AllSalarySlipEmp from "../pages/hrMonitor/generateLetter/payslip/AllSalarySlipEmp";
import IncreamentEmpList from "../pages/hrMonitor/generateLetter/increamentletter/IncreamentEmpList";
import GenerateNewOfferLetter from "../pages/hrMonitor/generateLetter/GenerateNewOfferLetter";
import OfferLetterEditNew from "../pages/hrMonitor/generateLetter/OfferLetterEditNew";
import ViewNewOfferLetter from "../pages/hrMonitor/generateLetter/ViewNewOfferLetter";
import ReleasingLetterEmpList from "../pages/hrMonitor/generateLetter/realeasingletter/ReleasingLetterEmpList";
import ReleavingLetterNew from "../pages/hrMonitor/generateLetter/realeasingletter/ReleavingLetterNew";
import AddressProofEmpList from "../pages/hrMonitor/generateLetter/addressproof/AddressProofEmpList";
import AddressProofNew from "../pages/hrMonitor/generateLetter/addressproof/AddressProofNew";
import AllIncreamentLetterEmpList from "../pages/hrMonitor/generateLetter/increamentletter/AllIncreamentLetterEmpList";
import Contact from "../pages/NavbarHover/Contact";
import LeaveManage from "../pages/NavbarHover/LeaveManage";
import OurStory from "../pages/NavbarHover/OurStory";
import NotificationHrDetails from "../components/hrMonitorComponent/notification/NotificationHrDetails";
import ViewOffLetter from "../pages/attendence/downloadsSection/ViewOffLetter";
import AllSalarySlipList from "../pages/attendence/downloadsSection/payslip/AllSalarySlipList";
import AllIncrementLeter from "../pages/attendence/downloadsSection/incrementletter/AllIncrementLeter";
import AllRelievingLetterList from "../pages/attendence/downloadsSection/relievingleterdownload/AllRelievingLetterList";
import AllAddressprrofList from "../pages/attendence/downloadsSection/addressproofdownload/AllAddressprrofList";
import ExperienceLetterEmpList from "../pages/hrMonitor/generateLetter/experienceletter/ExperienceLetterEmpList";
import ExperienceLetter from "../pages/hrMonitor/generateLetter/experienceletter/ExperienceLetter";
import AllExperienceLetterList from "../pages/attendence/downloadsSection/experienceleter/AllExperienceLetterList";
import ShowApiKey from "../pages/hrMonitor/jobManagment/ShowApiKey";
import CandidateForm from "../pages/hrMonitor/jobManagment/CandidateForm";
import OfferLetterPending from "../pages/hrMonitor/OfferLetterPending";
import UserPerspective from "../pages/perspective/UserPerspective";
import AddPerspectivePage from "../pages/perspective/AddPerspectivePage";
import MyPerspective from "../pages/perspective/MyPerspective";


// Define roles for different route groups
const HR_ROLE = "HR";
const COMPANY_ROLE = "COMPANY";
const EMPLOYEE_ROLE = "EMP";
const PUBLIC_ROUTES = null; // No role required

// Admin roles (HR and COMPANY have same access)
const ADMIN_ROLES = [HR_ROLE, COMPANY_ROLE, EMPLOYEE_ROLE];

const router = createBrowserRouter([

  {
        path: "/candidate-form/:organizationCode/:jobId/:apikey",
        element: <CandidateForm />
      },
  ,
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login-page",
    element: <LoginPage />,
  },
  {
    path: "/otp-page",
    element: <OtpPage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "hr-core",
        element: <HrCore />,
      },
      {
        path: "onboarding",
        element: <Onboarding />,
      },
      {
        path: "attendanceland",
        element: <AttendanceLanding />,
      },
      {
        path: "payrollmgmt",
        element: <PayrollMgmt />,
      },
      {
        path: "recruitment",
        element: <Recruitment />,
      },
      {
        path: "performance",
        element: <Performance />,
      },
      {
        path: "taskmgmt",
        element: <TaskManagement />,
      },
      {
        path: "jobrequisition",
        element: <JobRequisition />,
      },
      {
        path: "candidatesourcing",
        element: <CandidateSourcing />,
      },
      {
        path: "candmanagement",
        element: <CandidateManagement />,
      },
      {
        path: "preboarding",
        element: <PreBoarding />,
      },
      {
        path: "careerpage",
        element: <CareerPage />,
      },
      {
        path: "report",
        element: <ReportAndAnalytics />,
      },
      {
        path: "surveys",
        element: <Surveys />,
      },
      {
        path: "support",
        element: <Support />,
      },
       {
        path: "contact",
        element: <Contact />,
      },
       {
        path: "leave-management",
        element: <LeaveManage />,
      },
      {
        path: "ourstory",
        element: <OurStory />,
      },
    ],
  },
  {
    path: "/dashboard-emp",
    element: (
      <ProtectedRoute requiredRole={ADMIN_ROLES}>
        <DataProvider>
          <MainLayoutEmp />
        </DataProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendence-emp",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AttendenceEmp />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-perspective",
        element: (
          <ProtectedRoute >
            <MyPerspective />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-perspective/add",
        element: (
          <ProtectedRoute>
            <AddPerspectivePage />
          </ProtectedRoute>
        ),
      },  
      {
        path: "project-emp",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <Project />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-pay-slip",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <EmpPaySlip />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-info",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <EmpInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-doc-upload",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <DocumentUploadForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-leave",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <LeaveManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "feedback-emp",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <FeedbackEmp />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-leave-details",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <LeaveDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "detail-project-emp/:projectId",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <ProjectEmpDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "interview-emp",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <InterviewEmpShow />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-off-letter",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <ViewOffLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-increment-letter-list",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AllIncrementLeter />
          </ProtectedRoute>
        ),
      },
       {
        path: "view-sal-slip-list",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AllSalarySlipList />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-releasing-emp-list",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AllRelievingLetterList />
          </ProtectedRoute>  
        ),
      },
      {
        path: "all-addressproof-emp-list",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AllAddressprrofList />
          </ProtectedRoute>  
        ),
      },
      {
        path: "all-experience-emp-list",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <AllExperienceLetterList />
          </ProtectedRoute>  
        ),
      },
      {
        path: "checkin",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <Checkin />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute requiredRole={EMPLOYEE_ROLE}>
            <Checkout />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard-hr",
    element: (
      <ProtectedRoute requiredRole={ADMIN_ROLES}>
        <Mainlayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Dashcard />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-interview",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowInterview />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-perspective",
        element: (
          <ProtectedRoute >
            <UserPerspective />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-perspective/add",
        element: (
          <ProtectedRoute>
            <AddPerspectivePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "monitor",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Monitor />
          </ProtectedRoute>
        ),
      },
      {
        path: "Document-verification",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <DocumentVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: "notification-details-hr",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <NotificationHrDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "leave-monitor",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <LeaveRequestData />
          </ProtectedRoute>
        ),
      },
      {
        path: "leave-monitor-show",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <LeaveRequestShow />
          </ProtectedRoute>
        ),
      },
      {
        path: "dash",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Dash />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-project",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AllProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-jobs",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-an-candidate/:candidateId",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowAnCandidateDtails />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-jobs",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-api-key/:jobId",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowApiKey />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "show-payslip",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowAllPayslip />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-candidate/:jobId",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowCandidate />
          </ProtectedRoute>
        ),
      },
      {
        path: "candidate-results-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <CandidateResultsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "pending-offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <OfferLetterPending />
          </ProtectedRoute>
        ),
      },
      {
        path: "interview-feedback",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <InterviewFeedback />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <EmployeesList />
          </ProtectedRoute>
        ),
      },
      {
        path: "show-an-jobs/:jobId",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ShowAnJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "emp-all-track/:empCode",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <EmpAllTrack />
          </ProtectedRoute>
        ),
      },
      {
        path: "detail-project/:projectId",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <DetailsProjectId />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-project",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "application-manager",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ApplicationManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "total-emp",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ToatalEmp />
          </ProtectedRoute>
        ),
      },
      {
        path: "details/:empCode",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Details />
          </ProtectedRoute>
        ),
      },
      {
        path: "addjob",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddJobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "interview",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Interview />
          </ProtectedRoute>
        ),
      },
      {
        path: "feedback",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Feedback />
          </ProtectedRoute>
        ),
      },
      {
        path: "approval",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Approval />
          </ProtectedRoute>
        ),
      },
      {
        path: "offer-letter-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <OfferLetterEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ViewOfferLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "view-new-offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            < ViewNewOfferLetter/>
          </ProtectedRoute>
        ),
      },
      {
        path: "offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <OfferLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "generate-new-offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <GenerateNewOfferLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-new-offer-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <OfferLetterEditNew />
          </ProtectedRoute>
        ),
      },
      {
        path: "salary-slip",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <SalarySlip />
          </ProtectedRoute>
        ),
      },
      {
        path: "salary-slip-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <SalarySlipEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-salary-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AllSalarySlipEmp />
          </ProtectedRoute>
        ),
      },
      {
        path: "increment-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <IncrementLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "increment-letter-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <IncreamentEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-increment-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AllIncreamentLetterEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "realeaving-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ReleasingLetter />
          </ProtectedRoute>
        ),
      },{
        path: "realeaving-letter-new",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ReleavingLetterNew />
          </ProtectedRoute>
        ),
      },
      {
        path: "releasing-letter-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ReleasingLetterEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "address-proof-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddressProofLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "address-proof-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddressProofEmpList />
          </ProtectedRoute>
        ),
      },
      {
        path: "address-proof-new",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <AddressProofNew />
          </ProtectedRoute>
        ),
      },
      {
        path: "experience-letter-emp-list",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ExperienceLetterEmpList />
          </ProtectedRoute>
        ),
      },{
        path: "experience-letter",
        element: (
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <ExperienceLetter />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;