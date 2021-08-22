import React from "react";
import { SearchForm } from "./components/SearchForm";

import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Playlist Title Generation</h1>
      </header>
      <SearchForm/>
    </div>
  );
};

export default App;
