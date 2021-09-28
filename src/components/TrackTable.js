import React, { useState, useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter, 
    useFilters, usePagination, useRowSelect } from "react-table";
import TRACK_DATA from '../data/filtered_song_meta.json';
import Loader from 'react-loader-spinner';
import { Checkbox } from "./Checkbox";
import { COLUMNS } from './columns';
import { GlobalFilter, ColumnFilter } from "./Filter";
import { SelectedTrackTable } from  "./SelectedTrackTable";
import './table.css';

async function fetchData(setLoading) {  
    setLoading(true);
    try{
        let data;
        data = await require('../data/filtered_song_meta.json');
        return data;
    }
    catch (err) {
        alert('<ERROR> while fetching track list.\n'+err);
    }
    setLoading(false);
}

export const TrackTable = () => {
    /**
     * table of tracks.
     * able to filter, sort, select among tracks.
     * table is paginated
     */

    const [loading, setLoading] = useState(false);

    //const TRACK_DATA = fetchData(setLoading);
    

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => TRACK_DATA, []);
    const defaultColumn = useMemo(() => ({Filter: ColumnFilter}), []);
    const MAXLENGTH = 40;


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        allColumns,
        state,
        setGlobalFilter,
        selectedFlatRows
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: {
            hiddenColumns: columns.map(column => {
                if (column.show === false) return column.accessor || column.id;
            })
        }
    }, 
    useFilters, useGlobalFilter, useSortBy, usePagination, useRowSelect,
    (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                ...columns,
                {
                    id: 'selection',
                    Header: ({getToggleAllRowsSelectedProps}) => (
                        //<Checkbox {...getToggleAllRowsSelectedProps()} />
                        (<>Select</>)
                    ),
                    Cell: ({ row }) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                }
            ] 
            
        })
    }
    );

    const { globalFilter, pageIndex, pageSize } = state;


    if (loading){
        console.log('return load');
        return (
                    <div>
                        <span>Loading Tracks ...</span>
                        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
                    </div>
        );
    }

    return (
        <>
        <div id='search'>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
            <div style={{float: 'right'}}>
                <span>{'Show columns: '}</span> 
                {
                    allColumns.map(column => {
                        if (column.show === false){
                            return (
                                <label key={column.id}>
                                    <input type='checkbox' {...column.getToggleHiddenProps()}/>
                                    {column.Header}
                                </label>
                            )
                        }
                    })
                }
            </div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}> 
                            {headerGroup.headers.map((column, idx) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : 
                                            (idx === 6 ? '' : ' ⇵')}   
                                    </span>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}> 
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            ) 
                        })
                    }
                </tbody>
            </table>
            <div>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                <span>
                    {' '}Page{' '}
                    <input type='number' defaultValue={pageIndex + 1}
                        value={pageIndex + 1}
                        onChange={e =>{
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                    }} />
                    <strong>
                        of {pageOptions.length}
                    </strong>{' '}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                <br/>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [...Array(MAXLENGTH/10).keys()].map(i => (i+1) * 10).map(pageSize => (
                            <option key={pageSize} value={pageSize} >
                                Show {pageSize} Tracks
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>

        <SelectedTrackTable data={selectedFlatRows.map((row) => row.original)}/>
        </>
    )
}
