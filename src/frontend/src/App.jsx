import React, { useEffect, useState } from 'react';
import './App.css';
import { loadParties } from './utils/loadParties';
import PartyCard from './components/PartyCard';

function App() {
    const [parties, setParties] = useState([]);

    useEffect(() => {
        loadParties().then(setParties);
    }, []);

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-8">Dortmund Kommunalwahl</h1>
            <div className="max-w-6xl mx-auto">
                {parties.map((party, index) => (
                    <PartyCard key={index} party={party} />
                ))}
            </div>
        </div>
    );
}

export default App;
