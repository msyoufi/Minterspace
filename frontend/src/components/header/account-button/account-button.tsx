import './account-button.scss';

export default function AccountButton() {
  return (
    <button className='account-button'>
      <span>Login</span>
      <i className="bi bi-person-circle"></i>
    </button>
  );
}