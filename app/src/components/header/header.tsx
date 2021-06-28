import React, { useState } from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Grid } from '@material-ui/core'
import {
  Person as AccountIcon,
  AllInclusive as AllInclusiveIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Minimize as MinimizeIcon,
} from '@material-ui/icons'
import { useAuthenticationAction, useUserState } from '@/src/context/UserContext'
import constants from '@/src/constants'
import { actions } from '@/electron/core/agent'
import { useHistory } from 'react-router'
import { Rehistory } from '../rehistory'

export default function Header() {
  const classes = useStyles()
  const userState = useUserState()
  const history = useHistory() as Rehistory

  const { logout } = useAuthenticationAction()
  const { user } = useUserState()
  const [profileMenu, setProfileMenu] = useState<EventTarget & HTMLButtonElement>(undefined!)

  const handleBackClick = () => {
    history.goBack()
  }

  const handleForwardClick = () => {
    history.goForward()
  }

  return (
    <AppBar variant="outlined" position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <AllInclusiveIcon className={classes.logoIcon} />
        <Typography variant="h6">Admin</Typography>
        {!!user && (
          <>
            <Grid container alignItems="center" className={classes.navigateBox}>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                className={classes.headerMenuNavigateButton}
                onClick={handleBackClick}
                disabled={!history.canGoback()}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                className={classes.headerMenuNavigateButton}
                onClick={handleForwardClick}
                disabled={!history.canForward()}
              >
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </>
        )}
        <div className={classes.grow} />
        {!!user && (
          <>
            <IconButton
              aria-haspopup="true"
              color="inherit"
              className={classes.headerMenuButton}
              aria-controls="profile-menu"
              onClick={(e) => setProfileMenu(e.currentTarget)}
            >
              <AccountIcon classes={{ root: classes.headerIcon }} />
            </IconButton>
            <Menu
              id="profile-menu"
              open={Boolean(profileMenu)}
              anchorEl={profileMenu}
              onClose={() => setProfileMenu(undefined!)}
              className={classes.headerMenu}
              classes={{ paper: classes.profileMenu }}
              disableAutoFocusItem
            >
              <div className={classes.profileMenuUser}>
                <Typography variant="h4">{userState.user?.username}</Typography>
              </div>
              <MenuItem onClick={() => logout()}>Logout</MenuItem>
            </Menu>
          </>
        )}

        {constants.isElectron && (
          <>
            <IconButton
              aria-haspopup="true"
              color="inherit"
              className={classes.headerMenuButton}
              onClick={() => {
                actions.minimize()
              }}
            >
              <MinimizeIcon classes={{ root: classes.headerIcon }} />
            </IconButton>
            <IconButton
              aria-haspopup="true"
              color="inherit"
              className={classes.headerMenuButton}
              onClick={() => {
                actions.quit()
              }}
            >
              <CloseIcon classes={{ root: classes.headerIcon }} />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    '-webkit-app-region': 'drag',
  },
  grow: {
    flexGrow: 1,
  },
  headerMenu: {
    marginTop: theme.spacing(7),
  },
  headerMenuList: {
    display: 'flex',
    flexDirection: 'column',
  },
  navigateBox: {
    marginLeft: theme.spacing(12),
  },
  headerMenuNavigateButton: {
    '-webkit-app-region': 'no-drag',
    padding: theme.spacing(0.5),
  },
  headerMenuButton: {
    '-webkit-app-region': 'no-drag',
    padding: theme.spacing(0.5),
  },
  headerMenuButtonSandwich: {
    marginLeft: 9,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
    padding: theme.spacing(0.5),
  },
  headerMenuButtonCollapse: {
    marginRight: theme.spacing(2),
  },
  headerIcon: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.35)',
    '&:hover, &:focus': {
      color: 'white',
    },
  },
  headerIconCollapse: {
    color: 'white',
  },
  profileMenu: {
    minWidth: 265,
  },
  profileMenuUser: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  logoIcon: {
    marginRight: 8,
  },
}))
