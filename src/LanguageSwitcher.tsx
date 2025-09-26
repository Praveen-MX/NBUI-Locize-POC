import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Languages {
  [key: string]: {
    name: string;
    nativeName: string;
  };
}

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<Languages>({});
 
  useEffect(() => {
    if (i18n.services.backendConnector.backend) {
      i18n.services.backendConnector.backend.getLanguages((err: Error | null, lngs: Languages) => {
        if (err) {
          console.error('Error fetching languages:', err);
          return;
        }
        console.log(lngs);
        setLanguages(lngs);
      });
    }
  }, [i18n]); // Use the i18n instance as the dependency
 
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-buttons-container">
      {Object.keys(languages).map((lng) => (
        <button
          key={lng}
          className={`language-button ${i18n.resolvedLanguage === lng ? 'active' : ''}`}
          type="submit"
          onClick={() => changeLanguage(lng)}
        >
          {languages[lng].nativeName}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;