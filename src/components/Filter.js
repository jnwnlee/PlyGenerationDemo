import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

export const GlobalFilter = ({ filter, setFilter }) => {
    /**
     * get query to filter the tracks in global scope.
     * @param {string} filter query value to filter.
     * @param {function} setFilter setState function for query value.
     */
    const [value, setValue] = useState(filter);

    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000);
    
    return (
        <span id='searchInput'>
            <input placeholder='Search'
            value={value || ''}
            onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
            }}/>
        </span>
    )
}

export const ColumnFilter = ({ column }) => {
    /**
     * get query to filter the tracks in column scope.
     * @param {object} column object of react-table column for filtering.
     */
    const { filterValue, setFilter } = column;

    const [value, setValue] = useState(filterValue);

    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000);

    return (
        <span id='columnSearchInput'>
            <input placeholder='Search'
            value={value || ''}
            onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
            }}/>
        </span>
    )
}