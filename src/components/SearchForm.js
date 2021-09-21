//import { useState, useEffect } from "react";
import { UserInput } from "../hook/UserInput";
import { Tracks } from "./Tracks";

export const SearchForm = () => {
    const { value: query, bind: bindSearch, reset: resetSearch} = UserInput('');

    return (
        <div>
            <div>
               <input type="text" placeholder="Search Tracks" {...bindSearch}/>
            </div>

            <Tracks query={query}/>    
            
        </div>
    );
}
