import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import CardLogo from '../../images/Alogo.png';
import LangButton from '../LangButton';

function Register({ lang, setLang }) {
  const navigate = useNavigate();
  const isRtl = lang === 'he';

  // Form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // File upload
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  // Handlers
  const handleRegister = async () => {
    if (!firstname || !lastname || !username || !password || !confirm) {
      alert(isRtl ? 'נא למלא את כל השדות' : 'Please fill all fields');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      alert(
        isRtl
          ? 'הסיסמה חייבת להכיל לפחות 8 תווים, אות אחת ומספר אחד'
          : 'Password must be at least 8 characters and include at least 1 letter and 1 number'
      );
      return;
    }
    if (password !== confirm) {
      alert(isRtl ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
      return;
    }
const data = {
  first_name: firstname,
  last_name: lastname,
  email: username + '@ead.com',  // backend expects "email"
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
        alert(isRtl ? 'נרשמת בהצלחה!' : 'Registered successfully!');
        navigate('/login');
      } else {
        const errText = await res.text();
        alert(
          isRtl
            ? 'ההרשמה נכשלה: ' + errText
            : 'Registration failed: ' + errText
        );
      }
    } catch (err) {
      alert(isRtl ? 'לא ניתן להתחבר לשרת' : 'Could not connect to the server.');
      console.error(err);
    }
  };

  const handleSignIn = () => navigate('/login');
  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => e.target.files.length && setFile(e.target.files[0]);

  return (
    <>
     <LangButton lang={lang} setLang={setLang} />
      {/* ===== REGISTER CARD ===== */}
      <div className="MyCard" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="column left">
          <img src={CardLogo} alt="Logo" className="card-logo" />
          <h2 className="main_headline">{isRtl ? 'צור חשבון חדש' : 'Create a new account'}</h2>
          <div className="headline-signin">
            <h3 className="secondary_headline">{isRtl ? 'כבר יש לך חשבון?' : 'Already have an account?'}</h3>
            <button className="btn btn-light sign-in-btn" type="button" onClick={handleSignIn}>
              {isRtl ? 'התחברות' : 'Sign in'}
            </button>
          </div>
        </div>

        <div className="column right">
          <input type="text" className="form-control" placeholder={isRtl ? 'שם פרטי' : 'First name'} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          <input type="text" className="form-control" placeholder={isRtl ? 'שם משפחה' : 'Last name'} value={lastname} onChange={(e) => setLastname(e.target.value)} />
          <input type="text" className="form-control" placeholder={isRtl ? 'שם משתמש' : 'Username'} value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" className="form-control" title={isRtl ? 'הסיסמה חייבת להכיל לפחות 8 תווים, לפחות אות אחת באנגלית ולפחות ספרה אחד' : 'Password must contain 8 or more characters, at least 1 letter and 1 number'} placeholder={isRtl ? 'סיסמה' : 'Password'} value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" className="form-control" placeholder={isRtl ? 'אימות סיסמה' : 'Confirm password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} />

          <div className="buttons-row">
            <button className="btn upload-btn" type="button" onClick={handleUploadClick}>
              {isRtl ? 'העלאת תמונה' : 'Upload Picture'}
            </button>
            <button className="btn register-btn" type="button" onClick={handleRegister}>
              {isRtl ? 'הרשמה' : 'Register'}
            </button>
          </div>

          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
        </div>
      </div>
    </>
  );
}

export default Register;


