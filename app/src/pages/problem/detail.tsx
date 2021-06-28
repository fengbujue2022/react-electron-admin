import {
  Button,
  TextField,
  Grid,
  Paper,
  MenuItem,
  makeStyles,
  Theme,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core'
import { BaseEntity, DataModel, OmitId } from '@Ma'
import { useHistory, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useImmer } from 'use-immer'
import { ProblemRepository, ReporterRepository } from '@/src//repositories'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import useAutoComplete from '@/src//hooks/useAutoComplete'
import { Autocomplete } from '@material-ui/lab'
import constants from '@/src/constants/index'
import { useAsync } from 'react-use'

type FormState = {
  problem: OmitId<DataModel.Problem>
  reporter: OmitId<DataModel.Reporter> & Partial<BaseEntity>
}

const initialFormState: FormState = {
  problem: {
    description: '',
    reporterId: '',
  },
  reporter: {
    name: '',
    phonenumber: '',
    account: '',
    project_group: 0,
    mail: '',
  },
}

function FormWidget(props: { children?: React.ReactNode }) {
  const { children } = props
  const classes = useStyles()
  return (
    <Grid item xs={12} md={6} className={classNames(classes.formContainer)}>
      <Paper className={classNames(classes.formPaper)}>{children}</Paper>
    </Grid>
  )
}

export default function Detail() {
  const classes = useStyles()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [isNewReport, setIsNewReport] = useState(false)
  const [form, updateForm] = useImmer(initialFormState)
  const reporterDisabled = !isNewReport
  const [options, , , setKeyword] = useAutoComplete(ReporterRepository, 'phonenumber')
  const [stagedReporter, setStagedReporter] = useState<OmitId<DataModel.Reporter> & Partial<BaseEntity>>()

  const fetchDetail = async () => {
    if (isEdit) {
      const problem = await ProblemRepository.getOneById(id)
      const reporter = await ReporterRepository.getOneById(problem.reporterId)
      // Todo：do not update state in callback, it may occur after the unmount
      updateForm((draft) => {
        draft.reporter = reporter
        draft.problem = problem
      })
    }
  }

  useAsync(fetchDetail, [id])

  const handleSaveClick = async () => {
    try {
      if (id) {
        await ProblemRepository.update(id, {
          reporterId: form.reporter.objectId,
          description: form.problem.description,
        })
        await fetchDetail()
        toast.success('edit successful')
      } else {
        let reporterId: string
        if (form.reporter.objectId) {
          reporterId = form.reporter.objectId
        } else {
          const reporter = await ReporterRepository.create(form.reporter)
          reporterId = reporter.objectId
        }
        await ProblemRepository.create({
          description: form.problem.description,
          reporterId: reporterId,
        })
        toast.success('create successful')
        history.goBack()
      }
    } catch (e) {
      toast.error('failed to create or edit')
    }
  }

  return (
    <Grid container>
      <FormWidget>
        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <Typography variant="h4">Problem</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="description"
              rows={20}
              variant="outlined"
              value={form.problem.description}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.problem.description = value
                })
              }}
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </FormWidget>
      <FormWidget>
        <Tabs
          value={isNewReport ? 1 : 0}
          onChange={(_, value) => {
            const flag = value === 1
            setIsNewReport(flag)
            if (flag) {
              setStagedReporter(form.reporter)
              updateForm((draft) => {
                draft.reporter = initialFormState.reporter // to initial state
              })
            } else {
              updateForm((draft) => {
                draft.reporter = stagedReporter!
              })
            }
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Search" />
          <Tab label="New Reporter" />
        </Tabs>
        {!isNewReport && (
          <Autocomplete
            freeSolo
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Phonenumber"
                margin="normal"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
            getOptionLabel={(option) => option.label}
            onChange={(event, value, reason, detail) => {
              if (detail?.option.value) {
                updateForm((draft) => {
                  draft.reporter = detail.option.value
                })
              }
            }}
            onInputChange={(event, value, reason) => {
              setKeyword(value)
            }}
          />
        )}

        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <TextField
              label="name"
              fullWidth
              value={form.reporter.name}
              disabled={reporterDisabled}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.reporter.name = value
                })
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="phonenumber"
              type="tel"
              fullWidth
              value={form.reporter.phonenumber}
              disabled={reporterDisabled}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.reporter.phonenumber = value
                })
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="account"
              fullWidth
              value={form.reporter.account}
              disabled={reporterDisabled}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.reporter.account = value
                })
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              select
              label="project_group"
              variant="filled"
              fullWidth
              value={form.reporter.project_group}
              disabled={reporterDisabled}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.reporter.project_group = Number(value)
                })
              }}
            >
              {constants.projectGroups
                .map((group, index) => {
                  return { label: group, value: index }
                })
                .map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              label="mail"
              fullWidth
              value={form.reporter.mail}
              disabled={reporterDisabled}
              onChange={(e) => {
                const value = e.target.value
                updateForm((draft) => {
                  draft.reporter.mail = value
                })
              }}
            />
          </Grid>
        </Grid>
      </FormWidget>

      <Grid item xs={12} className={classes.saveButtonBox}>
        <Button variant="contained" color="primary" onClick={handleSaveClick}>
          {isEdit ? 'save' : 'create'}
        </Button>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    justifyContent: 'center',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  formPaper: {
    justifyContent: 'center',
    padding: theme.spacing(3),
  },

  saveButtonBox: {
    marginTop: 20,
  },
}))
