import React from "react";
import { TrackTable } from "./components/TrackTable";

import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Playlist Title Generation</h1>
      </header>
      
      <TrackTable/>
    </div>
  );
};

export default App;
