import React, { useState } from 'react'
import { Fade, Typography, TextField, makeStyles, Grid, Button } from '@material-ui/core'
import { useAuthenticationAction } from '@/src/context/UserContext'
import Header from '@/src/components/header/header'

export default function Login() {
  const classes = useStyle()
  const [loginValue, setLoginValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [authError, setAuthError] = useState('')
  const { login } = useAuthenticationAction()

  return (
    <Grid container className={classes.container}>
      <Header />
      <div className={classes.formContainer}>
        <form className={classes.form}>
          <Typography variant="h1" className={classes.greeting}>
            Hello !
          </Typography>
          <Fade in={!!authError}>
            <Typography color="error" className={classes.errorMessage}>
              Something is wrong with your login or password :(
            </Typography>
          </Fade>
          <TextField
            id="email"
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            margin="normal"
            placeholder="Email Adress"
            type="text"
            fullWidth
          />
          <TextField
            id="password"
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            margin="normal"
            placeholder="Password"
            type="password"
            fullWidth
          />
          <div className={classes.formButtons}>
            <Button
              type="submit"
              disabled={loginValue.length === 0 || passwordValue.length === 0}
              onClick={() => {
                login(loginValue, passwordValue).catch(() => {
                  setAuthError('login failed')
                })
              }}
              variant="contained"
              color="primary"
              size="large"
            >
              Login
            </Button>
            <Button color="primary" size="large" className={classes.forgetButton}>
              Forget Password
            </Button>
          </div>
        </form>
      </div>
    </Grid>
  )
}

const useStyle = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  formContainer: {
    width: '40%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },
  form: {
    width: 320,
  },
  greeting: {
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
  formDividerContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
  },
  errorMessage: {
    textAlign: 'center',
  },
  textFieldUnderline: {
    '&:before': {
      borderBottomColor: theme.palette.primary.light,
    },
    '&:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '&:hover:before': {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  textField: {
    //borderBottomColor: theme.palette.background.light,
  },
  formButtons: {
    width: '100%',
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgetButton: {
    textTransform: 'none',
    fontWeight: 400,
  },
  loginLoader: {
    marginLeft: theme.spacing(4),
  },
  copyright: {
    marginTop: theme.spacing(4),
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      bottom: theme.spacing(2),
    },
  },
}))
