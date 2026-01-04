import { useState, useRef } from 'react';
import './Register.css';
import CardLogo from '../../images/Alogo.png';

function Register() {
  // Form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // File upload ref
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  // Register button handler
  const handleRegister = async () => {
    if (!firstname || !lastname || !username || !password || !confirm) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    const data = {
      first_name: firstname,
      last_name: lastname,
      email: username + '@gmail.com',
      password,
      image: file ? file.name : 'Alogo.png',
    };

    try {
      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Registered successfully!');
        window.location.href = '/login';
      } else {
        const errText = await res.text();
        alert('Registration failed: ' + errText);
      }
    } catch (err) {
      alert('Could not connect to the server.');
      console.error(err);
    }
  };

  // Sign-in handler
  const handleSignIn = () => {
    window.location.href = '/login';
  };

  // Upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // File selected
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="MyCard">
      {/* LEFT COLUMN: Logo + Headlines + Sign-in */}
      <div className="column left">
        <img src={CardLogo} alt="Logo" className="card-logo" />
        <h2 className="main_headline">Create a new account</h2>
        <div className="headline-signin">
          <h3 className="secondary_headline">Already has an account?</h3>
          <button
            className="btn btn-light sign-in-btn"
            type="button"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Inputs + Upload + Register */}
      <div className="column right">
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
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
        <input
          type="password"
          className="form-control"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* Buttons row */}
        <div className="buttons-row">
          <button
            className="btn upload-btn"
            type="button"
            onClick={handleUploadClick}
          >
            Upload Picture
          </button>

          <button
            className="btn register-btn"
            type="submit"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}

export default Register;
