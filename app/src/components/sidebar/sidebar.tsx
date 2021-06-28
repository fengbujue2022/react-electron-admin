import React from 'react'
import { Toolbar, Drawer, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, Build as BuildIcon, ErrorOutline as ErrorOutlineIcon } from '@material-ui/icons'
import { useLayoutState } from '@/src/context/LayoutContext'
import classnames from 'classnames'
import routes from '@/src/constants/route'

const menuList = [
  { label: 'dashboard', link: routes.Dashboard, icon: <HomeIcon /> },
  { label: 'reporters', link: routes.ReporterQuery, icon: <BuildIcon /> },
  { label: 'problem', link: routes.ProblemQuery, icon: <ErrorOutlineIcon /> },
]

function Sidebar() {
  const classes = useStyles()
  const { location } = useHistory()
  const { isSidebarOpened } = useLayoutState()
  return (
    <Drawer
      variant="permanent"
      className={classnames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classnames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <Toolbar variant="dense" />
      <div>
        <Divider />
        <List>
          {menuList.map((menu) => {
            const { link, icon } = menu
            var isLinkActive = link && (location.pathname === link || location.pathname.indexOf(link) !== -1)
            return (
              <ListItem
                button
                className={classnames({
                  [classes.linkItemActive]: isLinkActive,
                })}
                key={menu.label}
                component={Link}
                to={menu.link}
              >
                <div
                  className={classnames(classes.linkIcon, {
                    [classes.linkIconActive]: isLinkActive,
                  })}
                >
                  {icon}
                </div>
                <ListItemText
                  classes={{
                    primary: classnames(classes.linkText, {
                      [classes.linkTextActive]: isLinkActive,
                      [classes.linkTextHidden]: !isSidebarOpened,
                    }),
                  }}
                  primary={menu.label}
                />
              </ListItem>
            )
          })}
        </List>
      </div>
    </Drawer>
  )
}

export default Sidebar

const drawerWidth = 200

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 40,
    [theme.breakpoints.down('sm')]: {
      width: drawerWidth,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  /* sidebarList: {
    marginTop: theme.spacing(6),
  }, */
  mobileBackButton: {
    marginTop: theme.spacing(0.5),
    marginLeft: 18,
    [theme.breakpoints.only('sm')]: {
      marginTop: theme.spacing(0.625),
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  link: {
    textDecoration: 'none',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  externalLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
  },
  linkActive: {
    backgroundColor: theme.palette.background.paper,
  },
  linkNested: {
    paddingLeft: 0,
    '&:hover, &:focus': {
      backgroundColor: '#FFFFFF',
    },
  },
  linkItemActive: {
    backgroundColor: '#F3F5FF', // todo from theme
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + '99',
    transition: theme.transitions.create('color'),
    display: 'flex',
    justifyContent: 'center',
  },
  linkIconActive: {
    color: theme.palette.primary.main,
  },
  linkText: {
    padding: 0,
    color: theme.palette.text.secondary + 'CC',
    transition: theme.transitions.create(['opacity', 'color']),
    fontSize: 16,
  },
  linkTextActive: {
    color: theme.palette.text.primary,
  },
  linkTextHidden: {
    opacity: 0,
  },
}))
