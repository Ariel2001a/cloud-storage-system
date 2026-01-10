import { useState } from 'react';
import './login.css';
import CardLogo from '../../images/Alogo.png';

function Login() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Sign-in handler
  const handleSignIn = async () => {
  if (!username || !password) {
    alert('Please fill all fields');
    return;
  }

  const data = { email: username, password }; // <-- important

  try {
    const res = await fetch('http://localhost:8080/api/users/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      alert('Sign in failed: ' + errText);
      return;
    }

    const { token } = await res.json();
    localStorage.setItem('token', token);
    alert('Signed in successfully!');
    window.location.href = '/home';
  } catch (err) {
    alert('Could not connect to the server.');
    console.error(err);
  }
};
  // Go to register page
  const handleSignUp = () => {
    window.location.href = '/register';
  };

  return (
    <div className="MyCard">
      {/* LEFT COLUMN: Logo + Headlines + Sign-up prompt */}
      <div className="column left">
        <img src={CardLogo} alt="Logo" className="card-logo" />
        <h2 className="main_headline">Sign in to your account</h2>
        <div className="headline-signin">
          <h3 className="secondary_headline">Don’t have an account?</h3>
          <button
            className="btn btn-light sign-in-btn"
            type="button"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: login form */}
      <div className="column right">
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Buttons row */}
        <div className="buttons-row">
          <button
            className="btn SignIn-btn"
            type="button"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
