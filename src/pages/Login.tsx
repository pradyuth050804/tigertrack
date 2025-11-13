import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { sendOtpToEmail, verifyCode, setRoleForUser } = useAuth();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'enter' | 'verify' | 'chooseRole'>('enter');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSend = async () => {
    setMessage('');
    if (!email) return setMessage('Enter an email');
    const ok = await sendOtpToEmail(email);
    if (ok) {
      setStage('verify');
      setMessage('OTP sent. Check console (dev) or your email.');
    } else setMessage('Unable to send OTP');
  };

  const handleVerify = async () => {
    setMessage('');
    const res = await verifyCode(email, code);
    if (res.success) {
      // If role exists, redirect; otherwise ask to choose
      if (res.role) {
        navigate('/tigers');
      } else {
        setStage('chooseRole');
      }
    } else {
      setMessage('Invalid or expired code');
    }
  };

  const finishRole = (role: 'administrator' | 'user') => {
    setRoleForUser(email, role);
    navigate('/tigers');
  };

  return (
    <div className="max-w-md mx-auto py-24">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      {stage === 'enter' && (
        <div className="space-y-3">
          <Input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSend} className="w-full">Send OTP</Button>
          {message && <div className="text-sm text-muted-foreground">{message}</div>}
        </div>
      )}

      {stage === 'verify' && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Enter the 6-digit code sent to {email}</div>
          <Input placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button onClick={handleVerify} className="w-full">Verify</Button>
          <div className="flex justify-between">
            <Button variant="link" onClick={() => setStage('enter')}>Change email</Button>
            <Button variant="ghost" onClick={handleSend}>Resend OTP</Button>
          </div>
          {message && <div className="text-sm text-destructive">{message}</div>}
        </div>
      )}

      {stage === 'chooseRole' && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Choose your role</div>
          <div className="flex gap-2">
            <Button onClick={() => finishRole('user')} className="flex-1">User</Button>
            <Button onClick={() => finishRole('administrator')} className="flex-1">Administrator</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
