export const TrackDetail = (track) => { 
    return (
        <tr key={track.id}>
            <td> {track.id} </td>
            <td> {track.Title} </td>
            <td> {track.Artists.map((elem, idx) => {return idx !== track.Artists.length-1 ? elem+', ' : elem} )} </td>
            <td> {track.AlbumName} </td>
            <td> {track.Genre.map((elem, idx) => {return idx !== track.Genre.length-1 ? elem+', ' : elem} )} </td>
            <td> {track.IssueDate} </td>
        </tr>
    );
  };