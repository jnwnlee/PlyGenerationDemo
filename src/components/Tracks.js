import { useState, useEffect } from "react";
import Loader from 'react-loader-spinner';
import { TrackDetail } from "./TrackDetail";

export const Tracks = (props) => {
    const query = props.query;
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() { // 
        setLoading(true);
        try{
            let data;
            data = await require('../data/filtered_song_meta.json');
            setTracks(data);
            setFilteredTracks(data);
        }
        catch (err) {
            alert('<ERROR> while fetching track list.\n'+err);
        }
        setLoading(false);
    }

    async function queryData() {//async     
        console.log(query);

        setLoading(true,
            setFilteredTracks(//await 
                tracks.filter((track) =>
                    track.Title?.toLowerCase().includes(query?.toLowerCase()) || track.Artists.some(s => s !== null ? s.toLowerCase().includes(query?.toLowerCase()) : false)
                    || track.AlbumName?.toLowerCase().includes(query?.toLowerCase()) || track.Genre.some(s => s !== null ? s.toLowerCase().includes(query?.toLowerCase()) : false)
                )
            )
        );
        console.log('query change - ', loading);
        setLoading(false);
        
        
        
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        queryData();      
    }, [query]);

    
    if (loading){
        console.log('return load');
        return (
                    <div>
                        <span>Loading Tracks ...</span>
                        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
                    </div>
        );
    }
    else{
        console.log('return results');
        return (
            <div>
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Artists</th>
                            <th scope="col">AlbumName</th>
                            <th scope="col">Genre</th>
                            <th scope="col">IssueDate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   filteredTracks.length > 70
                            ? filteredTracks.slice(0, 70).map((track) => (
                                <TrackDetail key={track.id} {...track} />
                            ))
                            : 
                            filteredTracks.map((track) => (
                                <TrackDetail key={track.id} {...track} />
                            ))
                        }
                    </tbody>
                </table>  
                {   filteredTracks.length > 70
                    ? <p> and more...</p>
                    : <p></p>
                }
            </div>
            
        );
    }
}