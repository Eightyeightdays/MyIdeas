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
    const nodes = [];  
  
    useEffect(()=>{
        const getDocs = async()=>{    
            // try {
            //     await db.destroy();
            // } catch (err) {
            //     console.log(err);
            // }
            try{               
                const result = await db.allDocs({
                    include_docs: true
                });
                
                const docs = result.rows.map(row => {
                    row.doc.id = row.doc._id;
                    delete row.doc._rev;
                    delete row.doc._id;
                    return row.doc;
                });

                setNodeData(docs);

                console.log(nodeData);
            }catch(err){
                console.log(err);
            };
        };
        
        getDocs();
    }, []);

    async function addStartingDocs(){
        try{
            const res = await db.bulkDocs([ 
                {
                    id: '1',
                    data: { label: 'Hello' },
                    position: { x: 0, y: 0 },
                },
                {
                    id: '2',
                    data: { label: 'World' },
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
            ]);
            console.log("Starting docs added");
        }catch(err){
            console.log(err);
        }
    }

  return (
    <div>
      <h1>Ideation App</h1>
        <button onClick={addStartingDocs}>Add Starting Docs</button>
        {nodes && <div style={{ height: '500px', width: "500px" }}>
            <ReactFlow nodes={nodeData}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>}
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
