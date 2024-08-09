import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import PouchDB from "pouchdb";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Home() {
    const DB_NAME = "MYIDEAS";
    const [dbName, setDbName] = useState();
    const [nodeName, setNodeName] = useState();
    const [notification, setNotification] = useState();
    const [allDocs, setAllDocs] = useState();
    const [nodeData, setNodeData] = useState();
    const db = new PouchDB(DB_NAME);
    const data = [ 
        {
            id: '1',
            data: { label: 'Hello', details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
            position: { x: 0, y: 0 },
        },
        {
            id: '2',
            data: { label: 'The Carbochrome Process' },
            position: { x: 100, y: 100 },
        },
        {
            id: '3',
            data: { label: 'Goodbye' },
            position: { x: 200, y: 200 },
        },
        {
            id: '4',
            data: { label: 'Planet Earth' },
            position: { x: 300, y: 300 },
        },
    ];

    const getDocs = async()=>{    
        try{               
            const result = await db.allDocs({
                include_docs: true
            });
            
            const docs = await result.rows.map(row => {
                row.doc.id = row.doc._id;
                delete row.doc._rev;
                delete row.doc._id;
                return row.doc;
            });
            setNodeData(docs);            
        }catch(err){
            console.log(err);
        };
    };

    useEffect(()=>{
        getDocs();
    }, [])

    const addStartingDocs = async()=>{
        try{
            const db = new PouchDB(DB_NAME);
            const res = await db.bulkDocs(data);
            getDocs();
            console.log("Starting docs added");
            // console.log(res);
        }catch(err){
            console.log(err);
        };
    };
    
    const deleteDocs = async()=>{
        try {
            await db.destroy();
            console.log("Starting docs deleted");
            setNodeData([]);
        } catch (err) {
            console.log(err);
        };
    };

    const handleClick = async(e)=>{
        // bring up details and menu
        const dataId = e.target.getAttribute("data-id");
        console.log(dataId);
       
        try {
            const doc = await db.get(dataId);
            console.log(doc);
        } catch (err) {
            console.log(err);
        };
  
    }

  return (
    <div>
      <h1>Ideation App</h1>
        <button onClick={addStartingDocs}>Add Starting Docs</button>
        <button onClick={deleteDocs}>Delete Docs</button>
        {nodeData && <div style={{ height: '500px', width: "500px" }}>
            <ReactFlow nodes={nodeData} onNodeClick={handleClick}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};