import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, Typography, Breadcrumbs, Link as LinkMui } from '@mui/material';
import { Link, useNavigate, Outlet, useParams, useLocation } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect, useContext } from "react"
import fundImg from '../../images/fund.png'
import decImg from '../../images/declaration.png'
import selfRatingImg from '../../images/rating.png'
import profileImg from '../../images/profile.png'
import IconButton from '@mui/material/IconButton';
import { selectUsers } from '../admin/adminSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getPrelimApplicationData, selectPrelimApplication, PrelimApplicationState } from "../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice"
import { wrapArgument } from '../../lib/api-status/actionWrapper'
import uuid from 'react-uuid'
import { selectSelfRatings } from "../fundOverview/subsections/selfRating/selfRatingSlice"
// import { UserContext } from '../../App';
// import useCookie, { getCookie } from 'react-use-cookie';
// import WarningIcon from '@mui/icons-material/Warning';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import GridViewIcon from '@mui/icons-material/GridView';
import signupBg from '../../images/signup_ai.jpeg';
import RestrictedPage from '../../components/RestrictedPage';
import { FetchStatus, ResponseCode } from '../../lib/api-status/IStatus';

export const FundOverview = (props: any) => {
    // let { shoppingList } = useContext(UserContext);
    // const [user, setUser] = useState(shoppingList);

    const { id } = useParams();
    const [localId, setLocalId] = useState<string>();
    const dispatch = useAppDispatch();
    const [actionUid] = useState(uuid());
    const usersState = useAppSelector(selectUsers)
    const prelimApplicationState: PrelimApplicationState = useAppSelector(selectPrelimApplication);
    const selfRatingState = useAppSelector(selectSelfRatings);
    const statusPrelims = prelimApplicationState.prelimApplication.status || '';
    const navigate = useNavigate();

    const { pathname } = useLocation();
    // const selfRatingCookie = getCookie('selfRating') || '0';
    // const [selfRating, setSelfRating] = useCookie('selfRating', selfRatingCookie);
    // const [selfRatingLink, setSelfRatingLink] = useCookie('selfRatingLink', '0');

    useEffect(() => {
        if (props.checkUnAuth) {
            navigate('/login')
        }
        // if(selfRatingLink == '0'){
        // setSelfRating('0');
        // }
    })

    useEffect(() => {
        if (!id) {
            navigate("/preliminary/NEW/selfrating")
            // navigate("/preliminary/1/selfrating")
        }
    });

    /** Draft (CREATED) or returned for revision (REVISE)—both use the preliminary wizard; other statuses cannot. */
    const USER_PRELIM_ALLOWED_STATUSES = ['CREATED', 'REVISE'] as const;
    const isNewApplicationRoute = !id || String(id).toUpperCase() === 'NEW';

    useEffect(() => {
        if (isNewApplicationRoute) return;
        const numericId = Number(id);
        if (Number.isNaN(numericId)) return;
        if (Number(prelimApplicationState.prelimApplication.id) !== numericId) {
            dispatch(getPrelimApplicationData(wrapArgument(actionUid, numericId)));
        }
    }, [id, dispatch, actionUid, isNewApplicationRoute, prelimApplicationState.prelimApplication.id]);

    type dropDownValues = {
        data: any,
        arrowUp: boolean,

    }

    type InitialState = {
        id: string,
        value: any
    }


    const initialState: InitialState = {
        id: "1",
        value: { data: [], arrowUp: true } as dropDownValues
    };
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const isUserPermittedToView = () => {
        if (usersState.role == 'USER' && !(['SUBMITTED', 'REVIEWED', 'APPROVED'].includes(statusPrelims.toString()))) {
            return true;
        }
        return false
    };


    const allSteps = [
        { label: 'Initial Assessment', path: 'selfrating' },
        { label: 'Fund Information', path: 'fund' },
        // { label: 'Profile', path: 'profile' },
        { label: 'KYC, Supporting Documents & Declaration', path: 'declaration' },
        { label: 'Preview', path: 'preview' },
    ];

    const filteredSteps = ['USERADMIN', 'ADMIN'].includes(usersState.role || '')
        ? allSteps.filter(s => s.path === 'preview')
        : allSteps;

    const currentStep = filteredSteps.find(s => pathname.toLowerCase().includes(s.path.toLowerCase()))?.label || 'Application';

    const userCannotAccessPreliminary =
        usersState.role === 'USER' &&
        !isNewApplicationRoute &&
        statusPrelims !== '' &&
        statusPrelims !== undefined &&
        !(USER_PRELIM_ALLOWED_STATUSES as readonly string[]).includes(String(statusPrelims)) &&
        !pathname.toLowerCase().includes('preview');

    /** Admins review after submit; no access while application is still draft (CREATED). */
    const adminCannotAccessPreliminary =
        ['USERADMIN', 'ADMIN'].includes(usersState.role || '') &&
        !isNewApplicationRoute &&
        statusPrelims !== '' &&
        statusPrelims !== undefined &&
        String(statusPrelims) === 'CREATED';

    const applicationNotFound =
        !isNewApplicationRoute &&
        prelimApplicationState.status.fetchStatus === FetchStatus.FAILED &&
        prelimApplicationState.status.responseCode === ResponseCode.NOT_FOUND;

    const isRestricted = applicationNotFound || adminCannotAccessPreliminary || userCannotAccessPreliminary;

    // const pageTitle = id?.toString() === 'NEW' ? 'Add Application' : `Edit Application ${id ? `(${id})` : ''}`;

    return (
        <>
            <Container maxWidth="xl" sx={{ pt: '90px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '30px' }}>
                    <Box>
                        {/* <Typography variant="h5" sx={{ fontWeight: 700, color: '#1842B6', mb: 0.5 }}>
                        {pageTitle}
                    </Typography> */}
                        <Breadcrumbs aria-label="breadcrumb">
                            <LinkMui
                                sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}
                                color="inherit"
                                href="#/home"
                            >
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Home
                            </LinkMui>
                            <Typography variant="body2"
                                sx={{ color: '#000080', fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}
                            >
                                {currentStep}
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    {/* <Box>
                    <Button variant="contained" sx={{ backgroundColor: '#34344b', color: 'white', fontWeight: 600, textTransform: 'capitalize' }} startIcon={<KeyboardDoubleArrowLeftIcon />} className='btn-dark' href="#/home">Back To Application List</Button>
                </Box> */}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {/* Chevron Stepper */}
                    {(!isRestricted && usersState.role === 'USER') && (
                        <Box sx={{ width: '100%', display: 'flex', gap: 0.5 }}>
                            {filteredSteps.map((s, index, array) => {
                                const isNew = id?.toString() === 'NEW';
                                const score = Number(selfRatingState.selfRatings.score || 0);
                                const isFailed = score < 0.7;

                                const currentPath = pathname.toLowerCase();
                                const activeIndex = array.findIndex(item => currentPath.includes(item.path.toLowerCase()));
                                const isCompleted = index < activeIndex;
                                const isActive = index === activeIndex;
                                const isPending = index > activeIndex;

                                const isSelfRatingSubmitted = !!selfRatingState.selfRatings.id;
                                const isDisabled = (isNew && isPending) || (isFailed && isPending) || (isSelfRatingSubmitted && s.path === 'selfrating');

                                // Colors from reference
                                const bgColor = isCompleted ? '#FF671F' : (isActive ? '#000080' : '#818181');

                                return (
                                    <Box
                                        key={s.path}
                                        onClick={() => !isDisabled && navigate(s.path)}
                                        sx={{
                                            flex: 1,
                                            height: '70px',
                                            backgroundColor: bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 4,
                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                            color: 'white',
                                            position: 'relative',
                                            opacity: isDisabled ? 0.6 : 1,
                                            clipPath: index === 0 ? 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)' :
                                                (index === (array.length - 1) ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)' :
                                                    'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)'),
                                            ml: index === 0 ? 0 : -2.5,
                                            zIndex: array.length - index,
                                            transition: 'all 0.3s ease',
                                            '&:hover': { opacity: isDisabled ? 0.6 : 0.9 }
                                        }}
                                    >
                                        {/* Left Icon */}
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            {isCompleted ? (
                                                <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                                            ) : isActive ? (
                                                <Box sx={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: '2px solid white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }} />
                                                </Box>
                                            ) : (
                                                <LockIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                                            )}
                                        </Box>

                                        {/* Labels */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                                {s.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Container>
            <Box sx={{
                flexGrow: 1,
                position: 'relative',
                overflow: 'hidden',
                ...(!isRestricted && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${signupBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(2px)',
                        zIndex: -1
                    }
                })
            }}>
                <Box sx={{ height: '20px' }}></Box>
                {/* Sub-content Area */}
                <Container maxWidth="xl" sx={{ pb: '20px' }}>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        {isRestricted ? (
                            <RestrictedPage />
                        ) : (
                            <Outlet />
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    )
}


export default FundOverview;