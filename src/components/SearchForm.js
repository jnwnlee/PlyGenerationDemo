import { UserInput } from "../hook/UserInput";

export const SearchForm = () => {
    const { value: query, bind: bindSearch, reset: resetSearch} = UserInput('');

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Submitting Query: ${query}`);
        resetSearch();
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Search Tracks" {...bindSearch}/>
            <input type="submit" value="Search"/>
        </form>
    );
}