import React, { useEffect, useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter, 
    useFilters, usePagination, useRowSelect } from "react-table";
import TRACK_DATA from '../data/filtered_song_meta.json';
import { Checkbox } from "./Checkbox";
import { COLUMNS } from './columns';
import { GlobalFilter, ColumnFilter } from "./Filter";
import './table.css';

export const TrackTable = () => {

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
        state,
        setGlobalFilter,
        selectedFlatRows
    } = useTable({
        columns,
        data,
        defaultColumn
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


    return (
        <>
        <div id='search'>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
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

        <div>
            <pre>
                <code>
                    {JSON.stringify(
                        {
                            selectedFlatRows: selectedFlatRows.map((row) => row.original)
                        },
                        null,
                        2
                    )}
                </code>
            </pre>
        </div>
        </>
    )
}

//<SelectedTrackTable data={selectedFlatRows.map((row) => row.original)}/>
