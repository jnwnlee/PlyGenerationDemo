
export const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        disableFilters: true
    },
    {
        Header: 'Title',
        accessor: 'Title'
    },
    {
        Header: 'Artists',
        accessor: 'Artists',
        Cell: ({ value }) => value.map((elem, idx) => {return idx !== value.length-1 ? elem+', ' : elem} )
    },
    {
        Header: 'AlbumName',
        accessor: 'AlbumName'
    },
    {
        Header: 'Genre',
        accessor: 'Genre',
        Cell: ({ value }) => value.map((elem, idx) => {return idx !== value.length-1 ? elem+', ' : elem} ),
    },
    {
        Header: 'IssueDate',
        accessor: 'IssueDate',
        disableFilters: true
    }
]