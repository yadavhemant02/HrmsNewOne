import React from 'react'
import HeroSection from './HeroSection';
import PlatformFeatures from './PlatformFeature';
import TimeAttendance from './TimeAttendance';
import Payroll from './Payroll';
import PerformanceManagement from './PerformanceManagement';
import RecruitMgmt from './RecruitMgmt';
// import HR360Footer from './HR360Footer';

const Landing = () => {
  return (
   <>
      <HeroSection/>
      <PlatformFeatures/>
      <TimeAttendance/>
      <Payroll/>
      <PerformanceManagement/>
      <RecruitMgmt/>
      {/* <HR360Footer/> */}
   </>
  )
}

export default Landing;