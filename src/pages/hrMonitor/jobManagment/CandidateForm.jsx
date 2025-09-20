import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Container,
  Fade,
  CircularProgress,
  Zoom,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

import {
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Upload as UploadIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import axios from "axios";
import { base_candidate, base_hr } from "../../../http/services";

// Constants
const FORM_STEPS = {
  PERSONAL: 0,
  EDUCATION: 1,
  PROFESSIONAL: 2,
  ADDITIONAL: 3,
};

const SECTIONS_CONFIG = [
  {
    title: "Personal Information",
    icon: <PersonIcon />,
    fields: [
      "candidateName",
      "candidateEmail",
      "candidateNumber",
      "dateOfBirth",
      "gender",
      "address",
    ],
  },
  {
    title: "Education Details",
    icon: <SchoolIcon />,
    fields: [
      "highestQualification",
      "tenthPercentage",
      "twelvthPercentage",
      "yearOfPassing",
    ],
  },
  {
    title: "Professional Details",
    icon: <WorkIcon />,
    fields: [
      "designation",
      "overallExperience",
      "relevantExperience",
      "currentCTC",
      "expectedCTC",
      "noticePeriod",
    ],
  },
  {
    title: "Additional Information",
    icon: <LocationIcon />,
    fields: ["citizenship", "willingToRelocate", "techStack", "resume"],
  },
];

const INITIAL_FORM_STATE = {
  candidateName: "",
  candidateEmail: "",
  candidateNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  highestQualification: "",
  tenthPercentage: "",
  twelvthPercentage: "",
  yearOfPassing: "",
  howHeardAboutJob: "google from",
  designation: "",
  overallExperience: "",
  relevantExperience: "",
  currentCTC: "",
  expectedCTC: "",  
  noticePeriod: "",
  techStack: [""],
  citizenship: "",
  willingToRelocate: false,
  resume: null,
};

const VALIDATION_RULES = {
  candidateEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  candidateNumber: /^[0-9]{10}$/,
  tenthPercentage: { min: 0, max: 100 },
  twelvthPercentage: { min: 0, max: 100 },
  overallExperience: { min: 0 },
  relevantExperience: { min: 0 },
  currentCTC: { min: 0 },
  expectedCTC: { min: 0 },
  noticePeriod: { min: 0 },
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  maxWidth: 900,
  margin: "40px auto",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.3s ease",
    "&:hover fieldset": {
      borderColor: "#1a237e",
      borderWidth: 2,
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1a237e",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(26, 35, 126, 0.3)",
  },
}));

// Utility Functions
const extractTextFromResume = (resumeText) => {
  // Enhanced text processing for better extraction
  const cleanText = resumeText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleanText;
};

const parseExperienceFromText = (text) => {
  // Enhanced experience parsing with multiple strategies
  const strategies = [
    // Strategy 1: Direct mention of years
    /(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi,
    
    // Strategy 2: Month-Year ranges (Feb 2024 - Aug 2024)
    /(\w{3,9})\s+(\d{4})\s*[-–—]\s*(\w{3,9})\s+(\d{4})/gi,
    
    // Strategy 3: Month-Year to present/current
    /(\w{3,9})\s+(\d{4})\s*[-–—]\s*(?:present|current|till\s+date)/gi,
    
    // Strategy 4: Simple year ranges (2020-2022, 2023-2024)
    /(\d{4})\s*[-–—]\s*(\d{4})/g,
    
    // Strategy 5: Year to present (2020-Present)
    /(\d{4})\s*[-–—]\s*(?:present|current)/gi,
    
    // Strategy 6: Month ranges (6 months, 8 months)
    /(\d+)\s*months?\s*(?:of\s*)?(?:experience|exp)/gi,
    
    // Strategy 7: Specific date ranges (Jan 2025 - June 2025)
    /(\w{3,9})\s+(\d{4})\s*[-–—]\s*(\w{3,9})\s+(\d{4})/gi
  ];

  let totalExperience = 0;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const experienceEntries = [];

  const monthMap = {
    'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
    'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6,
    'jul': 7, 'july': 7, 'aug': 8, 'august': 8, 'sep': 9, 'september': 9,
    'oct': 10, 'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
  };

  // Strategy 1: Direct years mention
  const directYears = text.match(strategies[0]);
  if (directYears && directYears.length > 0) {
    const numbers = directYears.map(match => parseFloat(match.match(/\d+(?:\.\d+)?/)[0]));
    const maxDirectExp = Math.max(...numbers);
    experienceEntries.push(`Direct mention: ${maxDirectExp} years`);
    totalExperience = Math.max(totalExperience, maxDirectExp);
  }

  // Strategy 6: Direct months mention
  const directMonths = text.match(strategies[5]);
  if (directMonths && directMonths.length > 0) {
    const months = directMonths.map(match => parseInt(match.match(/\d+/)[0]));
    const totalMonths = months.reduce((sum, m) => sum + m, 0);
    const yearsFromMonths = totalMonths / 12;
    experienceEntries.push(`Direct months: ${totalMonths} months = ${yearsFromMonths.toFixed(1)} years`);
    totalExperience = Math.max(totalExperience, yearsFromMonths);
  }

  // Parse all date ranges
  let experiences = [];

  // Strategy 2: Month-Year ranges (Feb 2024 - Aug 2024)
  let match;
  const regex2 = new RegExp(strategies[1].source, 'gi');
  while ((match = regex2.exec(text)) !== null) {
    const startMonth = monthMap[match[1].toLowerCase()] || 1;
    const startYear = parseInt(match[2]);
    const endMonth = monthMap[match[3].toLowerCase()] || 12;
    const endYear = parseInt(match[4]);
    
    let experience;
    if (endYear === startYear) {
      // Same year, calculate months difference
      experience = (endMonth - startMonth + 1) / 12;
    } else {
      // Different years
      experience = (endYear - startYear) + (endMonth - startMonth) / 12;
    }
    
    experience = Math.max(0, experience);
    experiences.push(experience);
    experienceEntries.push(`${match[0]}: ${experience.toFixed(1)} years`);
  }

  // Strategy 3: Month-Year to present
  const regex3 = new RegExp(strategies[2].source, 'gi');
  while ((match = regex3.exec(text)) !== null) {
    const startMonth = monthMap[match[1].toLowerCase()] || 1;
    const startYear = parseInt(match[2]);
    
    const experience = (currentYear - startYear) + (currentMonth - startMonth) / 12;
    const validExp = Math.max(0, experience);
    experiences.push(validExp);
    experienceEntries.push(`${match[0]}: ${validExp.toFixed(1)} years`);
  }

  // Strategy 4: Simple year ranges (2020-2022)
  const regex4 = new RegExp(strategies[3].source, 'g');
  while ((match = regex4.exec(text)) !== null) {
    const startYear = parseInt(match[1]);
    const endYear = parseInt(match[2]);
    const experience = endYear - startYear;
    const validExp = Math.max(0, experience);
    experiences.push(validExp);
    experienceEntries.push(`${match[0]}: ${validExp} years`);
  }

  // Strategy 5: Year to present
  const regex5 = new RegExp(strategies[4].source, 'gi');
  while ((match = regex5.exec(text)) !== null) {
    const startYear = parseInt(match[1]);
    const experience = currentYear - startYear;
    const validExp = Math.max(0, experience);
    experiences.push(validExp);
    experienceEntries.push(`${match[0]}: ${validExp} years`);
  }

  console.log('Experience calculation details:', experienceEntries);

  // Calculate total experience
  if (experiences.length > 0) {
    // Sum all experiences (assuming they don't overlap significantly)
    const summedExperience = experiences.reduce((sum, exp) => sum + exp, 0);
    totalExperience = Math.max(totalExperience, summedExperience);
  }

  // Round to 1 decimal place
  return totalExperience > 0 ? Math.round(totalExperience * 10) / 10 : 0;
};

// Enhanced job title extraction function
const extractJobTitles = (text) => {
  const jobTitlePatterns = [
    // Pattern 1: Job Title | Company or Job Title - Company
    /([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Intern|Associate|Senior|Junior|Lead|Architect|Consultant|Specialist))\s*[\|\-]\s*([A-Za-z\s&]+(?:Ltd|Inc|Corp|Company|Technologies|Solutions|Systems))/gi,
    
    // Pattern 2: Job Title at Company
    /([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Intern|Associate|Senior|Junior|Lead|Architect|Consultant|Specialist))\s+at\s+([A-Za-z\s&]+)/gi,
    
    // Pattern 3: Just job titles (common IT roles)
    /((?:Senior|Junior|Lead|Principal|Associate)?\s*(?:Software|Web|Full Stack|Frontend|Backend|Data|DevOps|QA|Test)?\s*(?:Engineer|Developer|Analyst|Manager|Intern|Architect|Consultant|Specialist))/gi,
    
    // Pattern 4: Specific roles
    /(Intern\s+Software\s+Engineer|Software\s+Engineer|Web\s+Developer|Full\s+Stack\s+Developer|Data\s+Scientist|Product\s+Manager)/gi
  ];

  const jobTitles = new Set();
  
  jobTitlePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1].trim();
      if (title.length > 3 && title.length < 50) {
        jobTitles.add(title);
      }
    }
  });

  return Array.from(jobTitles);
};

const extractEducationInfo = (text) => {
  // Enhanced education extraction with fallback strategies
  const strategies = {
    // Strategy 1: Direct percentage mentions
    percentages: /(\d{1,2}(?:\.\d{1,2})?)\s*%/g,
    
    // Strategy 2: Grade/CGPA mentions
    cgpa: /(?:cgpa|gpa)[:\s]*(\d+(?:\.\d+)?)/gi,
    
    // Strategy 3: Qualification patterns
    qualifications: /(bachelor|master|diploma|b\.?tech|m\.?tech|b\.?sc|m\.?sc|mca|bca|mba|b\.?e|m\.?e)/gi,
    
    // Strategy 4: Year patterns
    years: /(?:passing|completed|graduated)[:\s]*(\d{4})|(\d{4})[:\s]*(?:passing|completed|graduated)/gi
  };
  
  const percentages = [];
  let match;
  
  // Extract percentages
  while ((match = strategies.percentages.exec(text)) !== null) {
    const percentage = parseFloat(match[1]);
    if (percentage <= 100) {
      percentages.push(percentage);
    }
  }
  
  // Extract CGPA and convert to percentage approximation
  while ((match = strategies.cgpa.exec(text)) !== null) {
    const cgpa = parseFloat(match[1]);
    if (cgpa <= 10) {
      percentages.push(cgpa * 10); // Rough conversion
    }
  }
  
  const qualifications = [];
  const qualRegex = new RegExp(strategies.qualifications.source, 'gi');
  while ((match = qualRegex.exec(text)) !== null) {
    qualifications.push(match[0]);
  }

  return {
    percentages: percentages.sort((a, b) => b - a), // Sort descending
    qualifications: qualifications,
    hasEducation: percentages.length > 0 || qualifications.length > 0
  };
};

// Enhanced fallback parsing function with better job title extraction
const fallbackParseResume = (resumeText) => {
  console.log('Using enhanced fallback parsing...');
  
  const result = {
    name: null,
    email: null,
    phone: null,
    skills: [],
    address: null,
    dateOfBirth: null,
    tenthPercentage: null,
    twelvthPercentage: null,
    graduationPercentage: null,
    educationDetails: null,
    projects: [],
    workExperience: [],
    yearOfPassing: null,
    currentDesignation: null,
    experienceYears: null,
    allJobTitles: [],
    experienceEntries: []
  };

  // Extract email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0];

  // Extract phone
  const phoneMatch = resumeText.match(/(?:\+94|\+91)?[\s-]?[6-9]\d{8,9}|\b\d{10}\b/);
  if (phoneMatch) {
    const cleanPhone = phoneMatch[0].replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      result.phone = cleanPhone.slice(-10);
    }
  }

  // Extract name (first meaningful line that's not contact info)
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
  for (const line of lines.slice(0, 5)) {
    if (!line.includes('@') && !line.match(/\d{10}/) && line.length > 3 && line.length < 50) {
      const words = line.trim().split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        result.name = line.trim();
        break;
      }
    }
  }

  // Extract job titles
  const jobTitles = extractJobTitles(resumeText);
  result.allJobTitles = jobTitles;
  if (jobTitles.length > 0) {
    result.currentDesignation = jobTitles[0]; // Most recent/first found
  }

  // Extract experience
  const experienceYears = parseExperienceFromText(resumeText);
  if (experienceYears > 0) {
    result.experienceYears = experienceYears;
  }

  // Extract education info
  const eduInfo = extractEducationInfo(resumeText);
  if (eduInfo.percentages.length >= 2) {
    result.graduationPercentage = eduInfo.percentages[0];
    result.twelvthPercentage = eduInfo.percentages[1];
    if (eduInfo.percentages.length >= 3) {
      result.tenthPercentage = eduInfo.percentages[2];
    }
  }

  if (eduInfo.qualifications.length > 0) {
    result.educationDetails = eduInfo.qualifications[0];
  }

  // Extract skills (enhanced pattern matching)
  const skillPatterns = [
    /(?:Technical\s+Skills?|Programming\s+Languages?|Technologies?|Tools?)[:\s]+(.*?)(?:\n|$)/gi,
    /\b(JavaScript|Java|Python|React|Node\.js|Angular|Vue|Laravel|PHP|MySQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|Git|HTML|CSS|Bootstrap|Tailwind|Flutter|Dart|Spring|Hibernate)\b/gi
  ];

  const skills = new Set();
  skillPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(resumeText)) !== null) {
      if (match[1]) {
        // Split by common delimiters
        const skillsList = match[1].split(/[,|;•\-\n]/).map(s => s.trim()).filter(s => s.length > 1);
        skillsList.forEach(skill => skills.add(skill));
      } else {
        skills.add(match[0]);
      }
    }
  });

  result.skills = Array.from(skills).slice(0, 15); // Limit to 15 skills

  return result;
};

// Custom Hooks
const useFormValidation = (formData, activeStep) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((fieldName, value, customRules = {}) => {
    const rules = { ...VALIDATION_RULES, ...customRules };

    if (!value && fieldName !== "resume" && fieldName !== "willingToRelocate") {
      return "This field is required";
    }

    if (fieldName === "dateOfBirth" && value) {
      const dob = new Date(value);
      const today = new Date();
      if (isNaN(dob.getTime())) {
        return "Please enter a valid date";
      }
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        return "Applicant must be at least 18 years old";
      }
    }

    if (rules[fieldName]) {
      const rule = rules[fieldName];

      if (rule instanceof RegExp && !rule.test(value)) {
        switch (fieldName) {
          case "candidateEmail":
            return "Please enter a valid email address";
          case "candidateNumber":
            return "Please enter a valid 10-digit phone number";
          default:
            return "Invalid format";
        }
      }

      if (typeof rule === "object" && rule.min !== undefined) {
        const numValue = parseFloat(value);
        if (numValue < rule.min) {
          return `Value must be at least ${rule.min}`;
        }
        if (rule.max !== undefined && numValue > rule.max) {
          return `Value must not exceed ${rule.max}`;
        }
      }
    }

    return "";
  }, []);

  const validateSection = useCallback(() => {
    const currentFields = SECTIONS_CONFIG[activeStep]?.fields || [];
    const newErrors = {};

    currentFields.forEach((field) => {
      if (field === "techStack") {
        formData.techStack.forEach((tech, index) => {
          if (!tech.trim()) {
            newErrors[`techStack_${index}`] = "Tech stack cannot be empty";
          }
        });
      } else {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, activeStep, validateField]);

  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  }, []);

  return { errors, validateSection, clearFieldError, setErrors };
};

const useFormData = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const updateField = useCallback(async (fieldName, value) => {
    if (fieldName !== "resume") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      return;
    }

    if (value) {
      setFormData(prev => ({
        ...prev,
        isParsingResume: true,
        resumeError: null,
        resume: value
      }));

      try {
        // Read file as base64
        const fileBase64 = await new Promise((resolve, reject) => {
          const reader = new window.FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(value);
        });

        // Enhanced Gemini prompt with specific focus on experience and job roles
        const prompt = `
You are an expert resume parser. Analyze this resume and extract information into the exact JSON format below.
Pay SPECIAL ATTENTION to work experience dates and job titles. Look for ALL experience entries.
If any field is not found, set it to null or empty array as appropriate.
Return ONLY the JSON object without any markdown formatting, explanations, or code blocks.

REQUIRED JSON STRUCTURE:
{
  "name": "string or null",
  "email": "string or null", 
  "phone": "string or null",
  "skills": ["array of skills as strings"],
  "address": "string or null",
  "dateOfBirth": "string or null",
  "tenthPercentage": "number or null",
  "twelvthPercentage": "number or null", 
  "graduationPercentage": "number or null",
  "educationDetails": "string or null",
  "projects": ["array of project descriptions"],
  "workExperience": ["array of work experience descriptions"],
  "yearOfPassing": "number or null",
  "currentDesignation": "string or null",
  "experienceYears": "number or null",
  "allJobTitles": ["array of all job titles found"],
  "experienceEntries": ["array of experience date ranges"]
}

CRITICAL EXTRACTION RULES:

1. **WORK EXPERIENCE & JOB TITLES**:
   - Look for section headers: "WORK EXPERIENCE", "EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT"
   - Extract ALL job titles/positions (e.g., "Intern Software Engineer", "Software Engineer", "Associate Software Engineer")
   - currentDesignation: The MOST RECENT job title (latest chronologically)
   - allJobTitles: Array of ALL job titles found in the resume
   - Look for company names and duration for each role

2. **EXPERIENCE CALCULATION**:
   - experienceEntries: Extract ALL date ranges (e.g., "Feb 2024 - Aug 2024", "Jan 2023 - Dec 2023")
   - experienceYears: Calculate TOTAL experience from ALL positions
   - Look for formats: "Feb 2024 - Aug 2024", "2023-2024", "Jan 2025 - June 2025", "May 2019 - Present"
   - If someone worked multiple jobs, ADD all the durations
   - Handle overlapping periods intelligently

3. **DATE PARSING PATTERNS**:
   - "Feb 2024 - Aug 2024" = 6 months = 0.5 years
   - "Jan 2023 - Present" = Calculate from Jan 2023 to current date
   - "2019 - 2021" = 2 years
   - "6 months", "1 year experience" = Extract direct mentions

4. **DESIGNATION EXTRACTION**:
   - Look for job titles before company names
   - Common patterns: "Software Engineer | Company", "Role at Company", "Position - Company"
   - Extract from work experience sections, not from general descriptions

5. **EDUCATION**:
   - tenthPercentage: 10th standard percentage (look for "Secondary", "10th", "SSC")
   - twelvthPercentage: 12th standard percentage (look for "Higher Secondary", "12th", "HSC")
   - educationDetails: ONLY the highest degree name
   - yearOfPassing: Year for the highest qualification

6. **CONTACT & PERSONAL**:
   - name: Full name from header/top section
   - email: Valid email address
   - phone: 10-digit phone number
   - dateOfBirth: Convert to YYYY-MM-DD format

7. **SKILLS**: Extract technical skills, programming languages, tools, frameworks

EXAMPLE PATTERNS TO LOOK FOR:
- "Intern Software Engineer - CodeRay Technologies Pvt Ltd (Feb 2024 - Aug 2024)"
- "Software Developer at ABC Corp (Jan 2023 - Dec 2023)"
- "2+ years of experience in..."
- "Worked for 6 months on..."

Return only the JSON object with accurate calculations:`;

        // Gemini API call
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXQFrrQwZXHDabAzn5z9lbVS0AprbsTyE`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    { inlineData: { mimeType: value.type, data: fileBase64 } }
                  ]
                }
              ]
            })
          }
        );

        const geminiData = await geminiResponse.json();
        let extracted = {};
        
        try {
          let responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          // Clean response - remove markdown formatting
          responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          
          // Find JSON object in response
          const jsonStart = responseText.indexOf('{');
          const jsonEnd = responseText.lastIndexOf('}') + 1;
          
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            responseText = responseText.substring(jsonStart, jsonEnd);
          }
          
          extracted = JSON.parse(responseText);
          console.log('Extracted data from Gemini:', extracted);
          
          // Validate extraction quality - check for critical missing data
          const hasBasicInfo = extracted.name || extracted.email || extracted.phone;
          const hasJobInfo = extracted.currentDesignation || (extracted.allJobTitles && extracted.allJobTitles.length > 0);
          const hasExperience = extracted.experienceYears || (extracted.workExperience && extracted.workExperience.length > 0);
          
          if (!hasBasicInfo || (!hasJobInfo && !hasExperience)) {
            throw new Error('Critical information missing, using fallback');
          }
          
        } catch (parseError) {
          console.error('Gemini parsing failed:', parseError);
          
          // Use fallback parsing
          try {
            const fileText = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(value);
            });
            
            const fallbackData = fallbackParseResume(fileText);
            console.log('Fallback extraction:', fallbackData);
            
            // Merge Gemini data with fallback data (fallback takes priority for missing fields)
            extracted = {
              ...fallbackData,
              ...extracted, // Keep any valid Gemini data
              // But override with fallback if Gemini data is missing critical info
              currentDesignation: extracted.currentDesignation || fallbackData.currentDesignation,
              experienceYears: extracted.experienceYears || fallbackData.experienceYears,
              allJobTitles: extracted.allJobTitles || fallbackData.allJobTitles
            };
            
            console.log('Merged extraction data:', extracted);
            
          } catch (fallbackError) {
            console.error('Fallback parsing also failed:', fallbackError);
            extracted = {}; // Use empty object if all parsing fails
          }
        }

        // Enhanced field mapping with multiple validation layers
        const updateData = {
          isParsingResume: false,
          resumeError: null,
          resume: value
        };

        // Helper function to clean and format date
        const formatDate = (dateStr) => {
          if (!dateStr) return null;
          
          // Try to parse various date formats
          const dateFormats = [
            /(\d{4})-(\d{2})-(\d{2})/,  // YYYY-MM-DD
            /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY or MM/DD/YYYY
            /(\d{2})-(\d{2})-(\d{4})/,  // DD-MM-YYYY
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/ // Flexible format
          ];
          
          for (const format of dateFormats) {
            const match = dateStr.match(format);
            if (match) {
              if (format === dateFormats[0]) { // Already in YYYY-MM-DD
                return dateStr;
              } else {
                // Convert to YYYY-MM-DD format
                const year = match[3] || match[1];
                const month = match[2].padStart(2, '0');
                const day = match[1].padStart(2, '0');
                return `${year}-${month}-${day}`;
              }
            }
          }
          return null;
        };

        // Helper function to extract numeric value from percentage strings
        const extractPercentage = (value) => {
          if (!value) return null;
          if (typeof value === 'number') return value;
          
          const numMatch = value.toString().match(/(\d+(?:\.\d+)?)/);
          return numMatch ? parseFloat(numMatch[1]) : null;
        };

        // Helper function to clean qualification name
        const cleanQualificationName = (qualification) => {
          if (!qualification) return null;
          
          // Remove extra details and keep only the main qualification
          let cleaned = qualification.replace(/\d{4}/g, '') // Remove years
                                    .replace(/CGPA:?\s*\d+(?:\.\d+)?%?/gi, '') // Remove CGPA
                                    .replace(/Percentage:?\s*\d+(?:\.\d+)?%?/gi, '') // Remove percentage
                                    .replace(/\s*,\s*[^,]*University[^,]*/gi, '') // Remove university names
                                    .replace(/\s*,\s*[^,]*College[^,]*/gi, '') // Remove college names
                                    .replace(/\s*,\s*[^,]*School[^,]*/gi, '') // Remove school names
                                    .replace(/Secondary.*$/gi, '') // Remove secondary education text
                                    .replace(/\s+/g, ' ') // Clean multiple spaces
                                    .trim();
          
          // If the cleaned string is too short or generic, try to extract meaningful part
          if (cleaned.length < 5) {
            const qualificationMatch = qualification.match(/(Bachelor|Master|Diploma|B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|MCA|BCA|MBA)[^,\n]*/i);
            return qualificationMatch ? qualificationMatch[0].trim() : qualification.split(',')[0].trim();
          }
          
          return cleaned;
        };

        // Map extracted data to form fields with enhanced validation
        if (extracted.name && typeof extracted.name === 'string') {
          updateData.candidateName = extracted.name.trim();
        }
        
        if (extracted.email && typeof extracted.email === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(extracted.email.trim())) {
            updateData.candidateEmail = extracted.email.trim();
          }
        }
        
        if (extracted.phone) {
          // Enhanced phone number cleaning
          const cleanPhone = extracted.phone.toString().replace(/\D/g, '');
          if (cleanPhone.length >= 10) {
            updateData.candidateNumber = cleanPhone.slice(-10); // Take last 10 digits
          }
        }
        
        if (extracted.address && typeof extracted.address === 'string') {
          updateData.address = extracted.address.trim();
        }
        
        if (extracted.dateOfBirth) {
          const formattedDate = formatDate(extracted.dateOfBirth);
          if (formattedDate) {
            updateData.dateOfBirth = formattedDate;
          }
        }
        
        if (extracted.educationDetails) {
          const cleanedQualification = cleanQualificationName(extracted.educationDetails);
          if (cleanedQualification) {
            updateData.highestQualification = cleanedQualification;
          }
        }
        
        if (extracted.tenthPercentage) {
          const tenthPercent = extractPercentage(extracted.tenthPercentage);
          if (tenthPercent && tenthPercent <= 100 && tenthPercent >= 0) {
            updateData.tenthPercentage = tenthPercent.toString();
          }
        }
        
        if (extracted.twelvthPercentage) {
          const twelvthPercentage = extractPercentage(extracted.twelvthPercentage);
          if (twelvthPercentage && twelvthPercentage <= 100 && twelvthPercentage >= 0) {
            updateData.twelvthPercentage = twelvthPercentage.toString();
          }
        }

        if (extracted.yearOfPassing) {
          const year = parseInt(extracted.yearOfPassing);
          if (year >= 1950 && year <= new Date().getFullYear()) {
            updateData.yearOfPassing = year.toString();
          }
        }

        // Enhanced experience and designation extraction with fallback priority
        if (extracted.currentDesignation && typeof extracted.currentDesignation === 'string') {
          updateData.designation = extracted.currentDesignation.trim();
        } else if (extracted.allJobTitles && Array.isArray(extracted.allJobTitles) && extracted.allJobTitles.length > 0) {
          // Use the first job title from the array as current designation
          updateData.designation = extracted.allJobTitles[0].trim();
        }

        // Enhanced experience calculation with multiple sources and debugging
        let totalExperience = 0;
        
        // Priority 1: Use experienceYears if available and valid
        if (extracted.experienceYears && typeof extracted.experienceYears === 'number' && extracted.experienceYears > 0) {
          totalExperience = extracted.experienceYears;
          console.log('Using Gemini experienceYears:', totalExperience);
        } 
        // Priority 2: Calculate from experienceEntries if available
        else if (extracted.experienceEntries && Array.isArray(extracted.experienceEntries) && extracted.experienceEntries.length > 0) {
          const experienceText = extracted.experienceEntries.join(' ');
          totalExperience = parseExperienceFromText(experienceText);
          console.log('Calculated from experienceEntries:', totalExperience);
        }
        // Priority 3: Calculate from workExperience array
        else if (extracted.workExperience && Array.isArray(extracted.workExperience)) {
          const experienceText = extracted.workExperience.join(' ');
          totalExperience = parseExperienceFromText(experienceText);
          console.log('Calculated from workExperience:', totalExperience);
        }

        // Apply experience if calculated successfully
        if (totalExperience > 0) {
          updateData.overallExperience = totalExperience.toString();
          updateData.relevantExperience = totalExperience.toString(); // Set relevant = overall by default
          console.log('Final experience set:', totalExperience);
        } else {
          console.log('No valid experience found');
        }
        
        // Enhanced skills mapping with validation
        if (extracted.skills && Array.isArray(extracted.skills) && extracted.skills.length > 0) {
          const validSkills = extracted.skills
            .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
            .map(skill => skill.trim())
            .filter(skill => skill.length <= 50) // Reasonable skill name length
            .slice(0, 15); // Limit to 15 skills
          
          if (validSkills.length > 0) {
            updateData.techStack = validSkills;
          }
        }

        // Log successful extraction
        console.log('Final update data:', updateData);

        setFormData(prev => ({
          ...prev,
          ...updateData
        }));

      } catch (error) {
        console.error('Resume parsing error:', error);
        setFormData(prev => ({
          ...prev,
          isParsingResume: false,
          resumeError: "Failed to parse resume. Please enter details manually.",
          resume: value
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, resume: null }));
    }
  }, []);

  const updateTechStack = useCallback((index, value) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.map((tech, i) => (i === index ? value : tech)),
    }));
  }, []);

  const addTechStackField = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      techStack: [...prev.techStack, ""],
    }));
  }, []);

  const removeTechStackField = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  return {
    formData,
    updateField,
    updateTechStack,
    addTechStackField,
    removeTechStackField,
    resetForm,
  };
};

// Form Section Components
const PersonalInfoSection = ({
  formData,
  updateField,
  errors,
  clearFieldError,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Box
        sx={{
          p: 3,
          border: "2px dashed #1a237e",
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "#f8f9ff",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#f0f2ff",
            borderColor: "#283593",
          },
        }}
      >
        <Button
          component="label"
          variant="outlined"
          size="large"
          startIcon={<UploadIcon />}
          sx={{
            borderRadius: 2,
            borderColor: "#1a237e",
            color: "#1a237e",
            borderWidth: 2,
            py: 1.5,
            px: 3,
            "&:hover": {
              borderColor: "#283593",
              bgcolor: "#e8eaf6",
              borderWidth: 2,
            },
          }}
        >
          {formData.isParsingResume ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Parsing Resume...
            </>
          ) : (
            "Upload Resume"
          )}
          <input
            type="file"
            hidden
            onChange={(e) => updateField("resume", e.target.files[0])}
            accept=".pdf,.doc,.docx"
            disabled={formData.isParsingResume}
          />
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Supported formats: PDF, DOC, DOCX (Max 5MB)
        </Typography>
        {formData.resume && (
          <Alert
            severity="success"
            sx={{ mt: 2, maxWidth: 400, mx: "auto" }}
            icon={<CheckCircleIcon />}
          >
            <Typography variant="body2">
              <strong>{formData.resume.name}</strong> uploaded successfully
              {formData.isParsingResume && " - Extracting data..."}
            </Typography>
          </Alert>
        )}
        {formData.resumeError && (
          <Alert
            severity="warning"
            sx={{ mt: 2, maxWidth: 400, mx: "auto" }}
          >
            <Typography variant="body2">
              {formData.resumeError}
            </Typography>
          </Alert>
        )}
      </Box>
    </Grid>
    
    <Grid item xs={12}>
      <StyledTextField
        label="Full Name"
        name="candidateName"
        value={formData.candidateName}
        onChange={(e) => {
          updateField("candidateName", e.target.value);
          clearFieldError("candidateName");
        }}
        fullWidth
        required
        error={!!errors.candidateName}
        helperText={errors.candidateName}
        placeholder="Enter your full name"
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Email Address"
        name="candidateEmail"
        type="email"
        value={formData.candidateEmail}
        onChange={(e) => {
          updateField("candidateEmail", e.target.value);
          clearFieldError("candidateEmail");
        }}
        fullWidth
        required
        error={!!errors.candidateEmail}
        helperText={errors.candidateEmail}
        placeholder="your.email@example.com"
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Phone Number"
        name="candidateNumber"
        value={formData.candidateNumber}
        onChange={(e) => {
          updateField("candidateNumber", e.target.value);
          clearFieldError("candidateNumber");
        }}
        fullWidth
        required
        error={!!errors.candidateNumber}
        helperText={errors.candidateNumber}
        placeholder="10-digit phone number"
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => {
          updateField("dateOfBirth", e.target.value);
          clearFieldError("dateOfBirth");
        }}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth}
        inputProps={{
          max: (() => {
            const today = new Date();
            today.setFullYear(today.getFullYear() - 18);
            return today.toISOString().split("T")[0];
          })(),
        }}
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <FormControl fullWidth required error={!!errors.gender}>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={(e) => {
            updateField("gender", e.target.value);
            clearFieldError("gender");
          }}
          label="Gender"
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
          <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
        </Select>
        {errors.gender && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
            {errors.gender}
          </Typography>
        )}
      </FormControl>
    </Grid>
    
    <Grid item xs={12}>
      <StyledTextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={(e) => {
          updateField("address", e.target.value);
          clearFieldError("address");
        }}
        fullWidth
        multiline
        rows={3}
        required
        error={!!errors.address}
        helperText={errors.address}
        placeholder="Complete address with city, state, and postal code"
      />
    </Grid>
  </Grid>
);

const EducationSection = ({
  formData,
  updateField,
  errors,
  clearFieldError,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <StyledTextField
        label="Highest Qualification"
        name="highestQualification"
        value={formData.highestQualification}
        onChange={(e) => {
          updateField("highestQualification", e.target.value);
          clearFieldError("highestQualification");
        }}
        fullWidth
        required
        error={!!errors.highestQualification}
        helperText={errors.highestQualification}
        placeholder="e.g., Bachelor's in Computer Science"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="10th Grade Percentage"
        name="tenthPercentage"
        type="number"
        inputProps={{ min: 0, max: 100, step: 0.01 }}
        value={formData.tenthPercentage}
        onChange={(e) => {
          updateField("tenthPercentage", e.target.value);
          clearFieldError("tenthPercentage");
        }}
        fullWidth
        required
        error={!!errors.tenthPercentage}
        helperText={errors.tenthPercentage}
        placeholder="0-100"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="12th Grade Percentage"
        name="twelvthPercentage"
        type="number"
        inputProps={{ min: 0, max: 100, step: 0.01 }}
        value={formData.twelvthPercentage}
        onChange={(e) => {
          updateField("twelvthPercentage", e.target.value);
          clearFieldError("twelvthPercentage");
        }}
        fullWidth
        required
        error={!!errors.twelvthPercentage}
        helperText={errors.twelvthPercentage}
        placeholder="0-100"
      />
    </Grid>
    <Grid item xs={12}>
      <StyledTextField
        label="Year of Passing"
        name="yearOfPassing"
        type="number"
        inputProps={{ min: 1950, max: new Date().getFullYear() }}
        value={formData.yearOfPassing}
        onChange={(e) => {
          updateField("yearOfPassing", e.target.value);
          clearFieldError("yearOfPassing");
        }}
        fullWidth
        required
        error={!!errors.yearOfPassing}
        helperText={errors.yearOfPassing}
        placeholder={`e.g., ${new Date().getFullYear()}`}
      />
    </Grid>
  </Grid>
);

const ProfessionalSection = ({
  formData,
  updateField,
  errors,
  clearFieldError,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <StyledTextField
        label="Current/Desired Designation"
        name="designation"
        value={formData.designation}
        onChange={(e) => {
          updateField("designation", e.target.value);
          clearFieldError("designation");
        }}
        fullWidth
        required
        error={!!errors.designation}
        helperText={errors.designation}
        placeholder="e.g., Senior Software Engineer"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Overall Experience (years)"
        name="overallExperience"
        type="number"
        inputProps={{ min: 0, step: 0.5 }}
        value={formData.overallExperience}
        onChange={(e) => {
          updateField("overallExperience", e.target.value);
          clearFieldError("overallExperience");
        }}
        fullWidth
        required
        error={!!errors.overallExperience}
        helperText={errors.overallExperience}
        placeholder="0.5, 1, 2.5, etc."
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Relevant Experience (years)"
        name="relevantExperience"
        type="number"
        inputProps={{ min: 0, step: 0.5 }}
        value={formData.relevantExperience}
        onChange={(e) => {
          updateField("relevantExperience", e.target.value);
          clearFieldError("relevantExperience");
        }}
        fullWidth
        required
        error={!!errors.relevantExperience}
        helperText={errors.relevantExperience}
        placeholder="Experience in relevant field"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Current CTC (Annual)"
        name="currentCTC"
        type="number"
        inputProps={{ min: 0 }}
        value={formData.currentCTC}
        onChange={(e) => {
          updateField("currentCTC", e.target.value);
          clearFieldError("currentCTC");
        }}
        fullWidth
        required
        error={!!errors.currentCTC}
        helperText={errors.currentCTC}
        placeholder="Amount in your local currency"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <StyledTextField
        label="Expected CTC (Annual)"
        name="expectedCTC"
        type="number"
        inputProps={{ min: 0 }}
        value={formData.expectedCTC}
        onChange={(e) => {
          updateField("expectedCTC", e.target.value);
          clearFieldError("expectedCTC");
        }}
        fullWidth
        required
        error={!!errors.expectedCTC}
        helperText={errors.expectedCTC}
        placeholder="Expected salary"
      />
    </Grid>
    <Grid item xs={12}>
      <StyledTextField
        label="Notice Period (days)"
        name="noticePeriod"
        type="number"
        inputProps={{ min: 0 }}
        value={formData.noticePeriod}
        onChange={(e) => {
          updateField("noticePeriod", e.target.value);
          clearFieldError("noticePeriod");
        }}
        fullWidth
        required
        error={!!errors.noticePeriod}
        helperText={errors.noticePeriod}
        placeholder="e.g., 30, 60, 90"
      />
    </Grid>
  </Grid>
);

const AdditionalInfoSection = ({
  formData,
  updateField,
  updateTechStack,
  addTechStackField,
  removeTechStackField,
  errors,
  clearFieldError,
}) => {
  const [newSkill, setNewSkill] = React.useState("");

  const handleAddSkill = () => {
    const value = (newSkill || "").trim();
    if (!value) return;
    const emptyIndex = (formData.techStack || []).findIndex((s) => !s || (s + "").trim() === "");
    if (emptyIndex !== -1) {
      updateTechStack(emptyIndex, value);
    } else {
      const nextIndex = (formData.techStack || []).length;
      addTechStackField();
      setTimeout(() => updateTechStack(nextIndex, value), 0);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (index) => {
    removeTechStackField(index);
  };

  return (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <StyledTextField
        label="Citizenship/Nationality"
        name="citizenship"
        value={formData.citizenship}
        onChange={(e) => {
          updateField("citizenship", e.target.value);
          clearFieldError("citizenship");
        }}
        fullWidth
        required
        error={!!errors.citizenship}
        helperText={errors.citizenship}
        placeholder="e.g., Indian, American, British"
      />
    </Grid>

    <Grid item xs={12}>
      <Box
        sx={{
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#fafafa",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={formData.willingToRelocate}
              onChange={(e) =>
                updateField("willingToRelocate", e.target.checked)
              }
              color="primary"
              size="medium"
            />
          }
          label={
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Willing to Relocate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Are you open to relocating for this position?
              </Typography>
            </Box>
          }
        />
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#1a237e", fontWeight: 600 }}
      >
        Technical Skills
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs>
          <StyledTextField
            label="Add Technology/Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
            fullWidth
            placeholder="e.g., React, Node.js, Python"
          />
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleAddSkill}
            color="primary"
            sx={{ bgcolor: "#e3f2fd", "&:hover": { bgcolor: "#bbdefb" } }}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      {(formData.techStack || []).map((tech, index) => (
        (tech || '').trim() ? (
          <Chip
            key={`${tech}-${index}`}
            label={tech}
            onDelete={() => handleRemoveSkill(index)}
            sx={{ mr: 1, mb: 1 }}
            color="primary"
            variant="outlined"
          />
        ) : null
      ))}
      {Array.isArray(formData.techStack) && formData.techStack.filter((s) => (s || "").trim().length > 0).length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected: {formData.techStack.filter((s) => (s || "").trim().length > 0).join(", ")}
          </Typography>
        </Box>
      )}
    </Grid>
  </Grid>
  );
};

// Main Component
const CandidateForm = () => {
  const [activeStep, setActiveStep] = useState(FORM_STEPS.PERSONAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [result, setResult] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  const data = useParams();
  let organizationCode = data.organizationCode;
  let jobId = data.jobId;
  let apikey = data.apikey;

  const getJobDetails = async () => {
    const response = await axios.get(
      `${base_hr}/hr-handler/job/getdata-by-jobId?jobId=${jobId}`
    );
    console.log(response.data);
    setJobDetails(response.data);
  };

  const getcheck = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/api-key/validate-apikey?organizationCode=${organizationCode}&jobId=${jobId}&apiKey=${apikey}`
      );
      console.log(response.data);
      setResult(response.data.result === true);
    } catch (error) {
      console.log(error);
      setResult(false);
    }
  };

  useEffect(() => {
    getcheck();
    getJobDetails();
  }, []);

  const {
    formData,
    updateField,
    updateTechStack,
    addTechStackField,
    removeTechStackField,
    resetForm,
  } = useFormData();

  const { errors, validateSection, clearFieldError } = useFormValidation(
    formData,
    activeStep
  );

  // Auto-calculate candidate rating (out of 5) based on job requirements and experience
  useEffect(() => {
    try {
      const requirements =
        jobDetails?.[0]?.jobContents?.Requirments ||
        jobDetails?.jobContents?.Requirments ||
        jobDetails?.[0]?.jobContents?.Requirements ||
        jobDetails?.jobContents?.Requirements ||
        [];

      if (!Array.isArray(requirements)) return;

      const candidateSkills = Array.isArray(formData.techStack)
        ? formData.techStack
        : [];

      const normalize = (s) => (s || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9+.# ]+/g, "");

      const reqNorm = requirements.map(normalize).filter(Boolean);
      const candNorm = candidateSkills.map(normalize).filter(Boolean);

      const totalReq = reqNorm.length || 1;
      const matched = reqNorm.reduce((count, req) => {
        const found = candNorm.some((skill) => skill === req || skill.includes(req) || req.includes(skill));
        return count + (found ? 1 : 0);
      }, 0);

      const skillMatchRatio = Math.max(0, Math.min(1, matched / totalReq));

      const parseYearsFromRange = (rangeStr) => {
        if (!rangeStr) return null;
        const nums = (rangeStr.match(/\d+(?:\.\d+)?/g) || []).map(parseFloat);
        if (nums.length === 0) return null;
        if (nums.length === 1) return nums[0];
        return (nums[0] + nums[1]) / 2;
      };

      const requiredYears = parseYearsFromRange(jobDetails?.[0]?.experince || jobDetails?.experince);
      const candidateYears = parseFloat(formData.overallExperience) || 0;
      let expRatio = 1;
      if (requiredYears && requiredYears > 0) {
        expRatio = Math.max(0, Math.min(1, candidateYears / requiredYears));
      }

      const ratingOutOfFive = 5 * (0.8 * skillMatchRatio + 0.2 * expRatio);
      const finalRating = Math.round(ratingOutOfFive * 10) / 10;

      updateField("rating", finalRating);
    } catch (err) {
      // ignore
    }
  }, [jobDetails, formData.techStack, formData.overallExperience, updateField]);

  // Form section renderer
  const renderFormSection = useMemo(() => {
    const sectionProps = {
      formData,
      updateField,
      updateTechStack,
      addTechStackField,
      removeTechStackField,
      errors,
      clearFieldError,
    };

    switch (activeStep) {
      case FORM_STEPS.PERSONAL:
        return <PersonalInfoSection {...sectionProps} />;
      case FORM_STEPS.EDUCATION:
        return <EducationSection {...sectionProps} />;
      case FORM_STEPS.PROFESSIONAL:
        return <ProfessionalSection {...sectionProps} />;
      case FORM_STEPS.ADDITIONAL:
        return <AdditionalInfoSection {...sectionProps} />;
      default:
        return null;
    }
  }, [
    activeStep,
    formData,
    errors,
    updateField,
    updateTechStack,
    addTechStackField,
    removeTechStackField,
    clearFieldError,
  ]);

  const handleNext = useCallback(() => {
    if (validateSection()) {
      setActiveStep((prev) => Math.min(prev + 1, SECTIONS_CONFIG.length - 1));
    }
  }, [validateSection]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateSection()) return;

    setIsSubmitting(true);
    try {
      const apiData = {
  candidateId: formData.candidateId?.toString() ?? "", // string
  jobId: jobId?.toString() ?? "", // string
  organizationCode: organizationCode?.toString() ?? "", // string
  name: formData.candidateName?.toString() ?? "",
  email: formData.candidateEmail?.toString() ?? "",
  number: formData.candidateNumber?.toString() ?? "",
  designation: formData.designation?.toString() ?? "",
  dateOfBirth: formData.dateOfBirth?.toString() ?? "", // string ($date)
  address: formData.address?.toString() ?? "",
  overAllExperience: parseFloat(formData.overallExperience) || 0, // number ($double)
  relevantExperience: parseFloat(formData.relevantExperience) || 0, // number ($double)
  rating: parseFloat(formData.rating) || 1, // number ($double)
  highQualification: formData.highestQualification?.toString() ?? "",
  tenthPercentage: formData.tenthPercentage?.toString() ?? "",
  twelvthPercentage: formData.twelvthPercentage?.toString() ?? "",
  yearOfPassing: parseInt(formData.yearOfPassing) || 0, // integer ($int32)
  techStack: Array.isArray(formData.techStack)
    ? formData.techStack
    : (formData.techStack || "").split(","), // array
  gender: formData.gender?.toString() ?? "",
  hearAboutJob: formData.howHeardAboutJob?.toString() ?? "", // corrected key
  citizenship: formData.citizenship?.toString() ?? "",
  currentCTC: parseFloat(formData.currentCTC) || 0, // number ($double)
  expectationCTC: parseFloat(formData.expectedCTC) || 0, // number ($double)
  noticePeriod: parseInt(formData.noticePeriod) || 0, // integer ($int32)
  relocate: formData.willingToRelocate === "true" || formData.willingToRelocate === true, // boolean
  resume: formData.resume || "" // string ($binary) -> e.g. Base64 file
};


      const formDataToSend = new FormData();
      for (const key in apiData) {
        formDataToSend.append(key, apiData[key]);
      }
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch(
        `${base_candidate}/candidate-handler/info/add-details-candidate-data`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        let errorMsg = "You have already applied for this job.";
        try {
          const data = await response.json();
          errorMsg = data.message || data.error || errorMsg;
        } catch {
          try {
            errorMsg = await response.text();
            console.error("Error response text:", errorMsg);
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const result = await response.text();
      if (result === "success") {
        setIsSubmitted(true);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbarMsg(error.message || "Failed to submit application. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateSection, formData, jobId, organizationCode]);

  const handleNewApplication = useCallback(() => {
    setIsSubmitted(false);
    resetForm();
    setActiveStep(FORM_STEPS.PERSONAL);
  }, [resetForm]);

  // Loading state (also wait for API key validation to resolve to avoid flash)
  if (loading || result === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} sx={{ color: "#1a237e" }} />
      </Box>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Zoom in timeout={800}>
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 60,
                  color: "#4CAF50",
                }}
              />
            </Box>
            <Typography
              variant="h3"
              sx={{
                color: "#1a237e",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Application Submitted!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 500,
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Thank you for submitting your application. We have received your
              details and will review them carefully. Our team will get back to
              you within 2-3 business days.
            </Typography>
            <ActionButton
              variant="outlined"
              size="large"
              onClick={handleNewApplication}
              sx={{
                borderColor: "#1a237e",
                color: "#1a237e",
                "&:hover": {
                  borderColor: "#283593",
                  bgcolor: "#e8eaf6",
                },
              }}
            >
              Submit Another Application
            </ActionButton>
          </Box>
        </Zoom>
      </Container>
    );
  }

  // Main form
  return (
    <>
      {!result ? (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              gap: 3,
            }}
          >
            <ErrorIcon sx={{ fontSize: 60, color: "#d32f2f", mb: 2 }} />
            <Typography
              variant="h4"
              sx={{ color: "#1a237e", fontWeight: 700, mb: 1 }}
            >
              Invalid Access
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Required information is missing. Please access the application form
              from a valid job link or contact your administrator.
            </Typography>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="lg">
          <StyledPaper elevation={8}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#1a237e",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Job Application Form
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complete all sections to submit your application
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 5,
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#1a237e",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#1a237e",
                },
                "& .MuiStepConnector-line": {
                  borderTopWidth: 3,
                },
              }}
            >
              {SECTIONS_CONFIG.map((section, index) => (
                <Step key={section.title}>
                  <StepLabel
                    StepIconProps={{
                      icon: section.icon,
                      sx: {
                        "& .MuiStepIcon-text": {
                          fill: "white",
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {section.title}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Form Content */}
            <Fade in={true} key={activeStep} timeout={600}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: "#1a237e",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {SECTIONS_CONFIG[activeStep].icon}
                  {SECTIONS_CONFIG[activeStep].title}
                </Typography>

                {renderFormSection}

                {/* Navigation */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 5,
                    pt: 3,
                    borderTop: "2px solid #f0f0f0",
                  }}
                >
                  <ActionButton
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<BackIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: activeStep === 0 ? "#ccc" : "#1a237e",
                      color: activeStep === 0 ? "#ccc" : "#1a237e",
                      "&:hover": {
                        borderColor: activeStep === 0 ? "#ccc" : "#283593",
                        bgcolor: activeStep === 0 ? "transparent" : "#e8eaf6",
                      },
                    }}
                  >
                    Back
                  </ActionButton>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Step {activeStep + 1} of {SECTIONS_CONFIG.length}
                    </Typography>
                    <Box
                      sx={{
                        width: 100,
                        height: 6,
                        bgcolor: "#e0e0e0",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${
                            ((activeStep + 1) / SECTIONS_CONFIG.length) * 100
                          }%`,
                          height: "100%",
                          bgcolor: "#1a237e",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  <ActionButton
                    variant="contained"
                    onClick={
                      activeStep === SECTIONS_CONFIG.length - 1
                        ? handleSubmit
                        : handleNext
                    }
                    endIcon={
                      activeStep === SECTIONS_CONFIG.length - 1 ? (
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <CheckCircleIcon />
                        )
                      ) : (
                        <NextIcon />
                      )
                    }
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#1a237e",
                      "&:hover": {
                        bgcolor: "#283593",
                      },
                      "&:disabled": {
                        bgcolor: "#ccc",
                      },
                    }}
                  >
                    {activeStep === SECTIONS_CONFIG.length - 1
                      ? isSubmitting
                        ? "Submitting..."
                        : "Submit Application"
                      : "Next Step"}
                  </ActionButton>
                </Box>
              </Box>
            </Fade>
          </StyledPaper>

          {/* Global Styles for animations */}
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
              
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
              }
            `}
          </style>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              variant="filled"
              elevation={6}
              sx={{ width: "100%" }}
            >
              {snackbarMsg.length<100 ? snackbarMsg :  "There are some validation errors in the form. Please check the fields and try again."}
            
            </Alert>
          </Snackbar>
        </Container>
      )}
    </>
  );
};

export default CandidateForm;