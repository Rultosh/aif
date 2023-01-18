import { configureStore } from '@reduxjs/toolkit'
import eligibilityResultsReducer from '../features/eligibilityResults/eligibilityResultsSice'
import eligibilityQuestionerReducer from '../features/eligibilityQuesioner/eligibiltyQuestionerSlice'
import signupSlice from '../features/signUp/signUpSlice'
import landingReducer from '../features/landing/landingSlice'
import fundOverviewDataReducer from '../features/fundOverview/subsections/fundOverviewData/fundOverviewDataSlice'
import investmentPartnerReducer from '../features/fundOverview/subsections/fundOverviewData/investmentPartner/investmentPartnerSlice'
import profileReducer from '../features/fundOverview/subsections/profile/profileSlice'
import declarationReducer from '../features/fundOverview/subsections/declaration/declarationSlice'
import selfRatingReducer from '../features/fundOverview/subsections/selfRating/selfRatingSlice'
import prelimApplicationDataSlice from '../features/fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice'
import investmentPartnerSlice from '../features/fundOverview/subsections/fundOverviewData/investmentPartner/investmentPartnerSlice'
import homeReducer from '../features/home/homeSlice'
import teamMemberSlice from '../features/fundOverview/subsections/profile-new/teamMember/teamMemberSlice'
import investmentResponsibleAsLeadSlice from '../features/fundOverview/subsections/profile-new/investmentResponsibleAsLead/investmentResponsibleAsLeadSlice'
import investmentResponsibleAsNonLeadSlice from '../features/fundOverview/subsections/profile-new/investmentResponsibleAsNonLead/investmentResponsibleAsNonLeadSlice'
import companyContactDetailsSlice from '../features/fundOverview/subsections/profile-new/companyContactDetails/companyContactDetailsSlice'
import independentReferencesSlice from '../features/fundOverview/subsections/profile-new/independentReferences/independentReferencesSlice'
import detailedApplicationSlice from '../features/detailedApplication/sidbiReference/detailedApplicationSlice'
//import featuresOfFundSlice from '../features/detailedApplication/featureOfFunds/featuresOfFundSlice_dep'
import featuresOfFundSlice from '../features/DetailedApplicationComponent/subsections/2A/featuresOfFundSlice'
import detailedApplication2BSlice from '../features/DetailedApplicationComponent/subsections/2B/detailedApplication2BSlice'
import detailedApplication2CSlice from '../features/DetailedApplicationComponent/subsections/2C/detailedApplication2CSlice'
import detailedApplication2DSlice from '../features/DetailedApplicationComponent/subsections/2D/detailedApplication2DSlice'
import detailedApplication2ESlice from '../features/DetailedApplicationComponent/subsections/2E/detailedApplication2ESlice'
import detailedApplication2GSlice from '../features/DetailedApplicationComponent/subsections/2G/detailedApplication2GSlice'
import detailedApplication2HSlice from '../features/DetailedApplicationComponent/subsections/2H/detailedApplication2HSlice'
import detailedApplication2ISlice from '../features/DetailedApplicationComponent/subsections/2I/detailedApplication2ISlice'
import detailedApplication2JSlice from '../features/DetailedApplicationComponent/subsections/2J/detailedApplication2JSlice'
import carryDistributionSlice from '../features/DetailedApplicationComponent/CarryDistribution/carryDistributionSlice'
import carryDistributionDetailsSlice from '../features/DetailedApplicationComponent/CarryDistribution/carryDistributionDetailsSlice'
import contributorDetailsSlice from '../features/fundOverview/subsections/fundOverviewData/contributorDetails/contributorDetailsSlice'
import investmentAssociateSlice from '../features/fundOverview/subsections/fundOverviewData/investmentAssociate/investmentAssociateSlice'
import investmentPastSlice from '../features/fundOverview/subsections/fundOverviewData/investmentPast/investmentPastSlice'
import sideNavBarSliceReducer from '../features/DetailedApplicationComponent/subsections/sideNavBarSlice'
import engagementAndRoleSlice from '../features/DetailedApplicationComponent/EngagementAndRole/engagementAndRoleSlice'
import authenticationSlice from '../components/auth/authenticationSlice'
import usersSlice from '../features/admin/adminSlice'

const store = configureStore({
  reducer: {
    auth: authenticationSlice,
    home: homeReducer,
    eligibilityResults: eligibilityResultsReducer,
    eligibilityQuestioner: eligibilityQuestionerReducer,
    landing: landingReducer,
    signup: signupSlice,
    fundData: fundOverviewDataReducer,
    investmentPartner: investmentPartnerReducer,
    profile: profileReducer,
    selfRating: selfRatingReducer,
    declaration:declarationReducer,
    prelimApplication: prelimApplicationDataSlice,
    investmentPartners: investmentPartnerSlice,
    teamMembers: teamMemberSlice,
    investmentsAsLead: investmentResponsibleAsLeadSlice,
    investmentsAsNonLead: investmentResponsibleAsNonLeadSlice,
    companyContacts:companyContactDetailsSlice,
    independentReferences: independentReferencesSlice,
    contributorDetails: contributorDetailsSlice,
    investmentAssociate: investmentAssociateSlice,
    investmentPast: investmentPastSlice,
    detailedApplications: detailedApplicationSlice,
    featureOfFunds: featuresOfFundSlice,
    detailedApplication2B: detailedApplication2BSlice,
    detailedApplication2C: detailedApplication2CSlice,
    detailedApplication2D: detailedApplication2DSlice,
    detailedApplication2E: detailedApplication2ESlice,
    detailedApplication2G: detailedApplication2GSlice,
    detailedApplication2H: detailedApplication2HSlice,
    detailedApplication2I: detailedApplication2ISlice,
    detailedApplication2J: detailedApplication2JSlice,
    sideNavBarStore: sideNavBarSliceReducer,
    carryDistribution: carryDistributionSlice,
    carryDistributionDetails: carryDistributionDetailsSlice,
    engagementAndRole: engagementAndRoleSlice,
    users: usersSlice,
  }
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch