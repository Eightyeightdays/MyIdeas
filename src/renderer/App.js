import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import PouchDB from "pouchdb";

function Home() {
    const [dbName, setDbName] = useState();
    const [notification, setNotification] = useState();
   
    function createDatabase(e){
        e.preventDefault();
        console.log("WORKING")
        const db = new PouchDB(dbName);
        setNotification(`Database "${dbName}" Created Successfully`);

        db.info().then(info => console.log(info))
    };

    function updateData(e){
        setDbName(e.target.value);
    };

  return (
    <div>
      
      <h1>Ideation App</h1>
       <form>
            <label htmlFor="dbName">Database name: </label>
            <input id="dbName" type='text' onChange={updateData}></input>
            <button name="dbName" onClick={createDatabase}>Create</button>
       </form>
       
       {notification && <p>{notification}</p>}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
