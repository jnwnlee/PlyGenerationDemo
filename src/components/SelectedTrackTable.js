import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter, 
    useFilters, usePagination, useRowSelect } from "react-table";    
import { COLUMNS } from './columns';

export const SelectedTrackTable = (props) => {

    const columns = useMemo(() => COLUMNS, []);
    const data = props.data;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    return (
        <div id='selectecd' style={{width: '49%', position:'relative', float:"right"}}>
            <h3>Selected Tracks</h3>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}> 
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
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
        </div>
    )
}

