import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

export const GlobalFilter = ({ filter, setFilter }) => {
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