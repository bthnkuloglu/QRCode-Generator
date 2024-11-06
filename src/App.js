import './App.css';
import { useState, useRef, useEffect} from 'react';
import QRCode from 'react-qr-code';
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [url, setURL] = useState('');
  const [qrcode, setQRCode] = useState('');
  const [bgColor, setBGColor] = useState('#ffffff');
  const [fgColor, setFGColor] = useState('#000000');
  const [alertTriggered,setAlertTriggered] = useState(false);
  const qrCodeRef = useRef(null); 
  useEffect(() => {
    if (alertTriggered && !qrcode) {
      alert("Lütfen önce QR kodunu oluşturun!");
      setAlertTriggered(false);  // Uyarı gösterildikten sonra bu değeri sıfırlıyoruz
    }
  }, [alertTriggered, qrcode]); // alertTriggered veya qrcode değişirse, uyarıyı kontrol et

  const downloadQRCode = () => {
    if (!qrcode) {
      setAlertTriggered(true);  // QR kodu oluşturulmadan butona tıklanırsa uyarı veriyoruz
      return;
    }

    const svg = qrCodeRef.current.children[0];
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 420;
    canvas.height = 420;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = png;
      link.download = 'qr-code.png';
      link.click();
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };
  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const GenerateQR = () => {
    if (url) {
      setQRCode(url);
    }
  };

  return (
    <div className={isDarkMode ? 'app dark-mode' : 'app'}>
      <label className="switch">
        <input type="checkbox" onChange={handleToggle} checked={isDarkMode} />
        <span className="slider"></span>
      </label>
      <h1>QR Code Generator</h1>
      <div className="qrArea">
        <input
          type='text'
          className="text"
          placeholder='Enter your link, address'
          value={url}
          onChange={(evt) => setURL(evt.target.value)}
        />
        <div className="color-picker">
          <label>
            Background Color
            <input
              type="color"
              className="picker"
              value={bgColor}
              onChange={(e) => setBGColor(e.target.value)}
            />
          </label>
          <label>
            Foreground Color
            <input
              type="color"
              className="picker"
              value={fgColor}
              onChange={(e) => setFGColor(e.target.value)}
            />
          </label>
        </div>
        <button className='submit' onClick={GenerateQR}> Create </button>
        {qrcode && (
          <div className="qr-code" ref={qrCodeRef}>
            <QRCode
              id='qr-codes'
              className='img'
              value={qrcode}
              size={400}
              bgColor={bgColor}
              fgColor={fgColor}
            />
            </div>
            
        )}
         <button onClick={downloadQRCode} className="download-button">Download QR Code</button>
         
      </div>
    </div>
  );
}

export default App;
