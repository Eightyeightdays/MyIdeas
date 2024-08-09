import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import PouchDB from "pouchdb";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { createPortal } from 'react-dom';

function Home() {
    const DB_NAME = "MYIDEAS";
    const [dbName, setDbName] = useState();
    const [nodeName, setNodeName] = useState();
    const [notification, setNotification] = useState();
    const [allDocs, setAllDocs] = useState();
    const [nodeData, setNodeData] = useState();
    const [popup, setPopup] = useState(false);
    const [nodeId, setNodeId] = useState();
    const [nodeDetails, setNodeDetails] = useState();
    const [sourceNode, setSourceNode] = useState();
    // const [edges, setEdges] = useState();
    const db = new PouchDB(DB_NAME);
    const data = [ 
        {
            _id: '1',
            data: { label: 'Hello', details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
            position: { x: 0, y: 0 },
        },
        {
            _id: '2',
            data: { label: 'The Carbochrome Process' },
            position: { x: 100, y: 100 },
        },
        {
            _id: '3',
            data: { label: 'Goodbye' },
            position: { x: 200, y: 200 },
        },
        {
            _id: '4',
            data: { label: 'Planet Earth' },
            position: { x: 300, y: 300 },
        },
    ];

    const edges = [
        {type: "smoothstep", source: "1", target: "4", id: "First-edge", label: "TEST", style: { stroke: "black", strokeWidth: 5 }}
    ]

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
        setPopup(!popup);
        const dataId = e.target.getAttribute("data-id");
        setSourceNode(dataId);
        console.log(e.target.id)
        console.log(dataId);
       
        try {
            const doc = await db.get(dataId);
            console.log(doc.data.label);
            console.log(`Node details: ${doc.data.details}`);
            setNodeDetails(doc.data)
        } catch (err) {
            console.log(err);
        };
    };

    const addNewNode = async (e) =>{
        const newNode = {
            _id: 'ANYOLDIRON',
            data: { label: 'This all just might be futile' },
            position: { x: 500, y: 300 }, // dynamic position TODO
        };

        try{
            await db.put(newNode);
        }catch(err){
            console.log(err);
        }

        const newEdge = {
            type: "smoothstep", 
            source: sourceNode, 
            target: "ANYOLDIRON", // TODO
            id: "RANDOM", 
            label: "AUTO EDGE", 
            style: { stroke: "black", strokeWidth: 5 }
        };
        
        getDocs();
        edges.push(newEdge);
        console.log(edges);
    }

    const PopupWindow = ()=>{
        return(
            <div className='popupWindow' onClick={()=> setPopup(false)}>
                <h2>{nodeDetails?.label}</h2>
                {nodeDetails?.details && <div className='popupDetails'>{nodeDetails.details}</div>}
                <button className='addNewNodeButton' onClick={addNewNode}>Add new node</button>
            </div>
        );
    };

  return (
    <div className='mainContainer'>
      <h1>Ideation App</h1>
        <button onClick={addStartingDocs}>Add Starting Docs</button>
        <button onClick={deleteDocs}>Delete Docs</button>
        {nodeData && <div className="flowContainer" style={{ height: '100%', width: "100%" }}>
            <ReactFlow nodes={nodeData} edges={edges} onNodeClick={handleClick}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>}
        {popup && createPortal(<PopupWindow />, document.body)}
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