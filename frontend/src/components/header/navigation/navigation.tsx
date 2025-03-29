import { NavLink } from 'react-router';
import './navigation.scss';
import { useState } from 'react';

export default function Navigation() {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  function toggleNavMenu(): void {
    setIsNavMenuOpen(prevVal => !prevVal);
  }

  return (
    <>
      <button className='navigation-toggle' onClick={toggleNavMenu}>
        <i className="bi bi-list"></i>
        <i className="bi bi-x-lg"></i>
      </button>

      <nav className={`header-nav${isNavMenuOpen ? ' open' : ''}`}>
        <ul className="left-nav">
          <li>
            <NavLink to='/' >Coins</NavLink >
          </li>
          <li>
            <NavLink to='/' >Exchanges</NavLink >
          </li>
        </ul>

        <ul className="right-nav">
          <li>
            <NavLink to='/' >Watchlist</NavLink >
          </li>
          <li>
            <NavLink to='/' >Portfolio</NavLink >
          </li>
        </ul>
      </nav >
    </>
  );
}