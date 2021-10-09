import React, { useState } from 'react';
import { TextField, Grid, Button, makeStyles, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ReporterRepository } from '@/repositories';
import { generatePath, useHistory } from 'react-router-dom';
import { DataModel, RowReturnType } from '@Ma';
//import MUIDataTable from 'mui-datatables'
import { toast } from 'react-toastify';
import useAutoComplete from '@/hooks/useAutoComplete';
import routes from '@/constants/route';
import { useAsync } from 'react-use';

const fetchData = async (
  page: number,
  rowsPerPage: number,
  selectedOption?: DataModel.Reporter
) => {
  let result: RowReturnType<DataModel.Reporter>;
  try {
    if (selectedOption) {
      result = await ReporterRepository.getPagingList(
        rowsPerPage,
        page,
        (query) => {
          query.equalTo('objectId', selectedOption.objectId);
        }
      );
    } else {
      result = await ReporterRepository.getPagingList(rowsPerPage, page);
    }
    return result;
  } catch (e) {
    console.log(e);
  }
  return { totalCount: 0, data: [] };
};

export default function List() {
  const classes = useStyles();
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [options, selectedOption, setSelectedOption, setKeyword] =
    useAutoComplete(ReporterRepository, 'phonenumber');

  const handleCreateClick = () => {
    history.push(routes.ReporterCreate);
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
      <Grid container alignItems={'center'} justify={'space-between'}>
        <Grid item xs={4}>
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
        {/* <MUIDataTable
          title={'reporters table'}
          data={tableData}
          columns={[
            {
              name: 'name',
              label: 'name',
            },
            {
              name: 'phonenumber',
              label: 'phonenumber',
            },
            {
              name: 'account',
              label: 'account',
            },
            {
              name: 'project_group',
              label: 'project_group',
            },
            {
              name: 'mail',
              label: 'mail',
            },
          ]}
          options={{
            search: false,
            filter: false,
            print: false,
            count: count,
            rowsPerPage: rowsPerPage,
            onChangeRowsPerPage: (p) => {
              setRowsPerPage(p)
            },
            onRowClick: (rowData, rowMeta) => {
              history.push(generatePath(routes.ReporterEdit, { id: tableData[rowMeta.dataIndex].objectId }))
            },
            onRowsDelete: (rowsDeleted, newTableData) => {
              ReporterRepository.deleteByIds(rowsDeleted.data.map((x) => tableData[x.index].objectId)).then(
                (x) => {
                  toast.success('delete successful')
                }
              )
            },
          }}
        /> */}
      </div>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    position: 'relative',
  },
}));
