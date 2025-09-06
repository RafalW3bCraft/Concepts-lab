import { CSSProperties } from 'react';

const loadingScreenStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#0a0a0a',
  color: '#ffd700',
  fontFamily: 'Inter, sans-serif',
  zIndex: 1000
};

const iconStyle: CSSProperties = {
  fontSize: '48px',
  marginBottom: '20px'
};

const titleStyle: CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '32px'
};

const textStyle: CSSProperties = {
  margin: '0',
  fontSize: '18px',
  opacity: 0.8
};

const barStyle: CSSProperties = {
  marginTop: '30px',
  width: '200px',
  height: '4px',
  background: '#333',
  borderRadius: '2px',
  overflow: 'hidden'
};

const progressStyle: CSSProperties = {
  width: '30%',
  height: '100%',
  background: 'linear-gradient(90deg, #ffd700, #ff6b6b)',
  borderRadius: '2px'
};

export default function LoadingScreen() {
  return (
    <div style={loadingScreenStyle}>
      <div style={iconStyle}>🎰</div>
      <h1 style={titleStyle}>GO-GAMBLER</h1>
      <p style={textStyle}>Loading 3D Casino...</p>
      <div style={barStyle}>
        <div style={progressStyle} />
      </div>
    </div>
  );
}