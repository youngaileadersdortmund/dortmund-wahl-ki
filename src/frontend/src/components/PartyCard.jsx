import React from 'react';

export default function PartyCard({ party }) {
    return (
        <div className="flex flex-col sm:flex-row bg-gray-200 rounded-lg shadow p-4 mb-4">
            <div className="sm:w-2/3 mb-4 sm:mb-0 sm:pr-4">
                <h2 className="text-2xl font-bold mb-2 capitalize">{party.metadata.displayName || party.name}</h2>
                <p className="text-gray-700">{party.metadata.description || 'Keine Beschreibung vorhanden.'}</p>
            </div>  
            <div className="sm:w-1/3 flex items-center justify-center">
                {party.images.length > 0 ? (
                    <img
                        src={party.images[0]}
                        alt={`${party.name} Hauptbild`}
                        className="w-full h-auto rounded-md object-contain"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md">
                        <span className="text-gray-500">Kein Bild</span>
                    </div>
                )}
            </div>
        </div>
    );
}
