import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Breadcrumbs, Avatar, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUsers, updateUserProfileAsync } from '../admin/adminSlice';
import { setSessionTokens } from '../../components/auth/authenticationSlice';
import { wrapArgument } from '../../lib/api-status/actionWrapper';
import NavigationBar from '../../components/NavigationBar';
import HomeIcon from '@mui/icons-material/Home';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegex = /^(?=.*[0-9])[- +()0-9]+$/;

const ProfileComponent = () => {
  const usersState = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [actionUid] = useState(uuid());

  const [profileData, setProfileData] = useState({
    sebiRegistrationNo: '',
    aifName: '',
    emailId: '',
    contactNo: '',
    contactPersonName: ''
  });

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingContactPerson, setIsEditingContactPerson] = useState(false);

  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingContactPerson, setSavingContactPerson] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (usersState.me) {
      setProfileData({
        sebiRegistrationNo: usersState.me.sebiRegistration || '',
        aifName: usersState.me.companyName || '',
        emailId: usersState.me.username || '',
        contactNo: usersState.me.phoneNumber || '',
        contactPersonName: usersState.me.contactPerson || ''
      });
    }
  }, [usersState.me]);

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const applyTokenRefresh = (result: { currentUser?: string; refreshToken?: string }) => {
    if (result.currentUser) {
      dispatch(setSessionTokens({
        token: result.currentUser,
        refreshToken: result.refreshToken || undefined,
      }));
    }
  };

  const handleSaveEmail = async () => {
    const trimmedEmail = profileData.emailId.trim();
    if (!trimmedEmail) {
      showToast('Email is required.', 'error');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Enter a valid email address.', 'error');
      return;
    }
    if (trimmedEmail === (usersState.me?.username || '')) {
      setIsEditingEmail(false);
      return;
    }

    setSavingEmail(true);
    try {
      const result = await dispatch(
        updateUserProfileAsync(wrapArgument(actionUid, { username: trimmedEmail }))
      ).unwrap();
      applyTokenRefresh(result);
      setIsEditingEmail(false);
      showToast('Email updated successfully.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Could not update email.', 'error');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePhone = async () => {
    const trimmedPhone = profileData.contactNo.trim();
    if (!trimmedPhone) {
      showToast('Phone number is required.', 'error');
      return;
    }
    if (!phoneRegex.test(trimmedPhone)) {
      showToast('Enter a valid phone number.', 'error');
      return;
    }
    if (trimmedPhone === (usersState.me?.phoneNumber || '')) {
      setIsEditingPhone(false);
      return;
    }

    setSavingPhone(true);
    try {
      await dispatch(
        updateUserProfileAsync(wrapArgument(actionUid, { phoneNumber: trimmedPhone }))
      ).unwrap();
      setIsEditingPhone(false);
      showToast('Phone number updated successfully.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Could not update phone number.', 'error');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleCancelEmail = () => {
    setProfileData((prev) => ({
      ...prev,
      emailId: usersState.me?.username || '',
    }));
    setIsEditingEmail(false);
  };

  const handleCancelPhone = () => {
    setProfileData((prev) => ({
      ...prev,
      contactNo: usersState.me?.phoneNumber || '',
    }));
    setIsEditingPhone(false);
  };

  const handleSaveContactPerson = async () => {
    const trimmedContactPerson = profileData.contactPersonName.trim();
    if (!trimmedContactPerson) {
      showToast('Contact person name is required.', 'error');
      return;
    }
    if (trimmedContactPerson === (usersState.me?.contactPerson || '')) {
      setIsEditingContactPerson(false);
      return;
    }

    setSavingContactPerson(true);
    try {
      await dispatch(
        updateUserProfileAsync(wrapArgument(actionUid, { contactPerson: trimmedContactPerson }))
      ).unwrap();
      setIsEditingContactPerson(false);
      showToast('Contact person name updated successfully.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Could not update contact person name.', 'error');
    } finally {
      setSavingContactPerson(false);
    }
  };

  const handleCancelContactPerson = () => {
    setProfileData((prev) => ({
      ...prev,
      contactPersonName: usersState.me?.contactPerson || '',
    }));
    setIsEditingContactPerson(false);
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FF671F',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FF671F',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
    }
  };

  return (
    <div className="profileComp">
      <NavigationBar />
      <Container maxWidth="xl" sx={{ pt: '90px', pb: '80px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '30px' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333333' }}>Profile</Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="body2" sx={{ color: '#476bbc', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                Profile
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column (Static Profile Info) */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid #edf2f7',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                background: '#ffffff'
              }}
            >
              {/* Blue Header */}
              <Box sx={{ backgroundColor: '#FF671F', p: 2, position: 'relative' }}>
                {/* <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'right', fontWeight: 500, opacity: 0.9 }}>
                  Joined on {usersState.me?.registeredOn ? new Date(usersState.me.registeredOn).toLocaleDateString('en-GB') : ''}
                </Typography> */}
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600, mt: 1 }}>
                  Profile
                </Typography>
              </Box>

              {/* Avatar and Info */}
              <Box sx={{ px: 3, pb: 4, position: 'relative' }}>

                <Box sx={{ pt: '20px' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.3px', display: 'block' }}>
                        SEBI Registration No.
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 500 }}>
                        {profileData.sebiRegistrationNo || '-'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.3px', display: 'block' }}>
                        AIF Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 500 }}>
                        {profileData.aifName || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column (Editable Contacts) */}
          <Grid item xs={12} md={8}>

            {/* Contact Person Name Section */}
            <Box sx={{ mb: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ color: '#FF671F', mt: 0.5 }}>
                    <PersonOutlineIcon />
                  </Box>
                  <Box>
                    <Chip
                      label="Contact Person Name"
                      size="small"
                      sx={{ height: '22px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', mb: 1, borderRadius: '6px' }}
                    />
                    {isEditingContactPerson ? (
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                          size="small"
                          value={profileData.contactPersonName}
                          onChange={(e) => setProfileData({ ...profileData, contactPersonName: e.target.value })}
                          sx={{ ...fieldSx, width: '250px' }}
                          disabled={savingContactPerson}
                        />
                        <Button variant="contained" size="small" sx={{ bgcolor: '#FF671F', '&:hover': { bgcolor: '#e55a18' }, textTransform: 'none', px: 2, py: 0.8, minWidth: 72 }} onClick={handleSaveContactPerson} disabled={savingContactPerson}>
                          {savingContactPerson ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                        </Button>
                        <Button variant="text" size="small" sx={{ color: '#64748b', textTransform: 'none' }} onClick={handleCancelContactPerson} disabled={savingContactPerson}>Cancel</Button>
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#0f172a' }}>
                        {profileData.contactPersonName || 'No Contact Person Added'}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {!isEditingContactPerson && (
                  <Button sx={{ textTransform: 'none', fontWeight: 600, color: '#FF671F', mt: -0.5 }} onClick={() => setIsEditingContactPerson(true)}>
                    Edit
                  </Button>
                )}
              </Paper>
            </Box>

            {/* Emails Section */}
            <Box sx={{ mb: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ color: '#FF671F', mt: 0.5 }}>
                    <MailOutlineIcon />
                  </Box>
                  <Box>
                    <Chip
                      label="Email"
                      size="small"
                      sx={{ height: '22px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', mb: 1, borderRadius: '6px' }}
                    />
                    {isEditingEmail ? (
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                          size="small"
                          value={profileData.emailId}
                          onChange={(e) => setProfileData({ ...profileData, emailId: e.target.value })}
                          sx={{ ...fieldSx, width: '250px' }}
                          disabled={savingEmail}
                        />
                        <Button variant="contained" size="small" sx={{ bgcolor: '#FF671F', '&:hover': { bgcolor: '#e55a18' }, textTransform: 'none', px: 2, py: 0.8, minWidth: 72 }} onClick={handleSaveEmail} disabled={savingEmail}>
                          {savingEmail ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                        </Button>
                        <Button variant="text" size="small" sx={{ color: '#64748b', textTransform: 'none' }} onClick={handleCancelEmail} disabled={savingEmail}>Cancel</Button>
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#0f172a' }}>
                        {profileData.emailId || 'No Email Added'}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {!isEditingEmail && (
                  <Button sx={{ textTransform: 'none', fontWeight: 600, color: '#FF671F', mt: -0.5 }} onClick={() => setIsEditingEmail(true)}>
                    Edit
                  </Button>
                )}
              </Paper>
            </Box>

            {/* Phone numbers Section */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ color: '#FF671F', mt: 0.5 }}>
                    <PhoneOutlinedIcon />
                  </Box>
                  <Box>
                    <Chip
                      label="Phone Number"
                      size="small"
                      sx={{ height: '22px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', mb: 1, borderRadius: '6px' }}
                    />
                    {isEditingPhone ? (
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                          size="small"
                          value={profileData.contactNo}
                          onChange={(e) => setProfileData({ ...profileData, contactNo: e.target.value })}
                          sx={{ ...fieldSx, width: '250px' }}
                          disabled={savingPhone}
                        />
                        <Button variant="contained" size="small" sx={{ bgcolor: '#FF671F', '&:hover': { bgcolor: '#e55a18' }, textTransform: 'none', px: 2, py: 0.8, minWidth: 72 }} onClick={handleSavePhone} disabled={savingPhone}>
                          {savingPhone ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                        </Button>
                        <Button variant="text" size="small" sx={{ color: '#64748b', textTransform: 'none' }} onClick={handleCancelPhone} disabled={savingPhone}>Cancel</Button>
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#0f172a' }}>
                        {profileData.contactNo || 'No Phone Number Added'}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {!isEditingPhone && (
                  <Button sx={{ textTransform: 'none', fontWeight: 600, color: '#FF671F', mt: -0.5 }} onClick={() => setIsEditingPhone(true)}>
                    Edit
                  </Button>
                )}
              </Paper>
            </Box>

          </Grid>
        </Grid>
      </Container>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileComponent;
