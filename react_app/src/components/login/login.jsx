import { useState } from 'react';
import './login.css';
import CardLogo from '../../images/Alogo.png';
import LangButton from '../LangButton';

function Login({ lang, setLang }) {
  const isRtl = lang === 'he';

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Sign-in handler
  const handleSignIn = async () => {
    if (!username || !password) {
      alert(isRtl ? 'נא למלא את כל השדות' : 'Please fill all fields');
      return;
    }

    const email = username + '@ead.com';
    const data = { email, password };

    try {
      const res = await fetch('http://localhost:8080/api/users/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(
          isRtl
            ? 'התחברות נכשלה: ' + errText
            : 'Sign in failed: ' + errText
        );
        return;
      }

      const { token } = await res.json();
      sessionStorage.setItem('token', token);
      alert(isRtl ? 'התחברת בהצלחה!' : 'Signed in successfully!');
      window.location.href = '/';
    } catch (err) {
      alert(
        isRtl
          ? 'לא ניתן להתחבר לשרת'
          : 'Could not connect to the server.'
      );
      console.error(err);
    }
  };

  // Go to register page
  const handleSignUp = () => {
    window.location.href = '/register';
  };

  return (
    <>
      
      <LangButton lang={lang} setLang={setLang} />

      {/* ===== LOGIN CARD ===== */}
      <div
        className="MyCard"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        {/* LEFT COLUMN */}
        <div className="column left">
          <img src={CardLogo} alt="Logo" className="card-logo" />

          <h2 className="main_headline">
            {isRtl ? 'התחבר לחשבון שלך' : 'Sign in to your account'}
          </h2>

          <div className="headline-signin">
            <h3 className="secondary_headline">
              {isRtl ? 'אין לך חשבון?' : "Don’t have an account?"}
            </h3>

            <button
              className="btn btn-light sign-in-btn"
              type="button"
              onClick={handleSignUp}
            >
              {isRtl ? 'הרשמה' : 'Sign up'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="column right">
          <input
            type="text"
            className="form-control"
            placeholder={isRtl ? 'שם משתמש' : 'Username'}
            value={username}
          title={isRtl ? 'ניתן להזין שם משתמש או כתובת מייל (username@ead.com)' : 'You can enter a username or email address (username@ead.com)'}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control"
            placeholder={isRtl ? 'סיסמה' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="buttons-row">
            <button
              className="btn SignIn-btn"
              type="button"
              onClick={handleSignIn}
            >
              {isRtl ? 'התחברות' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}  



export default Login;
