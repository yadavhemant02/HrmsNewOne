import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
  Stack,
  styled,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import GradingIcon from '@mui/icons-material/Grading';
import PeopleIcon from "@mui/icons-material/People";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LocalHospitalTwoTone } from "@mui/icons-material";
import axios from "axios";
import { base_emp, base_hr, base_identity, base_Ip } from "../../http/services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GradientBox = styled(Box)(({ startColor, endColor }) => ({
  background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
  borderRadius: "16px",
  padding: "20px",
  color: "white",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledMetricCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "white",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  borderRadius: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
  "& .MuiCardContent-root": {
    padding: theme.spacing(3),
  },
}));

const ColoredAvatar = styled(Avatar)(({ bgColor }) => ({
  background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
  width: 56,
  height: 56,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
}));

const StyledButton = styled(Button)(({ bgcolor, hoverColor }) => ({
  backgroundColor: bgcolor,
  color: "white",
  padding: "8px 20px",
  borderRadius: "12px",
  textTransform: "none",
  boxShadow: "0 4px 15px 0 rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: hoverColor,
    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
  },
}));

const MetricCard = ({
  icon: Icon,
  title,
  value,
  comparison,
  change,
  color,
  progress,
  onCandidate
}) => {
  // const isPositive = change > 0;

  // const handleView = (title) => {
  //   console.log("Clicked card title:", title);
  //   // You can add navigation logic here based on the title
  //   if(title==="Leave Management"){
  //      navigator("/dashboard-hr/leave-monitor");
  //   }
  // };

  const navigate = useNavigate(); // Initialize useNavigate hook
  const isPositive = change > 0;

  const handleView = (title) => {
    console.log("Clicked card title:", title);
    switch (title) {
      case "Leave Management":
        navigate("/dashboard-hr/leave-monitor");
        break;
      case "Interview Scheduled":
        navigate("/dashboard-hr/show-interview");
        break;
      case "Generate Offer Letter":
        // navigate("/dashboard-hr/pending-offer-letter");
          navigate("/dashboard-hr/pending-offer-letter", { state: { onCandidate } });
        break;
      case "Interview Schedule":
        navigate("/dashboard-hr/interview-schedule");
        break;
      // Add other cases for different titles
      case "Approval Pending":
        navigate("/dashboard-hr/candidate-results-list");
        break;
      case "Interview Feedback":
          navigate("/dashboard-hr/interview-feedback");
          break;
      case "Document Verification":
         navigate("/dashboard-hr/Document-verification")      
      default:
        console.log("No route defined for:", title);
    }
  };

  return (
    <StyledMetricCard>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <ColoredAvatar bgColor={color}>
            <Icon sx={{ fontSize: 28, color: "white" }} />
          </ColoredAvatar>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          {value}
          {comparison && (
            <Typography
              component="span"
              color="text.secondary"
              variant="body1"
              sx={{ ml: 1 }}
            >
              /{comparison}
            </Typography>
          )}
        </Typography>

        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleView(title)} // Fixed: Added proper onClick handler
          >
            View
          </Button>
        </Box>
      </CardContent>
    </StyledMetricCard>
  );
};

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #003396 0%, #86CEFA 100%)",
  color: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "300px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    transform: "translate(50%, -50%)",
  },
}));

const Dashcard = () => {
  const [profileImage, setProfileImage] = useState("");
  const [todayLeave, setTodayLeave] = useState(0);
  const [activeLeave, setActiveLeave] = useState(0);

  const userDetails = useSelector((state) => state.auth.user);

  const [document,setDocument] = useState([]);
  const leaveTrack = async () => {
    try {
      const response2 = await axios.get(
      `${base_emp}/emp-handler/documents/get/all-emp-doctumnets-data?organizationCode=${userDetails.organizationCode}`
    );
    console.log(response2,"ooooooooooooooooooooooooooooooooooooooooo",response2.data.result.length)
    setDocument(response2.data.result.length)
      const response = await axios.get(
        `${base_emp}/emp-handler/leave/approved-leave/of-emp/activeleave?organizationCode=${userDetails.organizationCode}`
      );
      const response1 = await axios.get(
        `${base_emp}/emp-handler/leave/approved-leave/of-emp/all?organizationCode=${userDetails.organizationCode}`
      );



      console.log(response,response1)


      setActiveLeave(response.data.result.length);

      console.log(response.data.result.length,"oooooouccccccccccccc")
      setTodayLeave(response1.data.result.length);
      console.log(todayLeave, activeLeave, "llllllliiiiiiiiiiiiiiiii");
    } catch (error) {
      console.log(error);
    }
  };

  const [noOfInterview, setNoOfInterview] = useState(0);
  const trackInterview = async () => {
    try {
      //upcoming
      const response = await axios.get(
        `${base_hr}/hr-handler/interview/get-all/interview/upcoming?organizationCode=${localStorage.getItem('organizationCode')}`
        // http://192.168.1.32:7002/hr-handler/interview/get-all/interview/all?organizationCode=HRHaaTCKD0
      );
      console.log(response, "jjjjjjjjjjjj");
      setNoOfInterview(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

const [feedback, setFeedback] = useState(0);
const [approval, setApproval] = useState(0);

const tractFeedBack = async () => {
  try {
    const response = await axios.get(
      `${base_hr}/hr-handler/feedback/get/all/panding-feedback/pending?organizationCode=${localStorage.getItem("organizationCode")}`
    );

    const response2 = await axios.get(`${base_hr}/hr-handler/result/show-all/panding-result`)
    setApproval(response2.data.length)
    setFeedback(response.data.length);
  } catch (error) {
    console.log(error);
  }
};


const [onCandidate,setOnCandidate]  =  useState([]);
const getAllOnboardingData = async()=>{
  try {
     const response  = await axios.get(`${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`)

     const data = response.data.filter((item)=>item.current=="NEW");
    //  console.log(response,"llllllllll");
     setOnCandidate(data);
  } catch (error) {
    console.log(error);
  }
}


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `${base_emp}/emp-handler/image/get-emp-image?empCode=${localStorage.getItem(
            "empCode"
          )}`
        );
        setProfileImage(`data:image/jpeg;base64,${response.data.result}`);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImage("");
      }
    };

    fetchProfileImage();
    leaveTrack();
    trackInterview();
    tractFeedBack();
    getAllOnboardingData();
  }, []);

  const metrics = [
    {
      icon: CalendarTodayIcon,
      title: "Interview Scheduled",
      value: noOfInterview,
      comparison: "",
      change: 2.1,
      color: "#FF5722",
      progress: 92,
    },
    {
      icon: GradingIcon,
      title: "Interview Feedback",
      value: feedback,
      comparison: "",
      change: -2.1,
      color: "#37474F",
      progress: 85,
    },
    // {
    //   icon: PeopleIcon,
    //   title: "Approval Pending",
    //   value: approval,
    //   comparison: "",
    //   change: -11.2,
    //   color: "#2196F3",
    //   progress: 69,
    // },
    {
      icon: CheckBoxIcon,
      title: "Generate Offer Letter",
      value: onCandidate.length,
      comparison: "",
      change: 11.2,
      color: "#E91E63",
      progress: 75,
    },
    {
      icon: AssignmentIndIcon,
      title: "Appointment Letter",
      value: "0",
      change: 10.2,
      color: "#9C27B0",
      progress: 80,
    },
    {
      icon: WorkIcon,
      title: "Document Verification",
      value: document,
      comparison: "",
      change: -2.1,
      color: "#37474F",
      progress: 85,
    },
    {
      icon: ModelTrainingIcon,
      title: "Training Management",
      value: "0",
      change: 2.1,
      color: "#F44336",
      progress: 65,
    },
    {
      icon: EventRepeatIcon,
      title: "Leave Management",
      value: todayLeave,
      change: 2.1,
      color: "#4CAF50",
      progress: 88,
    },
    {
      icon: PersonIcon,
      title: "Project Allocation",
      value: "0",
      comparison: "0",
      change: -11.2,
      color: "#212121",
      progress: 72,
    },
  ];
  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="700" color="#1a237e">
          HR Dashboard
        </Typography>
        <Tooltip title="Notifications">
          <IconButton
            sx={{
              bgcolor: "white",
              boxShadow: "0 2px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <WelcomeCard sx={{ mb: 4 }}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  border: "3px solid rgba(255,255,255,0.2)",
                }}
                src={profileImage}
              />
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                  Welcome Back, {localStorage.getItem("name")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label="0 Pending Approvals"
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                  <Chip
                    label={`${activeLeave} Active Leave Request`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={2}>
              <StyledButton
                startIcon={<AddIcon />}
                bgcolor="#33616E"
                hoverColor="#2a4f5a"
              >
                Add Project
              </StyledButton>
              <StyledButton
                startIcon={<AddIcon />}
                bgcolor="#ff9800"
                hoverColor="#f57c00"
              >
                Add Request
              </StyledButton>
            </Stack>
          </Box>
        </CardContent>
      </WelcomeCard>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashcard;
