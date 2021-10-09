import React, { Reducer, useEffect, useReducer } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  MenuItem,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { BaseEntity, DataModel, OmitId } from '@Ma';
import { ReporterRepository } from '@/repositories';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import constants from '@/constants/index';
import classNames from 'classnames';
import { useAsync } from 'react-use';

type FormState = OmitId<DataModel.Reporter> & Partial<BaseEntity>;

const initialFormState: FormState = {
  name: '',
  phonenumber: '',
  account: '',
  project_group: 0,
  mail: '',
};

const formReducer: Reducer<FormState, Partial<FormState>> = (state, aciton) => {
  return { ...state, ...aciton };
};

function FormWidget(props: { children?: React.ReactNode }) {
  const { children } = props;
  const classes = useStyles();
  return (
    <Grid item xs={12} md={6} className={classNames(classes.formContainer)}>
      <Paper className={classNames(classes.formPaper)}>{children}</Paper>
    </Grid>
  );
}

export default function Detail() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form, updateForm] = useReducer(formReducer, initialFormState);

  const { value, loading } = useAsync(async () => {
    if (isEdit) {
      const reporter = await ReporterRepository.getOneById(id);
      return { reporter };
    }
  }, [id]);

  useEffect(() => {
    if (loading === false && value) {
      updateForm(value.reporter);
    }
  }, [value, loading]);

  const handleSaveClick = async () => {
    try {
      if (!isEdit) {
        await ReporterRepository.create(form);
        toast.success('create successful');
      } else {
        await ReporterRepository.update(form.objectId!, form);
        toast.success('update successful');
      }
      history.goBack();
    } catch (e) {
      console.log(e);
      toast.error('failed to save');
    }
  };

  return (
    <Grid container>
      <FormWidget>
        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <TextField
              label="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="phonenumber"
              type="tel"
              value={form.phonenumber}
              onChange={(e) => updateForm({ phonenumber: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="account"
              value={form.account}
              onChange={(e) => updateForm({ account: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              select
              label="project_group"
              value={form.project_group}
              onChange={(e) =>
                updateForm({ project_group: Number(e.target.value) })
              }
              variant="filled"
              fullWidth
            >
              {constants.projectGroups
                .map((group, index) => {
                  return { label: group, value: index };
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
              value={form.mail}
              onChange={(e) => updateForm({ mail: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveClick}
            >
              {isEdit ? 'save' : 'create'}
            </Button>
          </Grid>
        </Grid>
      </FormWidget>
    </Grid>
  );
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
}));
