import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  TextField,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import FlightIcon from "@mui/icons-material/Flight";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useSelector } from "react-redux";
import { base_emp } from "../../../http/services";

// Styled component for file upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function StepperComponent() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // const handleOpen = (file) => {
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl(url);
  //     setPreviewFile(file);
  //     setOpen(true);
  //   }
  // };

  const handleOpen = async (file, fileName) => {
    console.log(fileName, "ppppppppppppp");
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewFile(file);
      setOpen(true);
    } else if (fileName) {
      try {
        const fullFileName = `${credentials.email}/${fileName}`;
        const response = await axios.get(
          `${base_emp}/emp-handler/documents/stream-document-by-fileName?fileName=${encodeURIComponent(
            fileName
          )}`,
          { responseType: "blob" }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);

        setPreviewUrl(url);
        setPreviewFile({ name: fileName, type: blob.type });
        setOpen(true);
      } catch (error) {
        console.error("Error fetching file:", error);
        setNotification({
          open: true,
          message: "Error loading file. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setPreviewFile(null);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Basic Information",
    "Identity Information",
    "Education",
    "Experience",
    "Certificates",
  ];
  const credentials = useSelector(
    (state) => state.credential?.credential || {}
  );

  // API data state
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (credentials.empCode) {
          const response = await axios.get(
            `${base_emp}/emp-handler/documents/get/emp-doctumnet?userCode=${localStorage.getItem(
              "empCode"
            )}`
          );

          console.log(response, "kkkkkkkkkkkkkkkkkkkk");
          if (response.data.status === 201) {
            console.log(response, "kkkkkkkkkkkkkkkkkkkkooooooooooooooooooo");
            setUserData(response.data.result);
            populateFormWithUserData(response.data.result);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setNotification({
          open: true,
          message: "Error loading your profile data. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [credentials.empCode]);

  const populateFormWithUserData = (data) => {
    // Populate basic info
    if (data.basicInfo && data.basicInfo.basicInfo) {
      const basicInfo = data.basicInfo.basicInfo;
      setBasicInfoForm({
        firstName: basicInfo[0] || "",
        middleName: basicInfo[1] || "",
        lastName: basicInfo[2] || "",
        mobileNumber: basicInfo[3] || "",
        dateOfBirth: basicInfo[4] || "",
        email: basicInfo[5] || "",
        address: basicInfo[6] || "",
      });
    }

    // Populate identity info
    if (data.identityInfo) {
      setIdentityInfoForm({
        panCard: data.identityInfo.panCardNumber
          ? data.identityInfo.panCardNumber[0]
          : "",
        panCardFile: null,
        panCardFileName: data.identityInfo.panCardNumber
          ? data.identityInfo.panCardNumber[1]
          : "",

        aadharCard: data.identityInfo.AadharCardNumber
          ? data.identityInfo.AadharCardNumber[0]
          : "",
        aadharCardFile: null,
        aadharCardFileName: data.identityInfo.AadharCardNumber
          ? data.identityInfo.AadharCardNumber[1]
          : "",

        drivingLicense: data.identityInfo.Drivinglicence
          ? data.identityInfo.Drivinglicence[0]
          : "",
        drivingLicenseFile: null,
        drivingLicenseFileName: data.identityInfo.Drivinglicence
          ? data.identityInfo.Drivinglicence[1]
          : "",

        passportNumber: data.identityInfo.passport
          ? data.identityInfo.passport[0]
          : "",
        passportFile: null,
        passportFileName: data.identityInfo.passport
          ? data.identityInfo.passport[1]
          : "",
      });
    }

    // Populate education info
    if (data.education) {
      const newEducationForm = { ...educationForm };

      // 10th School
      if (data.education["10th School"]) {
        const highSchoolData = data.education["10th School"];
        newEducationForm.highSchool = {
          schoolName: highSchoolData[2] || "",
          yearOfPassing: highSchoolData[3] || "",
          percentage: highSchoolData[4] || "",
          marksheetFile: null,
          marksheetName: highSchoolData[5] || "",
        };
      }

      // 12th School
      if (data.education["12th School"]) {
        const higherSecondaryData = data.education["12th School"];
        newEducationForm.higherSecondary = {
          schoolName: higherSecondaryData[2] || "",
          yearOfPassing: higherSecondaryData[3] || "",
          percentage: higherSecondaryData[4] || "",
          marksheetFile: null,
          marksheetName: higherSecondaryData[5] || "",
        };
      }

      // Bachelor's Degree
      if (data.education["Bachelor's Degree"]) {
        const bachelorData = data.education["Bachelor's Degree"];
        newEducationForm.degree = {
          collegeName: bachelorData[1] || "",
          university: bachelorData[5] || "",
          startDate: bachelorData[2] || "",
          endDate: bachelorData[3] || "",
          percentage: bachelorData[4] || "",
          marksheetFile: null,
          marksheetName: bachelorData[6] ? bachelorData[6] : "",
        };
      }

      // Master's Degree
      if (data.education["Master's Degree"]) {
        const masterData = data.education["Master's Degree"];
        newEducationForm.masters = {
          collegeName: masterData[1] || "",
          university: masterData[5] || "",
          startDate: masterData[2] || "",
          endDate: masterData[3] || "",
          percentage: masterData[4] || "",
          marksheetFile: null,
          marksheetName: masterData[6] ? masterData[6] : "", // No filename in this case
        };
      }

      // PhD
      if (data.education["PhD"]) {
        const phdData = data.education["PhD"];
        newEducationForm.phd = {
          collegeName: phdData[1] || "",
          university: phdData[5] || "",
          startDate: phdData[2] || "",
          endDate: phdData[3] || "",
          percentage: phdData[4] || "",
          researchTopic: phdData[6] || "",
          marksheetFile: null,
          marksheetName: phdData[7] ? phdData[7] : "", // No filename in this case
        };
      }

      setEducationForm(newEducationForm);
    }

    // Populate experience info
    if (data.experience) {
      const experienceArray = Object.keys(data.experience).map((key) => {
        const exp = data.experience[key];
        return {
          companyName: exp[0] || "",
          position: exp[1] || "",
          startDate: exp[2] || "",
          endDate: exp[3] || "",
          description: exp[4] || "",
        };
      });

      if (experienceArray.length > 0) {
        setExperienceForm(experienceArray);
      }
    }

    // Populate certificate info
    if (data.certification) {
      const certificationArray = Object.keys(data.certification).map((key) => {
        const cert = data.certification[key];
        return {
          name: cert[0] || "",
          issuedBy: cert[1] || "",
          date: cert[2] || "",
          certificateFile: null,
          certificateName: cert[3] || "",
        };
      });

      if (certificationArray.length > 0) {
        setCertificateForm(certificationArray);
      }
    }
  };

  // Basic Information Form
  const [basicInfoForm, setBasicInfoForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    dateOfBirth: "",
    email: "",
    address: "",
  });

  // Identity Information Form - Added passport fields
  const [identityInfoForm, setIdentityInfoForm] = useState({
    panCard: "",
    panCardFile: null,
    panCardFileName: "",
    aadharCard: "",
    aadharCardFile: null,
    aadharCardFileName: "",
    drivingLicense: "",
    drivingLicenseFile: null,
    drivingLicenseFileName: "",
    passportNumber: "",
    passportFile: null,
    passportFileName: "",
  });

  // Form states - Added start and end dates to education sections
  const [educationForm, setEducationForm] = useState({
    highSchool: {
      schoolName: "",
      yearOfPassing: "",
      percentage: "",
      marksheetFile: null,
      marksheetName: "",
    },
    higherSecondary: {
      schoolName: "",
      yearOfPassing: "",
      percentage: "",
      marksheetFile: null,
      marksheetName: "",
    },
    degree: {
      collegeName: "",
      university: "",
      startDate: "",
      endDate: "",
      percentage: "",
      marksheetFile: null,
      marksheetName: "",
    },
    masters: {
      collegeName: "",
      university: "",
      startDate: "",
      endDate: "",
      percentage: "",
      marksheetFile: null,
      marksheetName: "",
    },
    phd: {
      collegeName: "",
      university: "",
      startDate: "",
      endDate: "",
      researchTopic: "",
      marksheetFile: null,
      marksheetName: "",
    },
  });

  const [experienceForm, setExperienceForm] = useState([
    {
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [certificateForm, setCertificateForm] = useState([
    {
      name: "",
      issuedBy: "",
      date: "",
      certificateFile: null,
      certificateName: "",
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Handle basic info form changes
  const handleBasicInfoChange = (field, value) => {
    setBasicInfoForm({
      ...basicInfoForm,
      [field]: value,
    });

    // Clear error when user types
    if (errors[`basicInfo_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`basicInfo_${field}`];
      setErrors(newErrors);
    }
  };

  // Handle identity info form changes
  const handleIdentityInfoChange = (field, value) => {
    setIdentityInfoForm({
      ...identityInfoForm,
      [field]: value,
    });

    // Clear error when user types
    if (errors[`identityInfo_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`identityInfo_${field}`];
      setErrors(newErrors);
    }
  };

  // Handle identity document uploads
  const handleIdentityFileUpload = (field, file) => {
    if (file) {
      const fileNameField = `${field}Name`;
      setIdentityInfoForm({
        ...identityInfoForm,
        [field]: file,
        [fileNameField]: file.name,
      });

      // Clear error when user uploads
      if (errors[`identityInfo_${field}`]) {
        const newErrors = { ...errors };
        delete newErrors[`identityInfo_${field}`];
        setErrors(newErrors);
      }
    }
  };

  // Handle file uploads for education section
  const handleFileUpload = (section, field, file) => {
    if (file) {
      setEducationForm({
        ...educationForm,
        [section]: {
          ...educationForm[section],
          marksheetFile: file,
          marksheetName: file.name,
        },
      });
    }
  };

  // Handle file uploads for certificates
  const handleCertificateFileUpload = (index, file) => {
    if (file) {
      const newCertificates = [...certificateForm];
      newCertificates[index] = {
        ...newCertificates[index],
        certificateFile: file,
        certificateName: file.name,
      };
      setCertificateForm(newCertificates);
    }
  };

  // Handle education form changes
  const handleEducationChange = (section, field, value) => {
    setEducationForm({
      ...educationForm,
      [section]: {
        ...educationForm[section],
        [field]: value,
      },
    });

    // Clear error when user types
    if (errors[`${section}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${section}_${field}`];
      setErrors(newErrors);
    }
  };

  // Handle experience form changes
  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...experienceForm];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value,
    };
    setExperienceForm(newExperiences);

    // Clear error when user types
    if (errors[`experience_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`experience_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  // Handle certificate form changes
  const handleCertificateChange = (index, field, value) => {
    const newCertificates = [...certificateForm];
    newCertificates[index] = {
      ...newCertificates[index],
      [field]: value,
    };
    setCertificateForm(newCertificates);

    // Clear error when user types
    if (errors[`certificate_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`certificate_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  // Add more experience fields
  const addExperience = () => {
    setExperienceForm([
      ...experienceForm,
      {
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Remove experience field
  const removeExperience = (index) => {
    if (experienceForm.length > 1) {
      setExperienceForm(experienceForm.filter((_, i) => i !== index));
    }
  };

  // Add more certificate fields
  const addCertificate = () => {
    setCertificateForm([
      ...certificateForm,
      {
        name: "",
        issuedBy: "",
        date: "",
        certificateFile: null,
        certificateName: "",
      },
    ]);
  };

  // Remove certificate field
  const removeCertificate = (index) => {
    if (certificateForm.length > 1) {
      setCertificateForm(certificateForm.filter((_, i) => i !== index));
    }
  };

  const educationFile = useMemo(() => {
    return [
      educationForm.highSchool.marksheetFile,
      educationForm.higherSecondary.marksheetFile,
      educationForm.degree.marksheetFile,
      educationForm.masters.marksheetFile,
      educationForm.phd.marksheetFile,
    ].filter((file) => file !== null);
  }, [educationForm]);

  // Validate basic information form
  const validateBasicInfoForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!basicInfoForm.firstName)
      newErrors.basicInfo_firstName = "First name is required";
    if (!basicInfoForm.lastName)
      newErrors.basicInfo_lastName = "Last name is required";
    if (!basicInfoForm.mobileNumber)
      newErrors.basicInfo_mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(basicInfoForm.mobileNumber))
      newErrors.basicInfo_mobileNumber =
        "Please enter a valid 10-digit mobile number";
    if (!basicInfoForm.dateOfBirth)
      newErrors.basicInfo_dateOfBirth = "Date of birth is required";
    if (!basicInfoForm.email) newErrors.basicInfo_email = "Email is required";
    else if (!emailRegex.test(basicInfoForm.email))
      newErrors.basicInfo_email = "Please enter a valid email address";
    if (!basicInfoForm.address)
      newErrors.basicInfo_address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate identity information form
  const validateIdentityInfoForm = () => {
    const newErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadharRegex = /^[0-9]{12}$/;
    const dlRegex = /^[A-Z0-9]{8,16}$/;
    const passportRegex = /^[A-Z][0-9]{7}$/; // Basic passport format (example: A1234567)

    if (!identityInfoForm.panCard)
      newErrors.identityInfo_panCard = "PAN Card number is required";
    else if (!panRegex.test(identityInfoForm.panCard))
      newErrors.identityInfo_panCard =
        "Please enter a valid PAN Card number (e.g., ABCDE1234F)";
    if (!identityInfoForm.panCardFile && !identityInfoForm.panCardFileName)
      newErrors.identityInfo_panCardFile = "PAN Card copy is required";

    if (!identityInfoForm.aadharCard)
      newErrors.identityInfo_aadharCard = "Aadhar Card number is required";
    else if (!aadharRegex.test(identityInfoForm.aadharCard))
      newErrors.identityInfo_aadharCard =
        "Please enter a valid 12-digit Aadhar Card number";
    if (
      !identityInfoForm.aadharCardFile &&
      !identityInfoForm.aadharCardFileName
    )
      newErrors.identityInfo_aadharCardFile = "Aadhar Card copy is required";

    if (
      identityInfoForm.drivingLicense &&
      !dlRegex.test(identityInfoForm.drivingLicense)
    )
      newErrors.identityInfo_drivingLicense =
        "Please enter a valid Driving License number";

    // Validate passport fields
    if (
      identityInfoForm.passportNumber &&
      !passportRegex.test(identityInfoForm.passportNumber)
    )
      newErrors.identityInfo_passportNumber =
        "Please enter a valid Passport number (e.g., A1234567)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate education form
  const validateEducationForm = () => {
    const newErrors = {};

    // Validate high school
    if (!educationForm.highSchool.schoolName)
      newErrors.highSchool_schoolName = "School name is required";
    if (!educationForm.highSchool.yearOfPassing)
      newErrors.highSchool_yearOfPassing = "Year of passing is required";
    if (!educationForm.highSchool.percentage)
      newErrors.highSchool_percentage = "Percentage is required";
    if (
      !educationForm.highSchool.marksheetFile &&
      !educationForm.highSchool.marksheetName
    )
      newErrors.highSchool_marksheetFile = "High school marksheet is required";

    // Validate higher secondary
    if (!educationForm.higherSecondary.schoolName)
      newErrors.higherSecondary_schoolName = "School name is required";
    if (!educationForm.higherSecondary.yearOfPassing)
      newErrors.higherSecondary_yearOfPassing = "Year of passing is required";
    if (!educationForm.higherSecondary.percentage)
      newErrors.higherSecondary_percentage = "Percentage is required";
    if (
      !educationForm.higherSecondary.marksheetFile &&
      !educationForm.higherSecondary.marksheetName
    )
      newErrors.higherSecondary_marksheetFile =
        "Higher secondary marksheet is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate experience form
  const validateExperienceForm = () => {
    const newErrors = {};

    experienceForm.forEach((exp, index) => {
      if (!exp.companyName)
        newErrors[`experience_${index}_companyName`] =
          "Company name is required";
      if (!exp.position)
        newErrors[`experience_${index}_position`] = "Position is required";
      if (!exp.startDate)
        newErrors[`experience_${index}_startDate`] = "Start date is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate certificate form
  const validateCertificateForm = () => {
    const newErrors = {};

    certificateForm.forEach((cert, index) => {
      if (!cert.name)
        newErrors[`certificate_${index}_name`] = "Certificate name is required";
      if (!cert.issuedBy)
        newErrors[`certificate_${index}_issuedBy`] =
          "Issuing authority is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updated handleSaveAndNext function with proper API call
  const handleSaveAndNext = async () => {
    // First validate the current step
    let isValid = false;
    switch (activeStep) {
      case 0:
        isValid = validateBasicInfoForm();
        break;
      case 1:
        isValid = validateIdentityInfoForm();
        break;
      case 2:
        isValid = validateEducationForm();
        break;
      case 3:
        isValid = validateExperienceForm();
        break;
      case 4:
        isValid = validateCertificateForm();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      try {
        // Create FormData for API call
        const formData = new FormData();

        // Include step number in the form data
        formData.append("stepNumber", activeStep.toString());
        formData.append("userCode", localStorage.getItem("empCode") || "");
        formData.append("email", localStorage.getItem("email") || "");

        // Prepare and append data based on current step
        switch (activeStep) {
          case 0: // Basic Information
            const basicInfoKeyArray = [
              [
                basicInfoForm.firstName,
                basicInfoForm.middleName,
                basicInfoForm.lastName,
                basicInfoForm.mobileNumber,
                basicInfoForm.dateOfBirth,
                basicInfoForm.email,
                basicInfoForm.address,
              ],
            ];

            formData.append("basicInfoKey", JSON.stringify(basicInfoKeyArray));
            formData.append(
              "organizationCode",
              localStorage.getItem("organizationCode")
            );
            break;

          case 1:
            const identityInfoArray = [
              [
                identityInfoForm.aadharCard,
                identityInfoForm.aadharCardFileName,
              ],
              [identityInfoForm.panCard, identityInfoForm.panCardFileName],
              [
                identityInfoForm.drivingLicense || "",
                identityInfoForm.drivingLicenseFileName,
              ],
              [
                identityInfoForm.passportNumber || "",
                identityInfoForm.passportFileName,
              ],
            ];

            formData.append(
              "identityInfoKey",
              JSON.stringify(identityInfoArray)
            );
            if (identityInfoForm.aadharCardFile) {
              formData.append(
                "identityInfoFile",
                identityInfoForm.aadharCardFile
              );
            } else {
              formData.append(
                "identityInfoFile",
                new File([""], "educationFile.pdf")
              );
            }
            if (identityInfoForm.panCardFile) {
              formData.append("identityInfoFile", identityInfoForm.panCardFile);
            } else {
              formData.append(
                "identityInfoFile",
                new File([""], "educationFile.pdf")
              );
            }
            if (identityInfoForm.drivingLicenseFile) {
              formData.append(
                "identityInfoFile",
                identityInfoForm.drivingLicenseFile
              );
            } else {
              formData.append(
                "identityInfoFile",
                new File([""], "educationFile.pdf")
              );
            }
            if (identityInfoForm.passportFile) {
              formData.append(
                "identityInfoFile",
                identityInfoForm.passportFile
              );
            } else {
              formData.append(
                "identityInfoFile",
                new File([""], "educationFile.pdf")
              );
            }
            break;

          case 2:
            const highSchoolData = [
              "10th School",
              educationForm.highSchool.marksheetName,
              educationForm.highSchool.schoolName,
              educationForm.highSchool.yearOfPassing,
              educationForm.highSchool.percentage,
              educationForm.highSchool.marksheetName,
            ];

            const higherSecondaryData = [
              "12th School",
              educationForm.higherSecondary.marksheetName,
              educationForm.higherSecondary.schoolName,
              educationForm.higherSecondary.yearOfPassing,
              educationForm.higherSecondary.percentage,
              educationForm.higherSecondary.marksheetName,
            ];

            const bachelorData = [
              "Bachelor's Degree",
              educationForm.degree.collegeName,
              educationForm.degree.startDate,
              educationForm.degree.endDate,
              educationForm.degree.percentage,
              educationForm.degree.university,
              educationForm.degree.marksheetName,
            ];

            const masterData = [
              "Master's Degree",
              educationForm.masters.collegeName,
              educationForm.masters.startDate,
              educationForm.masters.endDate,
              educationForm.masters.percentage,
              educationForm.masters.university,
              educationForm.masters.marksheetName,
            ];

            const phdData = [
              "PhD",
              educationForm.phd.collegeName,
              educationForm.phd.startDate,
              educationForm.phd.endDate,
              educationForm.phd.percentage,
              educationForm.phd.university,
              educationForm.phd.researchTopic,
              educationForm.phd.marksheetName,
            ];

            formData.append(
              "educationKey",
              JSON.stringify([
                highSchoolData,
                higherSecondaryData,
                bachelorData,
                masterData,
                phdData,
              ])
            );

            const educationFiles = [
              educationForm.highSchool.marksheetFile,
              educationForm.higherSecondary.marksheetFile,
              educationForm.degree.marksheetFile,
              educationForm.masters.marksheetFile,
              educationForm.phd.marksheetFile,
            ];

            educationFiles.forEach((file) => {
              if (file) {
                formData.append("educationFile", file);
              } else {
                formData.append(
                  "educationFile",
                  new File([""], "educationFile.pdf")
                );
              }
            });
            break;

          case 3: // Experience Information
            const experienceData = experienceForm.map((exp) => [
              exp.companyName,
              exp.position,
              exp.startDate,
              exp.endDate || "",
              exp.description || "",
            ]);

            formData.append("experienceKey", JSON.stringify(experienceData));

            // Adding experience files if available
            formData.append(
              "experienceFile",
              new File([""], "experience1.pdf")
            );
            formData.append(
              "experienceFile",
              new File([""], "experience2.pdf")
            );
            break;

          case 4: // Certificate Information
            const certificateData = certificateForm.map((cert) => [
              cert.name,
              cert.issuedBy,
              cert.date || "",
              cert.certificateName || "",
            ]);

            formData.append(
              "certificationKey",
              JSON.stringify(certificateData)
            );

            // Append certificate files
            certificateForm.forEach((cert) => {
              if (cert.certificateFile) {
                formData.append("certificationFile", cert.certificateFile);
              }
              // else{
              //   formData.append("certificationFile", new File([""], "educationFile.pdf"));
              // }
            });
            break;
        }

        // Make API call to save current step
        const response = await axios.post(
          `${base_emp}/emp-handler/documents/add-request/for-addvertisment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Check response status
        if (response.status === 200 || response.status === 201) {
          // Show success notification
          setNotification({
            open: true,
            message: `${steps[activeStep]} saved successfully!`,
            severity: "success",
          });

          // Move to next step if not on the last step
          if (activeStep < steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }
        } else {
          throw new Error(
            `Server responded with status code ${response.status}`
          );
        }
      } catch (error) {
        console.error(`Error saving data for step ${activeStep}:`, error);
        setNotification({
          open: true,
          message: `Error saving ${steps[activeStep]} data. Please try again.`,
          severity: "error",
        });
      }
    }
  };

  // Handle step navigation
  const handleNext = async () => {
    let isValid = false;
    switch (activeStep) {
      case 0:
        isValid = validateBasicInfoForm();
        break;
      case 1:
        isValid = validateIdentityInfoForm();
        break;
      case 2:
        isValid = validateEducationForm();
        break;
      case 3:
        isValid = validateExperienceForm();
        break;
      case 4:
        isValid = validateCertificateForm();
        if (isValid) {
          // Submit the entire form here
          console.log("Form submitted", {
            basicInfo: basicInfoForm,
            identityInfo: identityInfoForm,
            education: educationForm,
            experience: experienceForm,
            certificates: certificateForm,
          });
          const formData = new FormData();
          const highSchoolData = [
            "10th School",
            educationForm.highSchool.marksheetName,
            educationForm.highSchool.schoolName,
            educationForm.highSchool.yearOfPassing,
            educationForm.highSchool.percentage,
            educationForm.highSchool.marksheetName,
          ];

          const higherSecondaryData = [
            "12th School",
            educationForm.higherSecondary.marksheetName,
            educationForm.higherSecondary.schoolName,
            educationForm.higherSecondary.yearOfPassing,
            educationForm.higherSecondary.percentage,
            educationForm.higherSecondary.marksheetName,
          ];

          const bachelorData = [
            "Bachelor's Degree",
            educationForm.degree.collegeName,
            educationForm.degree.startDate,
            educationForm.degree.endDate,
            educationForm.degree.percentage,
            educationForm.degree.university,
            educationForm.degree.marksheetName,
          ];

          const masterData = [
            "Master's Degree",
            educationForm.masters.collegeName,
            educationForm.masters.startDate,
            educationForm.masters.endDate,
            educationForm.masters.percentage,
            educationForm.masters.university,
            educationForm.masters.marksheetName,
          ];

          const phdData = [
            "PhD",
            educationForm.phd.collegeName,
            educationForm.phd.startDate,
            educationForm.phd.endDate,
            educationForm.phd.percentage,
            educationForm.phd.university,
            educationForm.phd.researchTopic,
            educationForm.phd.marksheetName,
          ];

          formData.append(
            "educationKey",
            JSON.stringify([
              highSchoolData,
              higherSecondaryData,
              bachelorData,
              masterData,
              phdData,
            ])
          );

          const educationFiles = [
            educationForm.highSchool.marksheetFile,
            educationForm.higherSecondary.marksheetFile,
            educationForm.degree.marksheetFile,
            educationForm.masters.marksheetFile,
            educationForm.phd.marksheetFile,
          ];

          educationFiles.forEach((file) => {
            if (file) {
              formData.append("educationFile", file);
            } else {
              formData.append(
                "educationFile",
                new File([""], "educationFile.pdf")
              );
            }
          });

          // Append basic and identity information
          const basicInfoKeyArray = [
            [
              basicInfoForm.firstName,
              basicInfoForm.middleName,
              basicInfoForm.lastName,
              basicInfoForm.mobileNumber,
              basicInfoForm.dateOfBirth,
              basicInfoForm.email,
              basicInfoForm.address,
            ],
          ];

          const identityInfoArray = [
            [identityInfoForm.aadharCard, identityInfoForm.aadharCardFileName],
            [identityInfoForm.panCard, identityInfoForm.panCardFileName],
            [
              identityInfoForm.drivingLicense || "",
              identityInfoForm.drivingLicenseFileName,
            ],
            [
              identityInfoForm.passportNumber || "",
              identityInfoForm.passportFileName,
            ],
          ];

          formData.append("identityInfoKey", JSON.stringify(identityInfoArray));
          const experienceKeyArray = experienceForm.map((exp) => [
            exp.companyName,
            exp.position,
            exp.startDate,
            exp.endDate,
            exp.description,
          ]);

          const certificationKeyArray = certificateForm.map((cert) => [
            cert.name,
            cert.issuedBy,
            cert.date,
            cert.certificateName,
          ]);

          // Append all form data
          formData.append("basicInfoKey", JSON.stringify(basicInfoKeyArray));
          formData.append("experienceKey", JSON.stringify(experienceKeyArray));
          formData.append(
            "certificationKey",
            JSON.stringify(certificationKeyArray)
          );
          if (identityInfoForm.aadharCardFile) {
            formData.append(
              "identityInfoFile",
              identityInfoForm.aadharCardFile
            );
          } else {
            formData.append(
              "identityInfoFile",
              new File([""], "educationFile.pdf")
            );
          }
          if (identityInfoForm.panCardFile) {
            formData.append("identityInfoFile", identityInfoForm.panCardFile);
          } else {
            formData.append(
              "identityInfoFile",
              new File([""], "educationFile.pdf")
            );
          }
          if (identityInfoForm.drivingLicenseFile) {
            formData.append(
              "identityInfoFile",
              identityInfoForm.drivingLicenseFile
            );
          } else {
            formData.append(
              "identityInfoFile",
              new File([""], "educationFile.pdf")
            );
          }
          if (identityInfoForm.passportFile) {
            formData.append("identityInfoFile", identityInfoForm.passportFile);
          } else {
            formData.append(
              "identityInfoFile",
              new File([""], "educationFile.pdf")
            );
          }
          formData.append("experienceFile", new File([""], "experience1.pdf"));
          formData.append("experienceFile", new File([""], "experience2.pdf"));

          certificateForm.forEach((cert) => {
            if (cert.certificateFile) {
              formData.append("certificationFile", cert.certificateFile);
            }
          });

          formData.append("userCode", localStorage.getItem("empCode"));
          formData.append("email", localStorage.getItem("email"));
          formData.append("stepNumber", "noSteper");

          formData.append(
            "organizationCode",
            localStorage.getItem("organizationCode")
          );

          try {
            const response = await axios.post(
              `${base_emp}/emp-handler/documents/add-request/for-addvertisment`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              setIsSubmitted(true);
              setNotification({
                open: true,
                message: "Your profile has been successfully submitted!",
                severity: "success",
              });

              // Refresh user dat
              const updatedUserData = await axios.get(
                `${base_emp}/emp-handler/documents/get/emp-doctumnet?userCode=${credentials.empCode}`
              );
              if (updatedUserData.data.status === 201) {
                setUserData(updatedUserData.data.result);
              }
            } else {
              throw new Error(
                `Server responded with status code ${response.status}`
              );
            }
          } catch (error) {
            console.error("Error uploading data:", error);
            setNotification({
              open: true,
              message: "Error submitting your profile. Please try again.",
              severity: "error",
            });
          }
        }
        break;
      default:
        isValid = true;
    }

    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Reset the form to start again
  const handleReset = () => {
    setActiveStep(0);
    setIsSubmitted(false);
    setErrors({});
    // Reset form states
    setBasicInfoForm({
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      dateOfBirth: "",
      email: "",
      address: "",
    });

    setIdentityInfoForm({
      panCard: "",
      panCardFile: null,
      panCardFileName: "",
      aadharCard: "",
      aadharCardFile: null,
      aadharCardFileName: "",
      drivingLicense: "",
      drivingLicenseFile: null,
      drivingLicenseFileName: "",
      passportNumber: "",
      passportFile: null,
      passportFileName: "",
    });

    setEducationForm({
      highSchool: {
        schoolName: "",
        yearOfPassing: "",
        percentage: "",
        marksheetFile: null,
        marksheetName: "",
      },
      higherSecondary: {
        schoolName: "",
        yearOfPassing: "",
        percentage: "",
        marksheetFile: null,
        marksheetName: "",
      },
      degree: {
        collegeName: "",
        university: "",
        startDate: "",
        endDate: "",
        percentage: "",
        marksheetFile: null,
        marksheetName: "",
      },
      masters: {
        collegeName: "",
        university: "",
        startDate: "",
        endDate: "",
        percentage: "",
        marksheetFile: null,
        marksheetName: "",
      },
      phd: {
        collegeName: "",
        university: "",
        startDate: "",
        endDate: "",
        researchTopic: "",
        marksheetFile: null,
        marksheetName: "",
      },
    });

    setExperienceForm([
      {
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);

    setCertificateForm([
      {
        name: "",
        issuedBy: "",
        date: "",
        certificateFile: null,
        certificateName: "",
      },
    ]);
  };

  // Display a loading state while fetching user data
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography variant="h6">Loading your profile data...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ py: 4, boxShadow: "none" }}>
        {/* <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{px: 4}}
        gutterBottom
        fontWeight="bold"
      >
        Professional Profile Builder
      </Typography> */}

        <Typography variant="h4" component="h1" gutterBottom>
          Professional Profile Builder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Track and manage and upload your document and track document status
        </Typography>

        {/* Profile Summary Banner - Show when user has data */}
        {userData && (
          <Box
            sx={{
              bgcolor: "#ffffff",
              p: 2,
              mb: 3,
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" color="green">
                {userData.status === "uploaded"
                  ? "Your Documents uploaded successfully"
                  : "Your Documents Verify successfully "}
              </Typography>
              <Typography variant="body2" color="green">
                Last updated on: {new Date(userData.modifyAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            boxShadow: "none",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {isSubmitted ? (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your profile has been successfully submitted!
              </Alert>
              <Button variant="contained" onClick={handleReset} sx={{ mt: 2 }}>
                Create New Profile
              </Button>
            </Box>
          ) : (
            <>
              <Stepper
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  mb: 4,
                  pt: 2,
                  "& .MuiStepConnector-line": {
                    borderColor: theme.palette.primary.light,
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 2 }}>
                {/* Basic Information Form */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom color="primary">
                      Basic Information
                    </Typography>

                    <Card
                      variant="outlined"
                      sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              variant="outlined"
                              size="small"
                              value={basicInfoForm.firstName}
                              onChange={(e) =>
                                handleBasicInfoChange(
                                  "firstName",
                                  e.target.value
                                )
                              }
                              error={!!errors.basicInfo_firstName}
                              helperText={errors.basicInfo_firstName}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Middle Name"
                              variant="outlined"
                              size="small"
                              value={basicInfoForm.middleName}
                              onChange={(e) =>
                                handleBasicInfoChange(
                                  "middleName",
                                  e.target.value
                                )
                              }
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              variant="outlined"
                              size="small"
                              value={basicInfoForm.lastName}
                              onChange={(e) =>
                                handleBasicInfoChange(
                                  "lastName",
                                  e.target.value
                                )
                              }
                              error={!!errors.basicInfo_lastName}
                              helperText={errors.basicInfo_lastName}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Mobile Number"
                              variant="outlined"
                              size="small"
                              value={basicInfoForm.mobileNumber}
                              onChange={(e) =>
                                handleBasicInfoChange(
                                  "mobileNumber",
                                  e.target.value
                                )
                              }
                              error={!!errors.basicInfo_mobileNumber}
                              helperText={errors.basicInfo_mobileNumber}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Date of Birth"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={basicInfoForm.dateOfBirth}
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const today = new Date();
                                const eighteenYearsAgo = new Date(
                                  today.getFullYear() - 18,
                                  today.getMonth(),
                                  today.getDate()
                                );

                                handleBasicInfoChange(
                                  "dateOfBirth",
                                  e.target.value
                                );

                                if (selectedDate > eighteenYearsAgo) {
                                  setErrors({
                                    ...errors,
                                    basicInfo_dateOfBirth:
                                      "You must be at least 18 years old",
                                  });
                                } else {
                                  // Clear the error if the date is valid
                                  const newErrors = { ...errors };
                                  delete newErrors.basicInfo_dateOfBirth;
                                  setErrors(newErrors);
                                }
                              }}
                              error={!!errors.basicInfo_dateOfBirth}
                              helperText={errors.basicInfo_dateOfBirth}
                              required
                              margin="normal"
                              inputProps={{
                                max: new Date(
                                  new Date().getFullYear() - 18,
                                  new Date().getMonth(),
                                  new Date().getDate()
                                )
                                  .toISOString()
                                  .split("T")[0],
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              size="small"
                              type="email"
                              value={basicInfoForm.email}
                              onChange={(e) =>
                                handleBasicInfoChange("email", e.target.value)
                              }
                              error={!!errors.basicInfo_email}
                              helperText={errors.basicInfo_email}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              variant="outlined"
                              size="small"
                              multiline
                              rows={3}
                              value={basicInfoForm.address}
                              onChange={(e) =>
                                handleBasicInfoChange("address", e.target.value)
                              }
                              error={!!errors.basicInfo_address}
                              helperText={errors.basicInfo_address}
                              required
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Identity Information Form */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom color="primary">
                      Identity Information
                    </Typography>

                    <Card
                      variant="outlined"
                      sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Aadhar Card Number"
                              variant="outlined"
                              size="small"
                              value={identityInfoForm.aadharCard}
                              onChange={(e) =>
                                handleIdentityInfoChange(
                                  "aadharCard",
                                  e.target.value
                                )
                              }
                              error={!!errors.identityInfo_aadharCard}
                              helperText={errors.identityInfo_aadharCard}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ mt: 2 }}
                              color={
                                errors.identityInfo_aadharCardFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Aadhar Card
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleIdentityFileUpload(
                                    "aadharCardFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            {/* <Button 
  variant="outlined" 
  onClick={() => handleOpen(identityInfoForm.aadharCardFile)} 
  sx={{ mt: 2 }}
>
  View File
</Button> */}
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  identityInfoForm.aadharCardFile,
                                  identityInfoForm.aadharCardFileName
                                )
                              }
                              sx={{ mt: 2 }}
                            >
                              View File
                            </Button>
                            {identityInfoForm.aadharCardFileName && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                File: {identityInfoForm.aadharCardFileName}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleIdentityFileUpload(
                                      "aadharCardFile",
                                      null
                                    )
                                  }
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Typography>
                            )}
                            {errors.identityInfo_aadharCardFile && (
                              <Typography variant="caption" color="error">
                                {errors.identityInfo_aadharCardFile}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="PAN Card Number"
                              variant="outlined"
                              size="small"
                              value={identityInfoForm.panCard}
                              onChange={(e) =>
                                handleIdentityInfoChange(
                                  "panCard",
                                  e.target.value.toUpperCase()
                                )
                              }
                              error={!!errors.identityInfo_panCard}
                              helperText={errors.identityInfo_panCard}
                              required
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ mt: 2 }}
                              color={
                                errors.identityInfo_panCardFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload PAN Card
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleIdentityFileUpload(
                                    "panCardFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  identityInfoForm.panCardFile,
                                  identityInfoForm.panCardFileName
                                )
                              }
                              sx={{ mt: 2 }}
                            >
                              View File
                            </Button>
                            {identityInfoForm.panCardFileName && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                File: {identityInfoForm.panCardFileName}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleIdentityFileUpload(
                                      "panCardFile",
                                      null
                                    )
                                  }
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Typography>
                            )}
                            {errors.identityInfo_panCardFile && (
                              <Typography variant="caption" color="error">
                                {errors.identityInfo_panCardFile}
                              </Typography>
                            )}
                          </Grid>

                          {/* New Passport Fields */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Passport Number"
                              variant="outlined"
                              size="small"
                              value={identityInfoForm.passportNumber}
                              onChange={(e) =>
                                handleIdentityInfoChange(
                                  "passportNumber",
                                  e.target.value.toUpperCase()
                                )
                              }
                              error={!!errors.identityInfo_passportNumber}
                              helperText={errors.identityInfo_passportNumber}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<FlightIcon />}
                              sx={{ mt: 2 }}
                              color={
                                errors.identityInfo_passportFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Passport
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleIdentityFileUpload(
                                    "passportFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  identityInfoForm.passportFile,
                                  identityInfoForm.passportFileName
                                )
                              }
                              sx={{ mt: 2 }}
                            >
                              View File
                            </Button>
                            {identityInfoForm.passportFileName && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                File: {identityInfoForm.passportFileName}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleIdentityFileUpload(
                                      "passportFile",
                                      null
                                    )
                                  }
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Typography>
                            )}
                            {errors.identityInfo_passportFile && (
                              <Typography variant="caption" color="error">
                                {errors.identityInfo_passportFile}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Driving License Number"
                              variant="outlined"
                              size="small"
                              value={identityInfoForm.drivingLicense}
                              onChange={(e) =>
                                handleIdentityInfoChange(
                                  "drivingLicense",
                                  e.target.value.toUpperCase()
                                )
                              }
                              error={!!errors.identityInfo_drivingLicense}
                              helperText={errors.identityInfo_drivingLicense}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ mt: 2 }}
                              color={
                                errors.identityInfo_drivingLicenseFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Driving License
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleIdentityFileUpload(
                                    "drivingLicenseFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  identityInfoForm.drivingLicenseFile,
                                  identityInfoForm.drivingLicenseFileName
                                )
                              }
                              sx={{ mt: 2 }}
                            >
                              View File
                            </Button>
                            {identityInfoForm.drivingLicenseFileName && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                File: {identityInfoForm.drivingLicenseFileName}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleIdentityFileUpload(
                                      "drivingLicenseFile",
                                      null
                                    )
                                  }
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Card
                      variant="outlined"
                      sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[200],
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SchoolIcon />
                          High School (10th)
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="School Name"
                              variant="outlined"
                              size="small"
                              value={educationForm.highSchool.schoolName}
                              onChange={(e) =>
                                handleEducationChange(
                                  "highSchool",
                                  "schoolName",
                                  e.target.value
                                )
                              }
                              error={!!errors.highSchool_schoolName}
                              helperText={errors.highSchool_schoolName}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Year of Passing"
                              variant="outlined"
                              size="small"
                              value={educationForm.highSchool.yearOfPassing}
                              onChange={(e) =>
                                handleEducationChange(
                                  "highSchool",
                                  "yearOfPassing",
                                  e.target.value
                                )
                              }
                              error={!!errors.highSchool_yearOfPassing}
                              helperText={errors.highSchool_yearOfPassing}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Percentage/CGPA"
                              variant="outlined"
                              size="small"
                              value={educationForm.highSchool.percentage}
                              onChange={(e) =>
                                handleEducationChange(
                                  "highSchool",
                                  "percentage",
                                  e.target.value
                                )
                              }
                              error={!!errors.highSchool_percentage}
                              helperText={errors.highSchool_percentage}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 1.5 }}
                              color={
                                errors.highSchool_marksheetFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Marksheet
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    "highSchool",
                                    "marksheetFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  educationForm.highSchool.marksheetFile,
                                  educationForm.highSchool.marksheetName
                                )
                              }
                              sx={{ ml: 1 }}
                            >
                              View File
                            </Button>
                            {educationForm.highSchool.marksheetName && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={educationForm.highSchool.marksheetName}
                                  onDelete={() =>
                                    handleFileUpload(
                                      "highSchool",
                                      "marksheetFile",
                                      null
                                    )
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                            {errors.highSchool_marksheetFile && (
                              <Typography variant="caption" color="error">
                                {errors.highSchool_marksheetFile}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[200],
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SchoolIcon /> Higher Secondary (12th)
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="School Name"
                              variant="outlined"
                              size="small"
                              value={educationForm.higherSecondary.schoolName}
                              onChange={(e) =>
                                handleEducationChange(
                                  "higherSecondary",
                                  "schoolName",
                                  e.target.value
                                )
                              }
                              error={!!errors.higherSecondary_schoolName}
                              helperText={errors.higherSecondary_schoolName}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Year of Passing"
                              variant="outlined"
                              size="small"
                              value={
                                educationForm.higherSecondary.yearOfPassing
                              }
                              onChange={(e) =>
                                handleEducationChange(
                                  "higherSecondary",
                                  "yearOfPassing",
                                  e.target.value
                                )
                              }
                              error={!!errors.higherSecondary_yearOfPassing}
                              helperText={errors.higherSecondary_yearOfPassing}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Percentage/CGPA"
                              variant="outlined"
                              size="small"
                              value={educationForm.higherSecondary.percentage}
                              onChange={(e) =>
                                handleEducationChange(
                                  "higherSecondary",
                                  "percentage",
                                  e.target.value
                                )
                              }
                              error={!!errors.higherSecondary_percentage}
                              helperText={errors.higherSecondary_percentage}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 1.5 }}
                              color={
                                errors.higherSecondary_marksheetFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Marksheet
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    "higherSecondary",
                                    "marksheetFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  educationForm.higherSecondary.marksheetFile,
                                  educationForm.higherSecondary.marksheetName
                                )
                              }
                              sx={{ ml: 1 }}
                            >
                              View File
                            </Button>
                            {educationForm.higherSecondary.marksheetName && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={
                                    educationForm.higherSecondary.marksheetName
                                  }
                                  onDelete={() =>
                                    handleFileUpload(
                                      "higherSecondary",
                                      "marksheetFile",
                                      null
                                    )
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                            {errors.higherSecondary_marksheetFile && (
                              <Typography variant="caption" color="error">
                                {errors.higherSecondary_marksheetFile}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[200],
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SchoolIcon /> Bachelor's Degree
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="College Name"
                              variant="outlined"
                              size="small"
                              value={educationForm.degree.collegeName}
                              onChange={(e) =>
                                handleEducationChange(
                                  "degree",
                                  "collegeName",
                                  e.target.value
                                )
                              }
                              error={!!errors.degree_collegeName}
                              helperText={errors.degree_collegeName}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="University"
                              variant="outlined"
                              size="small"
                              value={educationForm.degree.university}
                              onChange={(e) =>
                                handleEducationChange(
                                  "degree",
                                  "university",
                                  e.target.value
                                )
                              }
                              error={!!errors.degree_university}
                              helperText={errors.degree_university}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          {/* Start Date and End Date fields */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Start Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.degree.startDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "degree",
                                  "startDate",
                                  e.target.value
                                )
                              }
                              error={!!errors.degree_startDate}
                              helperText={errors.degree_startDate}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="End Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.degree.endDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "degree",
                                  "endDate",
                                  e.target.value
                                )
                              }
                              error={!!errors.degree_endDate}
                              helperText={errors.degree_endDate}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Percentage/CGPA"
                              variant="outlined"
                              size="small"
                              value={educationForm.degree.percentage}
                              onChange={(e) =>
                                handleEducationChange(
                                  "degree",
                                  "percentage",
                                  e.target.value
                                )
                              }
                              error={!!errors.degree_percentage}
                              helperText={errors.degree_percentage}
                              required
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 1.5, mt: 1 }}
                              color={
                                errors.degree_marksheetFile
                                  ? "error"
                                  : "primary"
                              }
                            >
                              Upload Marksheet
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    "degree",
                                    "marksheetFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  educationForm.degree.marksheetFile,
                                  educationForm.degree.marksheetName
                                )
                              } //marksheetFile
                              sx={{ ml: 1 }}
                            >
                              View File
                            </Button>
                            {educationForm.degree.marksheetName && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={educationForm.degree.marksheetName}
                                  onDelete={() =>
                                    handleFileUpload(
                                      "degree",
                                      "marksheetFile",
                                      null
                                    )
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                            {errors.degree_marksheetFile && (
                              <Typography variant="caption" color="error">
                                {errors.degree_marksheetFile}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Optional Higher Education */}
                    <Card
                      variant="outlined"
                      sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[200],
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SchoolIcon /> Higher Education (Optional)
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Master's Degree
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="College Name"
                              variant="outlined"
                              size="small"
                              value={educationForm.masters.collegeName}
                              onChange={(e) =>
                                handleEducationChange(
                                  "masters",
                                  "collegeName",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="University"
                              variant="outlined"
                              size="small"
                              value={educationForm.masters.university}
                              onChange={(e) =>
                                handleEducationChange(
                                  "masters",
                                  "university",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          {/* Start Date and End Date fields for Masters */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Start Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.masters.startDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "masters",
                                  "startDate",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="End Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.masters.endDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "masters",
                                  "endDate",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Percentage/CGPA"
                              variant="outlined"
                              size="small"
                              value={educationForm.masters.percentage}
                              onChange={(e) =>
                                handleEducationChange(
                                  "masters",
                                  "percentage",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 1.5, mt: 1 }}
                            >
                              Upload Marksheet
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    "masters",
                                    "marksheetFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  educationForm.masters.marksheetFile,
                                  educationForm.masters.marksheetName
                                )
                              }
                              sx={{ ml: 1 }}
                            >
                              View File
                            </Button>
                            {educationForm.masters.marksheetName && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={educationForm.masters.marksheetName}
                                  onDelete={() =>
                                    handleFileUpload(
                                      "masters",
                                      "marksheetFile",
                                      null
                                    )
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          PhD
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="College/Institute Name"
                              variant="outlined"
                              size="small"
                              value={educationForm.phd.collegeName}
                              onChange={(e) =>
                                handleEducationChange(
                                  "phd",
                                  "collegeName",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="University"
                              variant="outlined"
                              size="small"
                              value={educationForm.phd.university}
                              onChange={(e) =>
                                handleEducationChange(
                                  "phd",
                                  "university",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          {/* Start Date and End Date fields for PhD */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Start Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.phd.startDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "phd",
                                  "startDate",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="End Date"
                              variant="outlined"
                              size="small"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={educationForm.phd.endDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  "phd",
                                  "endDate",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Research Topic"
                              variant="outlined"
                              size="small"
                              value={educationForm.phd.researchTopic}
                              onChange={(e) =>
                                handleEducationChange(
                                  "phd",
                                  "researchTopic",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                sx: { borderRadius: 1.5 },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 1.5 }}
                            >
                              Upload Thesis/Certificate
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    "phd",
                                    "marksheetFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpen(
                                  educationForm.phd.marksheetFile,
                                  educationForm.phd.marksheetName
                                )
                              }
                              sx={{ ml: 1 }}
                            >
                              View File
                            </Button>
                            {educationForm.phd.marksheetName && (
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={educationForm.phd.marksheetName}
                                  onDelete={() =>
                                    handleFileUpload(
                                      "phd",
                                      "marksheetFile",
                                      null
                                    )
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Experience Form */}
                {activeStep === 3 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        Professional Experience
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addExperience}
                        sx={{ mb: 2 }}
                      >
                        Add More
                      </Button>
                    </Box>

                    {experienceForm.map((experience, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Experience {index + 1}
                            </Typography>
                            {experienceForm.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => removeExperience(index)}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            )}
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Company Name"
                                variant="outlined"
                                size="small"
                                value={experience.companyName}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                error={
                                  !!errors[`experience_${index}_companyName`]
                                }
                                helperText={
                                  errors[`experience_${index}_companyName`]
                                }
                                required
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Position/Title"
                                variant="outlined"
                                size="small"
                                value={experience.position}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                error={!!errors[`experience_${index}_position`]}
                                helperText={
                                  errors[`experience_${index}_position`]
                                }
                                required
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Start Date"
                                variant="outlined"
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={experience.startDate}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                error={
                                  !!errors[`experience_${index}_startDate`]
                                }
                                helperText={
                                  errors[`experience_${index}_startDate`]
                                }
                                required
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="End Date (or Current)"
                                variant="outlined"
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={experience.endDate}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Job Description"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                                value={experience.description}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                margin="normal"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {/* Certificates Form */}
                {activeStep === 4 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        Certifications & Achievements
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addCertificate}
                        sx={{ mb: 2 }}
                      >
                        Add More
                      </Button>
                    </Box>

                    {certificateForm.map((certificate, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Certificate {index + 1}
                            </Typography>
                            {certificateForm.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => removeCertificate(index)}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            )}
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Certificate Name"
                                variant="outlined"
                                size="small"
                                value={certificate.name}
                                onChange={(e) =>
                                  handleCertificateChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                error={!!errors[`certificate_${index}_name`]}
                                helperText={errors[`certificate_${index}_name`]}
                                required
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Issued By"
                                variant="outlined"
                                size="small"
                                value={certificate.issuedBy}
                                onChange={(e) =>
                                  handleCertificateChange(
                                    index,
                                    "issuedBy",
                                    e.target.value
                                  )
                                }
                                error={
                                  !!errors[`certificate_${index}_issuedBy`]
                                }
                                helperText={
                                  errors[`certificate_${index}_issuedBy`]
                                }
                                required
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Issue Date"
                                variant="outlined"
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={certificate.date}
                                onChange={(e) =>
                                  handleCertificateChange(
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 2 }}
                              >
                                Upload Certificate
                                <VisuallyHiddenInput
                                  type="file"
                                  onChange={(e) =>
                                    handleCertificateFileUpload(
                                      index,
                                      e.target.files[0]
                                    )
                                  }
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </Button>

                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleOpen(certificate.certificateFile)
                                }
                                sx={{ mt: 2, ml: 1 }}
                              >
                                View File
                              </Button>

                              {certificate.certificateName && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  File: {certificate.certificateName}
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleCertificateFileUpload(index, null)
                                    }
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      color="error"
                                    />
                                  </IconButton>
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Back
                </Button>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={handleSaveAndNext}
                    startIcon={<SaveIcon />}
                    sx={{ mr: 2 }}
                  >
                    Save & Next
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={activeStep === steps.length - 1 ? null : <NavigateNextIcon />}
                  >
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </Box>
              </Box> */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="outlined"
                      onClick={() => setPreviewOpen(true)}
                      sx={{ mr: 2 }}
                    >
                      Preview
                    </Button>
                  ) : (
                    <></>
                  )}

                  <Button
                    variant="outlined"
                    onClick={handleSaveAndNext}
                    startIcon={<SaveIcon />}
                    sx={{ mr: 2 }}
                  >
                    Save & Next
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={
                      activeStep === steps.length - 1 ? null : (
                        <NavigateNextIcon />
                      )
                    }
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>

                  {/* {activeStep === steps.length - 1 ? (<Button
      variant="contained"
      onClick={handleNext}
      endIcon={activeStep === steps.length - 1 ? null : <NavigateNextIcon />}
    >
      Submit
    </Button>):(<></>)} */}
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Document Preview
          <IconButton onClick={handleClose} size="small">
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {previewFile?.type?.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          ) : previewFile?.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Preview not available
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SaveIcon />
            <Typography variant="h6">Application Preview</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Banner with user name and status */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  {basicInfoForm.firstName} {basicInfoForm.lastName}
                </Typography>
                <Chip
                  label="Ready for Submission"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  }}
                />
              </Box>
              <Typography variant="body2">
                Please review your information before final submission
              </Typography>
            </Paper>

            {/* Basic Information Section */}
            <Card
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Basic Information
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {basicInfoForm.firstName} {basicInfoForm.middleName}{" "}
                      {basicInfoForm.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mobile Number
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {basicInfoForm.mobileNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(basicInfoForm.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {basicInfoForm.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Residential Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {basicInfoForm.address}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Identity Information Section */}
            <Card
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Identity Information
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        height: "100%",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Aadhar Card Details
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {identityInfoForm.aadharCard}
                      </Typography>
                      {identityInfoForm.aadharCardFileName && (
                        <Chip
                          size="small"
                          label={identityInfoForm.aadharCardFileName}
                          sx={{ mt: 1 }}
                          icon={<CloudUploadIcon fontSize="small" />}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        height: "100%",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        PAN Card Details
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {identityInfoForm.panCard}
                      </Typography>
                      {identityInfoForm.panCardFileName && (
                        <Chip
                          size="small"
                          label={identityInfoForm.panCardFileName}
                          sx={{ mt: 1 }}
                          icon={<CloudUploadIcon fontSize="small" />}
                        />
                      )}
                    </Box>
                  </Grid>
                  {identityInfoForm.drivingLicense && (
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          height: "100%",
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Driving License
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {identityInfoForm.drivingLicense}
                        </Typography>
                        {identityInfoForm.drivingLicenseFileName && (
                          <Chip
                            size="small"
                            label={identityInfoForm.drivingLicenseFileName}
                            sx={{ mt: 1 }}
                            icon={<CloudUploadIcon fontSize="small" />}
                          />
                        )}
                      </Box>
                    </Grid>
                  )}
                  {identityInfoForm.passportNumber && (
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          height: "100%",
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Passport
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {identityInfoForm.passportNumber}
                        </Typography>
                        {identityInfoForm.passportFileName && (
                          <Chip
                            size="small"
                            label={identityInfoForm.passportFileName}
                            sx={{ mt: 1 }}
                            icon={<CloudUploadIcon fontSize="small" />}
                          />
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Educational Qualifications
                </Typography>
              </Box>
              <CardContent>
                {/* High School */}
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor: theme.palette.grey[50],
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <SchoolIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      High School (10th)
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        School Name
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.highSchool.schoolName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Year of Passing
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.highSchool.yearOfPassing}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Percentage
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.highSchool.percentage}%
                      </Typography>
                    </Grid>
                    {educationForm.highSchool.marksheetName && (
                      <Grid item xs={12}>
                        <Chip
                          size="small"
                          label={educationForm.highSchool.marksheetName}
                          icon={<CloudUploadIcon fontSize="small" />}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Higher Secondary */}
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor: theme.palette.grey[50],
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <SchoolIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Higher Secondary (12th)
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        School Name
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.higherSecondary.schoolName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Year of Passing
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.higherSecondary.yearOfPassing}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Percentage
                      </Typography>
                      <Typography variant="body1">
                        {educationForm.higherSecondary.percentage}%
                      </Typography>
                    </Grid>
                    {educationForm.higherSecondary.marksheetName && (
                      <Grid item xs={12}>
                        <Chip
                          size="small"
                          label={educationForm.higherSecondary.marksheetName}
                          icon={<CloudUploadIcon fontSize="small" />}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Bachelor's Degree - Only show if college name is filled */}
                {educationForm.degree.collegeName && (
                  <Box
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      mb: 2,
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SchoolIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Bachelor's Degree
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          College Name
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.degree.collegeName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          University
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.degree.university}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.degree.startDate} to{" "}
                          {educationForm.degree.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Percentage
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.degree.percentage}%
                        </Typography>
                      </Grid>
                      {educationForm.degree.marksheetName && (
                        <Grid item xs={12}>
                          <Chip
                            size="small"
                            label={educationForm.degree.marksheetName}
                            icon={<CloudUploadIcon fontSize="small" />}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {/* Master's Degree - Only show if college name is filled */}
                {educationForm.masters.collegeName && (
                  <Box
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      mb: 2,
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SchoolIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Master's Degree
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          College Name
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.masters.collegeName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          University
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.masters.university}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.masters.startDate} to{" "}
                          {educationForm.masters.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Percentage
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.masters.percentage}%
                        </Typography>
                      </Grid>
                      {educationForm.masters.marksheetName && (
                        <Grid item xs={12}>
                          <Chip
                            size="small"
                            label={educationForm.masters.marksheetName}
                            icon={<CloudUploadIcon fontSize="small" />}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {/* PhD - Only show if college name is filled */}
                {educationForm.phd.collegeName && (
                  <Box
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      mb: 2,
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SchoolIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        PhD
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          College Name
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.phd.collegeName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          University
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.phd.university}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.phd.startDate} to{" "}
                          {educationForm.phd.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Research Topic
                        </Typography>
                        <Typography variant="body1">
                          {educationForm.phd.researchTopic}
                        </Typography>
                      </Grid>
                      {educationForm.phd.marksheetName && (
                        <Grid item xs={12}>
                          <Chip
                            size="small"
                            label={educationForm.phd.marksheetName}
                            icon={<CloudUploadIcon fontSize="small" />}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  4
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Professional Experience
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2}>
                  {experienceForm.map((exp, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          mb: 1,
                          backgroundColor: theme.palette.grey[50],
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="primary"
                        >
                          {exp.companyName}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Position
                            </Typography>
                            <Typography variant="body1">
                              {exp.position}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Duration
                            </Typography>
                            <Typography variant="body1">
                              {new Date(exp.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                }
                              )}{" "}
                              -{" "}
                              {exp.endDate
                                ? new Date(exp.endDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                    }
                                  )
                                : "Present"}
                            </Typography>
                          </Grid>
                          {exp.description && (
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Job Description
                              </Typography>
                              <Typography variant="body2">
                                {exp.description}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  5
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Certifications & Achievements
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2}>
                  {certificateForm.map((cert, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: theme.palette.grey[50],
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="primary"
                          gutterBottom
                        >
                          {cert.name}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Issued By
                          </Typography>
                          <Typography variant="body2">
                            {cert.issuedBy}
                          </Typography>

                          {cert.date && (
                            <>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                Issue Date
                              </Typography>
                              <Typography variant="body2">
                                {new Date(cert.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </Typography>
                            </>
                          )}
                        </Box>

                        {cert.certificateName && (
                          <Chip
                            size="small"
                            label={cert.certificateName}
                            icon={<CloudUploadIcon fontSize="small" />}
                            sx={{ alignSelf: "flex-start", mt: 2 }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[50],
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setPreviewOpen(false)}
            startIcon={<NavigateBeforeIcon />}
          >
            Back to Edit
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleNext();
              setPreviewOpen(false);
            }}
            startIcon={<SaveIcon />}
            color="primary"
          >
            Confirm & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default StepperComponent;
