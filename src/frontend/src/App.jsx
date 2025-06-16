import React, { useEffect, useState } from 'react';
import './App.css';
import { loadParties } from './utils/loadParties';
import PartyCard from './components/PartyCard';
import MenuBar from './components/MenuBar';
import GenAIBox from './components/GenAIBox';
import ScrollToTopButton from './components/ScrollToTopButton';
import PromptDescription from './components/Description';
import Footer from './components/Footer';
import Disclaimer from './components/Disclaimer';


function App() {
    const [parties, setParties] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        loadParties().then(setParties);
    }, []);

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <MenuBar />
            <ScrollToTopButton />
            <div className="flex justify-center flex-col max-w-3xl">
                <GenAIBox selectedImageIndex={selectedImageIndex} setSelectedImageIndex={setSelectedImageIndex} />
                <div className='border-t-2 border-secondary my-10'>
                    <h1 className='text-secondary m-5'>Wahlprogramme 2025</h1>
                </div>
                <div className="max-w-4xl mx-auto m-4">
                    {parties.map((party, index) => (
                        <PartyCard
                            key={index}
                            party={party}
                            align={index % 2 === 0 ? 'left' : 'right'}
                            selectedImageIndex={selectedImageIndex}
                        />
                    ))}
                </div>
                {/* <div className='border-t-4 border-secondary my-10'>
                    <h1 className='text-secondary m-5'>Anfrage an die KI</h1>
                </div> */}
                {/* <PromptDescription></PromptDescription> */}
                <Disclaimer></Disclaimer>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default App;