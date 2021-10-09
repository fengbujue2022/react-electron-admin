import { ProblemRepository } from '@/repositories';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import dayjs from 'dayjs';
import { useAsync } from 'react-use';

export default function Dashboard() {
  const classes = useStyle();
  const asyncState = useAsync(() =>
    ProblemRepository.getCount((query) => {
      const yesterday = dayjs(
        dayjs().add(-1, 'day').format('YYYY-MM-DD')
      ).toDate();
      const today = dayjs(dayjs().format('YYYY-MM-DD')).toDate();
      query.greaterThan('createdAt', yesterday);
      query.lessThan('createdAt', today);
    })
  );

  return (
    <Grid container>
      <Grid item lg={3} md={4} sm={6} xs={12}>
        <Paper className={classes.widgetContainer}>
          <Typography variant="h5" color="textSecondary" noWrap>
            {'昨日新增问题'}
          </Typography>
          <div className={classes.widgetBody}>
            <Typography variant="h6" color="textPrimary" noWrap>
              {asyncState.loading ? '--' : asyncState.value}
            </Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
const useStyle = makeStyles((theme) => ({
  widgetContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
  },
  widgetBody: {
    paddingTop: theme.spacing(2),
  },
}));
