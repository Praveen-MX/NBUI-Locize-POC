import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Dashboard = () => {
  const { t } = useTranslation();
  const [itemCount, setItemCount] = useState(1);

  return (
    <>
      <header className="main-header">
        <h1>{t('dashboardTitle')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="search-section">
        <input
          type="text"
          className="search-bar"
          placeholder={t('searchPlaceholder')}
        />
        <button className="search-button">{t('searchButton')}</button>
      </div>

      {/* Trans Component */}
      <div className="feature-card">
        <h3>{t('trans.title', 'Trans Component')}</h3>
        <p>
          <Trans i18nKey="footerText">
            To learn more, <a href="https://docs.mendix.com/releasenotes/mobile/mendix-native-mobile-builder/" target="_blank" rel="noopener noreferrer">visit our documentation</a>.
          </Trans>
        </p>
      </div>

      {/* Interpolation */}
      <div className="feature-card">
        <h3>{t('interpolation.title', 'Interpolation')}</h3>
        <p className="feature-text">{t('welcomeMessage', { content: 'Mendix Native Mobile Builder' })}</p>
      </div>

      {/* Formatting */}
      <div className="feature-card">
        <h3>{t('formatting.title', 'Formatting')}</h3>
        <p className="feature-text">{t('todayIs', { date: new Date() })}</p>
      </div>

      {/* Plurals */}
      <div className="feature-card">
        <h3>{t('plurals.title', 'Plurals')}</h3>
        <p>{t('itemCount', { count: itemCount })}</p>
        <div className="button-group">
          <button onClick={() => setItemCount(itemCount > 0 ? itemCount - 1 : 0)}>-</button>
          <span>{itemCount}</span>
          <button onClick={() => setItemCount(itemCount + 1)}>+</button>
        </div>
      </div>

      {/* Default Value */}
      <div className="feature-card">
        <h3>{t('defaultValue.title', 'Default Value')}</h3>
        <p>{t('nonExistentKey', 'This key was not found, so this default text is shown.')}</p>
      </div>
    </>
  );
};

export default Dashboard;