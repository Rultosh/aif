import './App.css';
import Header from './components/Header'
import EligibilityQuestioner from './features/eligibilityQuesioner/EligibilityQuestionerComponent'
import EligibilityResults from './features/eligibilityResults/EligibilityResultsComponent'
import { useState, useEffect, createContext, useContext } from "react"
import { Route, Routes } from "react-router"
import { useNavigate } from 'react-router-dom';
import Landing from './features/landing/LandingComponent'
import SignUp from './features/signUp/SignUpComponent'
import ResetPassword from './features/resetPassword/ResetPasswordComponent'
import ForgotPassword from './features/forgotPassword/ForgotPasswordComponent'
import ChangePassword from './features/changePassword/ChangePasswordComponent'
import { useAppSelector, useAppDispatch } from './app/hooks'
import FundOverview from './features/fundOverview/FundOverviewComponent';
import Fund from './features/fundOverview/Fund'
import SelfRating from './features/fundOverview/subsections/selfRating/SelfRating'
import Declaration from './features/fundOverview/subsections/declaration/Declaration'
import Preview from './features/fundOverview/subsections/preview/Preview'
import Home from './features/home/HomeComponent'
import Admin from './features/admin/AdminComponent'
import ProfileComponent from './features/profile/ProfileComponent'
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
import { PrivateRoute } from './components/auth/PrivateRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { UserAdminRoute } from './components/auth/UserAdminRoute';
import { CheckAuth } from '../src/app/api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Button, Snackbar, Typography } from '@mui/material';
import BackgroundPattern from './components/BackgroundPattern';
import { refreshAccessToken } from './app/api';
// import useCookie, { getCookie } from 'react-use-cookie';

// let initialState = {
//   shoppingList : 'test'
// }

// export const UserContext = createContext(initialState);

function App() {
  // const [user, setUser] = useState(null);
  // const [selfRatingLink, setSelfRatingLink] = useCookie('selfRatingLink', '0');

  // let { shoppingList } = useContext(UserContext);
  // console.log(shoppingList);
  const userLogged = !!useAppSelector(state => state.auth.token);
  const checkIsCorrectStateToUpdate = (data: any, keyObj: any) => {
    let tempVal = false
    let keys = Object.keys(keyObj);
    let checkData = (data && typeof (data[Object.keys(data)[0]]) === 'object') ? data[Object.keys(data)[0]] : data
    keys.forEach((key) => {

      if (key != 'id' && key != 'parentId' && checkData.hasOwnProperty(key)) {
        tempVal = true;
      }
    });
    return tempVal
  }
  const THEME = createTheme({
    typography: {
      "fontFamily": "'Poppins', sans-serif",
    }
  });
  const navigate = useNavigate();
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  const logoutToLogin = () => {
    localStorage.clear();
    CheckAuth.setIsUnauthorized();
    setShowExpiryDialog(false);
    setSessionEndsAt(null);
    navigate('/login');
  };

  const parseTokenExpiry = (token: string): number | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        '='
      );
      const decodedPayload = JSON.parse(window.atob(paddedPayload));
      if (!decodedPayload?.exp) {
        return null;
      }
      return Number(decodedPayload.exp) * 1000;
    } catch (error) {
      return null;
    }
  };

  const refreshTokenManually = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        logoutToLogin();
        return;
      }
      const updatedToken = localStorage.getItem('token');
      if (updatedToken) {
        const nextExpiry = parseTokenExpiry(updatedToken);
        setSessionEndsAt(nextExpiry);
      }
      setShowExpiryDialog(false);
    } catch (error) {
      logoutToLogin();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSessionEndsAt(null);
      setShowExpiryDialog(false);
      return;
    }
    const expiry = parseTokenExpiry(token);
    setSessionEndsAt(expiry);
  }, [userLogged]);

  useEffect(() => {
    if (!sessionEndsAt) {
      return;
    }

    const now = Date.now();
    const warningDelay = Math.max(sessionEndsAt - now - 60000, 0);
    const logoutDelay = Math.max(sessionEndsAt - now, 0);

    const warningTimer = window.setTimeout(() => {
      setShowExpiryDialog(true);
    }, warningDelay);

    const logoutTimer = window.setTimeout(() => {
      logoutToLogin();
    }, logoutDelay);

    return () => {
      window.clearTimeout(warningTimer);
      window.clearTimeout(logoutTimer);
    };
  }, [sessionEndsAt]);

  useEffect(() => {
    if (!showExpiryDialog || !sessionEndsAt) {
      setSecondsRemaining(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(Math.ceil((sessionEndsAt - Date.now()) / 1000), 0);
      setSecondsRemaining(remaining);
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [showExpiryDialog, sessionEndsAt]);

  //   useEffect(() => {
  //     setSelfRatingLink('0');
  // })

  return (
    <ThemeProvider theme={THEME}>
      <div className="App"  >
        {/* <BackgroundPattern /> */}
        <Header className="App-header">
        </Header>
        <Routes>
          <Route path='/' element={userLogged ? <Home /> : <Landing />}></Route>
          <Route path='/admin' element={
            <UserAdminRoute> <Admin checkUnAuth={CheckAuth.isUnauthorized} /> </UserAdminRoute>
          }></Route>
          <Route path='/login' element={<Landing />}></Route>
          <Route path='eligibilityQuestioner' element={<EligibilityQuestioner />}></Route>
          <Route path='eligibilityResults' element={<EligibilityResults />}></Route>
          <Route path='signUp' element={<SignUp />}></Route>
          <Route path='resetPassword' element={<ResetPassword />}></Route>
          <Route path='setPassword' element={<ForgotPassword />}></Route>

          <Route path='/detailed/sidbiReference'
            element={
              <PrivateRoute>
                <SidbiReference checkUnAuth={CheckAuth.isUnauthorized} />
              </PrivateRoute>
            }>
          </Route>

          <Route path='home'
            element={
              <PrivateRoute>
                <Home checkUnAuth={CheckAuth.isUnauthorized} />
              </PrivateRoute>
            }>
          </Route>

          <Route path='profile'
            element={
              <PrivateRoute>
                <ProfileComponent />
              </PrivateRoute>
            }>
          </Route>

          <Route path='workflow' element={
            <PrivateRoute>
              <Workflow checkUnAuth={CheckAuth.isUnauthorized} />
            </PrivateRoute>
          }>
          </Route>

          <Route path='changePassword'
            element={
              <PrivateRoute>
                <ChangePassword checkUnAuth={CheckAuth.isUnauthorized} />
              </PrivateRoute>
            }>
          </Route>

          <Route path='preliminary'
            element={
              <PrivateRoute>
                <FundOverview checkUnAuth={CheckAuth.isUnauthorized} />
              </PrivateRoute>
            }>
          </Route>

          <Route path='preliminary/:id'
            element={
              <PrivateRoute>
                <FundOverview checkUnAuth={CheckAuth.isUnauthorized} />
              </PrivateRoute>
            }>

            <Route path='fund'
              element={
                <PrivateRoute>
                  <Fund checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='profile'
              element={
                <PrivateRoute>
                  <ProfileNew checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='selfRating'
              element={
                <PrivateRoute>
                  <SelfRating checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='declaration'
              element={
                <PrivateRoute>
                  <Declaration checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='preview'
              element={
                <PrivateRoute>
                  <Preview checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

          </Route>

          <Route path='Detailed' element={<DetailedApplicationComponent />}></Route>

          <Route path='Detailed/:id'
            element={
              <PrivateRoute>
                <DetailedApplicationComponent />
              </PrivateRoute>
            }>

            <Route path='detailed2A'
              element={
                <PrivateRoute>
                  <DetailedApplication2A checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2B'
              element={
                <PrivateRoute>
                  <DetailedApplication2B isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2C'
              element={
                <PrivateRoute>
                  <DetailedApplication2C isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2D'
              element={
                <PrivateRoute>
                  <DetailedApplication2D isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2E'
              element={
                <PrivateRoute>
                  <DetailedApplication2E isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2F'
              element={
                <PrivateRoute>
                  <DetailedApplication2F isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2G'
              element={
                <PrivateRoute>
                  <DetailedApplication2G isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2H'
              element={
                <PrivateRoute>
                  <DetailedApplication2H isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2I'
              element={
                <PrivateRoute>
                  <DetailedApplication2I isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2J'
              element={
                <PrivateRoute>
                  <DetailedApplication2J isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='detailed2K'
              element={
                <PrivateRoute>
                  <DetailedApplication2K isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='InvestmentThemeOfFund'
              element={
                <PrivateRoute>
                  <InvestmentThemeOfFund isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='EngagementAndRole'
              element={
                <PrivateRoute>
                  <EngagementAndRole isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='SidbiReference'
              element={
                <PrivateRoute>
                  <SidbiReference checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>

            <Route path='carryDistribution'
              element={
                <PrivateRoute>
                  <CarryDistribution isCrtStateToUpdate={checkIsCorrectStateToUpdate} checkUnAuth={CheckAuth.isUnauthorized} />
                </PrivateRoute>
              }>
            </Route>
          </Route>
        </Routes>
        <Snackbar
          open={showExpiryDialog}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={null}
        >
          <Alert
            severity="warning"
            variant="filled"
            sx={{ width: '100%', alignItems: 'center' }}
            action={
              <>
                <Button onClick={logoutToLogin} color="inherit" size="small">
                  Logout
                </Button>
                <Button onClick={refreshTokenManually} disabled={isRefreshing} color="inherit" size="small">
                  {isRefreshing ? 'Refreshing...' : 'Refresh token'}
                </Button>
              </>
            }
          >
            <Typography sx={{ fontSize: 14 }}>
              Your session will expire in less than 1 minute. You might lose unsaved information.
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Time remaining: {secondsRemaining}s
            </Typography>
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
