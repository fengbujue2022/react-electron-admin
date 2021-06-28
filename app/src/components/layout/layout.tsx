import React from 'react'
import ReporterDetail from '@/src/pages/reporters/detail'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Route, Switch } from 'react-router-dom'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import ReporterQuery from '@/src/pages/reporters/query'
import Dashboard from '@/src/pages/dashboard/dashboard'
import ProblemQuery from '@/src/pages/problem/query'
import ProblemDetail from '@/src/pages/problem/detail'
import { ToastContainer } from 'react-toastify'
import routes from '@/src/constants/route'
import { Box } from '@material-ui/core'

function Layout() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Header />
      <Sidebar />
      <div className={classes.content}>
        <div className={classes.fakeToolbar} />
        <Box className={classes.routeBox}>
          <Switch>
            <Route path={routes.Dashboard} component={Dashboard} />
            <Route path={routes.ReporterQuery} component={ReporterQuery} />
            <Route path={routes.ReporterCreate} component={ReporterDetail} />
            <Route path={routes.ReporterEdit} component={ReporterDetail} />
            <Route path={routes.ProblemQuery} component={ProblemQuery} />
            <Route path={routes.ProblemCreate} component={ProblemDetail} />
            <Route path={routes.ProblemEdit} component={ProblemDetail} />
          </Switch>
        </Box>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Layout

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    maxWidth: '100vw',
  },
  fakeToolbar: {
    minHeight: theme.spacing(6),
  },
  content: {
    flexGrow: 1,
    width: 'calc(100vw - 240px)',
  },
  routeBox: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: 'calc(100vh - 56px)',
    overflowY: 'scroll',
    backgroundColor: '#F3F5FF',
  },
}))
