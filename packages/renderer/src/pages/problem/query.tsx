import React, { useState } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Autocomplete } from '@mui/lab';
import { ProblemRepository, ReporterRepository } from '@/repositories';
import { generatePath, useHistory } from 'react-router-dom';
import { DataModel, RowReturnType, ViewModel } from '@Ma';
import MUIDataTable from 'mui-datatables';
import { toast } from 'react-toastify';
import AV from 'leancloud-storage/live-query';
import useAutoComplete from '@/hooks/useAutoComplete';
import routes from '@/constants/route';
import { useAsync } from 'react-use';

const fetchData = async (
  page: number,
  rowsPerPage: number,
  selectedOption?: DataModel.Problem
) => {
  let totalCount = 0;
  let data: ViewModel.Problem[] = [];
  try {
    let problemsResult: RowReturnType<DataModel.Problem>;
    const configureQeury = (query: AV.Query<AV.Queriable>) => {
      //query.include('reporter')
    };
    // const castRelatedDataMap = (pagingResult: AV.Queriable[]) => {
    //   console.log(pagingResult.map((x) => x.get('reporter')))
    //   return { reporter: pagingResult.map((x) => x.get('reporter')) }
    // }
    if (selectedOption) {
      problemsResult = await ProblemRepository.getPagingList(
        rowsPerPage,
        page,
        (query) => {
          configureQeury(query);
          query.equalTo('objectId', selectedOption.objectId);
        }
        //castRelatedDataMap
      );
    } else {
      problemsResult = await ProblemRepository.getPagingList(
        rowsPerPage,
        page,
        configureQeury
        // castRelatedDataMap
      );
    }

    totalCount = problemsResult.totalCount;

    // todo 最好优化为一次query
    if (problemsResult.data.length > 0) {
      const reporterResult = await ReporterRepository.getManyByIds(
        problemsResult.data.map((x) => x.reporterId)
      );
      data = problemsResult.data.map((problem) => {
        const reporter = reporterResult.find(
          (r) => r.objectId === problem.reporterId
        );
        return {
          objectId: problem.objectId,
          description: problem.description,
          reporterName: reporter?.name,
          reporterTel: reporter?.phonenumber,
        };
      });
    }
  } catch (e) {
    console.log(e);
  }
  return { totalCount, data };
};

export default function List() {
  const classes = useStyles();
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [options, selectedOption, setSelectedOption, setKeyword] =
    useAutoComplete(ProblemRepository, 'description');

  const handleCreateClick = () => {
    history.push(routes.ProblemCreate);
  };

  const asyncState = useAsync(async () => {
    const { data, totalCount } = await fetchData(0, 10, selectedOption);
    return { data, totalCount };
  }, [selectedOption]);

  const { data: tableData, totalCount: count } = asyncState.loading
    ? { data: [], totalCount: 0 }
    : asyncState.value!;

  return (
    <>
      <Grid container alignItems={'center'} justifyContent={'space-between'}>
        <Grid item xs={4}>
          <Autocomplete
            freeSolo
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search description"
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
              setSelectedOption(detail?.option.value);
            }}
            onInputChange={(event, value, reason) => {
              setKeyword(value);
            }}
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={handleCreateClick}>
          create
        </Button>
      </Grid>
      <div className={classes.tableContainer}>
        <MUIDataTable
          title={'problem table'}
          data={tableData}
          columns={[
            { name: 'description', label: 'description' },
            {
              name: 'reporterName',
              label: 'reporterName',
            },
            {
              name: 'reporterTel',
              label: 'reporterTel',
            },
          ]}
          options={{
            search: false,
            filter: false,
            print: false,
            count: count,
            rowsPerPage: rowsPerPage,
            onChangeRowsPerPage: (p) => {
              setRowsPerPage(p);
            },
            onRowClick: (rowData, rowMeta) => {
              history.push(
                generatePath(routes.ProblemEdit, {
                  id: tableData[rowMeta.dataIndex].objectId,
                })
              );
            },
            onRowsDelete: (rowsDeleted, newTableData) => {
              ReporterRepository.deleteByIds(
                rowsDeleted.data.map((x) => tableData[x.index].objectId)
              ).then((x) => {
                toast.success('delete successful');
              });
            },
          }}
        />
      </div>
    </>
  );
}

const useStyles = makeStyles({
  tableContainer: {
    position: 'relative',
  },
});
