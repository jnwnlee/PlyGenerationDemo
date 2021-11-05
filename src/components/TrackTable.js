import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, 
    useFilters, usePagination, useRowSelect } from "react-table";
//import TRACK_DATA from '../data/filtered_song_meta.json';
import Loader from 'react-loader-spinner';
import { Checkbox } from "./Checkbox";
import { COLUMNS } from './columns';
import { GlobalFilter, ColumnFilter } from "./Filter";
import { SelectedTrackTable } from  "./SelectedTrackTable";
import './table.css';



export const TrackTable = () => {
    /**
     * table of tracks.
     * able to filter, sort, select among tracks.
     * table is paginated
     */
    
     async function requireData(setLoading, setTrackData) {  
        setLoading(true);
        try{
            let data_obj;
            data_obj = await require('../data/filtered_song_meta.json');
            console.log("data: ", data_obj);
            setTrackData([...data_obj]);
            setLoading(false);
            return data_obj;
        }
        catch (err) {
            alert('<ERROR> while fetching track list.\n'+err);
        }
    }

    const [loading, setLoading] = useState(true);
    const [trackData, setTrackData] = useState([]);

    useEffect(() => {
        requireData(setLoading, setTrackData);
        console.log("trackData: ", trackData);
    }, []);
    

    const columns = useMemo(() => COLUMNS, []);
    //const data = useMemo(() => trackData, []);
    const data = trackData;
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
    const [ selectedRows, setSelectedRows ] = useState([]);
    useEffect(() => {
        const flattenRows = selectedFlatRows.length === 0 
                            ? []
                            : selectedFlatRows.map((row) => row.original);

        if (flattenRows.length >= selectedRows.length){
            for (const r of flattenRows){
                if (!selectedRows.includes(r)) {
                    setSelectedRows([...selectedRows, r]);
                    console.log('pushed', r);
                }
        }}
        if (selectedRows.length >= flattenRows.length){
            setSelectedRows([...selectedRows.filter(val => flattenRows.filter(row => row.id===val.id).length>0)]);
        }
    }, [selectedFlatRows]);

    const onGenerate = () => {
        const selectedTrackID = selectedRows.map(row => row.id)
        console.log('IDs: ', selectedTrackID);
        if (selectedTrackID.length === 0){
            alert('No track selected!');
        } 
        else{
            alert("IDs of Selected Tracks: "+selectedTrackID.toString());
        }
    }

    if (loading){
        console.log('return load');
        return (
                    <div>
                        <h2 id='loader'>Loading Tracks ...</h2>
                        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
                    </div>
        );
    }

    return (
        <>
        <div id='search'>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
            <div id='showCols'>
                <span>{'Show columns: '}</span> 
                {
                    allColumns.map(column => {
                        if (column.show === false){
                            return (
                                <div id='selectCol' key={column.id}>
                                    <input type='checkbox' id={column.Header} {...column.getToggleHiddenProps()}/>
                                    <label for={column.Header}>{column.Header}</label> 
                                </div>
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
                                <th >
                                    {column.render('Header')}
                                    <span {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : 
                                            (column.id === 'selection' ? '' : ' ⇵')}   
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
            <div id='pageSelect'>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                <span>
                    {' '}Page{' '}
                    <input type='number' 
                        value={pageIndex + 1}
                        onChange={e =>{
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                    }} />
                    <strong>
                        {' '}of {pageOptions.length}
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
        <div id='generate'>
            <button id="genBut" onClick={onGenerate}>▶</button>
            <label for='genBut'>Generate Title</label>
        </div>
        <SelectedTrackTable data={selectedRows}/>
        </>
    )
}
