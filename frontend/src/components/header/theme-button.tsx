import { useEffect, useState } from "react";

export default function ThemeButton() {
  const [isDarkTheme, setIsDarkTheme] = useState(getIsDarkTheme);

  useEffect(() => toggleAppTheme(isDarkTheme), [isDarkTheme]);

  function getIsDarkTheme(): boolean {
    return JSON.parse(localStorage.getItem('isDarkTheme') || 'true');
  }

  function handleClick(): void {
    setIsDarkTheme(prev => !prev);
  }

  return (
    <button className='icon-button theme-button' onClick={handleClick}>
      {isDarkTheme
        ? <i className="bi bi-sun-fill"></i>
        : <i className="bi bi-moon-fill"></i>
      }
    </button>
  );
}

function toggleAppTheme(isDarkTheme: boolean): void {
  if (isDarkTheme)
    document.body.classList.remove('light-theme');
  else
    document.body.classList.add('light-theme');

  localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme));
}