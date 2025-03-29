import { useEffect, useState } from 'react';
import AppLogo from '../../shared/components/app-logo';
import AccountButton from './account-button/account-button';
import GlobalMarketBar from './global-market-bar/global-market-bar';
import HeaderSearchBar from './header-search-bar/header-search-bar';
import './header.scss';
import Navigation from './navigation/navigation';
import ThemeButton from './theme-button';

export default function Header() {
  const [isBigHeader, setIsBigHeader] = useState(getIsBigHeader);

  useEffect(() => {
    const changeHeader = () => setIsBigHeader(getIsBigHeader());
    window.addEventListener('resize', changeHeader);

    return () => window.removeEventListener('resize', changeHeader);
  }, []);

  function getIsBigHeader(): boolean {
    // This value must match the media qeury value in css
    return window.innerWidth >= 749;
  }

  return (
    < header >
      <div className="header-content-wrapper">
        {isBigHeader ? <BigHeader /> : <SmallHeader />}
      </div>
    </header >
  );
}

function BigHeader() {
  return (
    <>
      <div className="upper-header">
        <GlobalMarketBar />

        <div className="upper-header-right">
          <ThemeButton />
          <AccountButton />
        </div>
      </div>

      <div className="lower-header">
        <AppLogo />
        <Navigation />
        <HeaderSearchBar />
      </div>
    </>
  );
}

function SmallHeader() {
  return (
    <>
      <div className="upper-header">
        <div className='upper-header-left'>
          <Navigation />
          <AppLogo />
        </div>

        <div className="upper-header-right">
          <ThemeButton />
          <AccountButton />
        </div>
      </div>

      <div className="lower-header">
        <HeaderSearchBar />
      </div>
    </>
  );
}