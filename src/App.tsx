import './App.css';
import Header from './components/Header'
import EligibilityQuestioner from './features/eligibilityQuesioner/EligibilityQuestionerComponent'
import EligibilityResults from './features/eligibilityResults/EligibilityResultsComponent'
import { useState, useEffect } from "react"
import { Route, Routes } from "react-router"
import { useNavigate } from 'react-router-dom';
import Landing from './features/landing/LandingComponent'
import SignUp from './features/signUp/SignUpComponent'
import ResetPassword from './features/resetPassword/ResetPasswordComponent'
import { useAppSelector, useAppDispatch } from './app/hooks'
import FundOverview from './features/fundOverview/FundOverviewComponent';
import Fund from './features/fundOverview/Fund'
import SelfRating from './features/fundOverview/subsections/selfRating/SelfRating'
import Declaration from './features/fundOverview/subsections/declaration/Declaration'
import Preview from './features/fundOverview/subsections/preview/Preview'
import Home from './features/home/HomeComponent'
import { ProfileNew } from './features/fundOverview/subsections/profile-new/ProfileNew';
import Workflow from './components/Workflow'
import DetailedApplication2A from './features/DetailedApplicationComponent/subsections/2A/detailedApplication2A';
import DetailedApplication2B from './features/DetailedApplicationComponent/subsections/2B/detailedApplication2B';
import DetailedApplication2C from './features/DetailedApplicationComponent/subsections/2C/detailedApplication2C';
import DetailedApplication2D from './features/DetailedApplicationComponent/subsections/2D/detailedApplication2D';
import DetailedApplication2E from './features/DetailedApplicationComponent/subsections/2E/detailedApplication2E';
import DetailedApplication2F from './features/DetailedApplicationComponent/subsections/2F/detailedApplication2F';
import DetailedApplication2G from './features/DetailedApplicationComponent/subsections/2G/detailedApplication2G';
import DetailedApplication2H from './features/DetailedApplicationComponent/subsections/2H/detailedApplication2H';
import DetailedApplication2I from './features/DetailedApplicationComponent/subsections/2I/detailedApplication2I';
import DetailedApplication2J from './features/DetailedApplicationComponent/subsections/2J/detailedApplication2J';
import DetailedApplication2K from './features/DetailedApplicationComponent/subsections/2K/detailedApplication2K';
import InvestmentThemeOfFund from './features/DetailedApplicationComponent/InvestmentThemeOfFund/investmentThemeOfFund';
import EngagementAndRole from './features/DetailedApplicationComponent/EngagementAndRole/engagementAndRole';
import PrelimApp from './features/DetailedApplicationComponent/PrelimApp/prelimApp';
import CarryDistribution from './features/DetailedApplicationComponent/CarryDistribution/carryDistribution'
import DetailedApplicationComponent from './features/DetailedApplicationComponent/DetailedApplicationComponent';
import { SidbiReference } from './features/detailedApplication/sidbiReference/SidbiReference';
import { FeatureOfFunds } from './features/detailedApplication/featureOfFunds/featureOfFunds_dep';


function App() {

  const userLogged = useAppSelector(state => state.landing.validUser);//false;
  const checkIsCorrectStateToUpdate = (data: any, keyObj:any) => {
    let tempVal = false
    let keys = Object.keys(keyObj);
    let checkData = data ? data[Object.keys(data)[0]] : data
    keys.forEach((key) => {
        
        if (key != 'id'  && key != 'parentId' && checkData.hasOwnProperty(key)){
            tempVal =  true;
        }
    });
    return tempVal
}

  return (
    <div className="App"  >
      <Header className="App-header">
      </Header>
      <Routes>
        <Route path='/' element={userLogged ? <Home /> : <Landing />}></Route>
        <Route path='/detailed/sidbiReference' element={<SidbiReference />}></Route>
        {/*<Route path='/detailed/sidbiReference/:id' element={<SidbiReference />}></Route>
        <Route path='/detailed/featureOfFunds/:id' element={<FeatureOfFunds />}></Route>*/}
        <Route path='home' element={<Home />}></Route>
        <Route path='workflow' element={<Workflow />}></Route>
        <Route path='eligibilityQuestioner' element={<EligibilityQuestioner />}></Route>
        <Route path='eligibilityResults' element={<EligibilityResults />}></Route>
        <Route path='signUp' element={<SignUp />}></Route>
        <Route path='resetPassword' element={<ResetPassword />}></Route>
        <Route path='preliminary' element={<FundOverview />}></Route>
        <Route path='preliminary/:id' element={<FundOverview />}>
          <Route path='fund' element={<Fund />}></Route>
          {/* <Route path='fund' element={<Fund />}></Route> */}
          <Route path='profile' element={<ProfileNew />}></Route>
          <Route path='selfRating' element={<SelfRating />}></Route>
          <Route path='declaration' element={<Declaration />}></Route>
          <Route path='preview' element={<Preview />}></Route>
        </Route>
        <Route path='Detailed' element={<DetailedApplicationComponent />}></Route>
        <Route path='Detailed/:id' element={<DetailedApplicationComponent />}>
          <Route path='detailed2A' element={<DetailedApplication2A />}></Route>
          <Route path='detailed2B' element={<DetailedApplication2B isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2C' element={<DetailedApplication2C isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2D' element={<DetailedApplication2D isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2E' element={<DetailedApplication2E isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2F' element={<DetailedApplication2F isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2G' element={<DetailedApplication2G isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2H' element={<DetailedApplication2H isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2I' element={<DetailedApplication2I isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2J' element={<DetailedApplication2J isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='detailed2K' element={<DetailedApplication2K isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='InvestmentThemeOfFund' element={<InvestmentThemeOfFund isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='EngagementAndRole' element={<EngagementAndRole isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          <Route path='SidbiReference' element={<SidbiReference />}></Route>
          {/*<Route path='PrelimApp' element={<PrelimApp />}></Route>*/}
          <Route path='carryDistribution' element={<CarryDistribution isCrtStateToUpdate={checkIsCorrectStateToUpdate}/>}></Route>
          
        </Route>
       
      </Routes>

    </div>
  );
}

export default App;
