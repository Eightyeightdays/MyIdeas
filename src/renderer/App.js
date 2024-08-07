import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import PouchDB from "pouchdb";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Home() {
    const [dbName, setDbName] = useState();
    const [nodeName, setNodeName] = useState();
    const [notification, setNotification] = useState();
   
    function createDatabase(){
    
        console.log("WORKING")
        const db = new PouchDB(dbName);
        setNotification(`Database "${dbName}" Created Successfully`);

        db.info().then(info => console.log(info))
    };

    function updateData(e){
        setDbName(e.target.value);
    };

    function handleNewNodeName(e){
        setNodeName(e.target.value);
    }

    function addNode(){
        const doc = {
            "_id": new Date(),
            "data": nodeName
        };
        
        const db = new PouchDB("crimson")
        try{
            db.put(doc);
        }catch(err){
           console.log(err);
        }

        db.info().then(info =>  setNotification(JSON.stringify(info)));
        setNodeName("");
    }

  return (
    <div>
      
      <h1>Ideation App</h1>
        {!notification && <div>
            <label htmlFor="dbName">Database name: </label>
            <input id="dbName" type='text' value={dbName} onChange={updateData}></input>
            <button name="dbName" onClick={createDatabase}>Create</button>
        </div>}
       
        {notification && <p>{notification}</p>}
        
        <div>
            <label htmlFor="addNode">Add a node: </label>
            <input type="text" id="addNode" value={nodeName} onChange={handleNewNodeName}></input>
            <button name="" onClick={addNode}>Add</button>
        </div>

        <div style={{ height: '500px', width: "500px" }}>
            <ReactFlow>
                <Background />
                <Controls />
            </ReactFlow>
        </div>

        <p>END</p>

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
