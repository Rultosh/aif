import React, * as Rect from 'react'
import { Card, CardContent, Typography, Box, Button, Grid } from "@mui/material"
import { TeamMemberList } from "./teamMember/TeamMemberList"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useState, useEffect } from "react"

export const ProfileNew = (props:any) => {
  const { id } = useParams();
  const navigate = useNavigate()

  const handleClick = (ev: any, navTo: string) => {
    if (navTo === 'previous') {
      navigate(`/preliminary/${id}/fund`)
    } else {
      navigate(`/preliminary/${id}/selfRating`)
    }
  }

  useEffect(() => {
    if(props.checkUnAuth){
        navigate('/login')
    }
})

  useEffect(() => {
    window.scrollTo(0, 0)
}, [])

  function handleClickSave() { }

  return (
    <div className="formAnimation">
      <Card sx={{ display: 'flex', mb: 2, flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1 }}>

          <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Profile</Typography>
          <Typography variant="subtitle1" color='#363062' sx={{ flex: 1, mt: 1 }}>Experience of Investment Team Members (please furnish for each team member seperately)</Typography>
          <Card sx={{ mt: 2, backgroundColor: "#f2f2f2" }}>
            <CardContent >
              {/*<Card sx={{ mt: 4, backgroundColor: "#363062" }}>
                  <CardContent >*/}
              <Box sx={{ mb: 2 }}>
                <TeamMemberList checkUnAuth={props.checkUnAuth}/>
              </Box>
              {/*</CardContent>
                </Card>
              {/*outputComponents*/}
              <Button
                onClick={(e) => handleClick(e, "previous")}
                startIcon={<ArrowLeftIcon />}
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                Fund Overview
              </Button>
              <Button
                color='success'
                onClick={handleClickSave}
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                Save
              </Button>
              <Button
                onClick={(e) => handleClick(e, "next")}
                endIcon={<ArrowRightIcon />}
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none', mt: 3, mb: 3, ml: 2 }} >
                Self Rating
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}