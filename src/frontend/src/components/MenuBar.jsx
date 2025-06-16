import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MenuBar() {
    const { t, i18n } = useTranslation();

    const switchLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="w-full flex justify-between items-center mb-4 p-2 rounded">
            <div className="flex w-full items-center justify-around ">
                <img src="/logo.png" alt="Logo" className="h-28 w-28 mr-4" />
                <h1 className="text-5xl font-bold text-secondary">{t('title')}</h1>
                <div>
                    <button
                        onClick={() => switchLanguage('de')}
                        className="mx-1 px-3 py-1 bg-primary hover:bg-white rounded"
                    >   
                        <p className="text-white">DE</p>  
                    </button>
                    <button
                        onClick={() => switchLanguage('en')}
                        className="mx-1 px-3 py-1 bg-primary hover:bg-white rounded"
                    >
                        <p className="text-white">EN</p>  
                    </button>
                </div>
            </div>
        </div>
    );
}
