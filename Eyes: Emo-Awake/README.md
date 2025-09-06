# 👁️‍🗨️ Mythic Eyes: Emotion Awakening

**Author:** RafalW3bCraft | **Version:** 1.0.0

Real-time AR emotion scanner that transforms facial expressions into mythical personas with glowing eye effects using AI face detection.

## Features

- **Real-time Emotion Detection** - AI facial expression analysis
- **Mythic Persona Mapping** - Emotion-to-mythology conversion
- **Live Eye Effects** - Glowing iris, sparks, aura overlays
- **Photo Capture** - High-res screenshots with effects
- **Gallery** - Local image storage
- **Camera Controls** - Front/rear switching, mirror mode

## Mythic Personas

| Emotion | Persona | Color |
|---------|---------|-------|
| Happy | Apollo | Golden |
| Angry | Ares | Red |
| Surprised | Zeus | Blue |
| Neutral | Shiva | Sapphire |
| Sad | Hades | Purple |
| Fear | Medusa | Emerald |
| Disgusted | Anubis | Amber |

## Quick Start

### Requirements
- Modern browser with camera
- Good lighting
- Camera permissions

### Setup
```bash
python server.py
```
Open: `http://localhost:5000`

### Usage
1. Allow camera access
2. Position face in frame
3. Express emotions
4. Watch mythic transformation
5. Capture photos

## Controls

- **📸 Capture** - Take photo
- **🔁 Camera** - Switch source
- **🪞 Mirror** - Toggle mirror
- **👁️ Live Preview** - Toggle effects
- **✨ Sparks** - Particle effects
- **🜂 Aura** - Mystical glow

## Technical Stack

**Frontend:** HTML5/CSS3/JavaScript  
**ML Engine:** MediaPipe Tasks Vision  
**Graphics:** Canvas API  
**Camera:** WebRTC

### Architecture
```
Face Detection → Emotion Analysis → Persona Mapping → Visual Effects
```

### Key Features
- 468+ facial landmarks
- 60 FPS rendering
- GPU acceleration
- Real-time blendshapes
- Additive lighting effects

## Project Structure

```
mythic-eyes/
├── README.md     # Documentation
├── scan.html    # Main application
└── server.py    # Development server
```

## Usage Tips

### Optimal Setup
- **Lighting** - Well-lit face
- **Position** - Center in frame
- **Distance** - 1-3 feet from camera
- **Stability** - Minimize movement

### Customization
- **Glow Intensity** - 0-150%
- **Iris Size** - 80-200%
- **Bloom Effect** - 0-150%
- **Manual Persona** - Override auto-detection

## Performance

- **Frame Rate** - 60 FPS real-time
- **Latency** - <50ms response
- **Accuracy** - 85%+ emotion detection
- **Hardware** - GPU accelerated ML

## Browser Support

**Compatible:**
- Chrome 88+ (recommended)
- Firefox 85+
- Safari 14+
- Edge 88+

**Required APIs:**
- MediaDevices
- Canvas 2D
- WebAssembly
- ES6 Modules

## Troubleshooting

### Camera Issues
**No camera feed:**
- Check permissions
- Close other camera apps
- Refresh page

**Poor detection:**
- Improve lighting
- Center face
- Remove obstructions

### Performance Issues
**Lag/stuttering:**
- Close browser tabs
- Reduce effect intensity
- Use newer browser

**No effects:**
- Enable Live Preview
- Verify face detection
- Clear browser cache

### Quick Fixes
1. **Black screen** - Grant camera permissions
2. **No effects** - Ensure face detected
3. **Slow performance** - Lower settings
4. **App crash** - Refresh page

## Development

### Core Files
- `scan.html` - Single-file app with embedded CSS/JS
- `server.py` - HTTP server with CORS support

### Key Functions
```javascript
initFace()        // Initialize MediaPipe
estimateEmotion() // Analyze expressions
renderFX()        // Draw effects
captureImage()    // Save photos
```

### Adding Personas
```javascript
const PERSONAS = {
  newPersona: {
    iris: "#color",
    rim: "#color", 
    aura: "#color",
    spark: "#color"
  }
};
```

### Emotion Mapping
```javascript
function personaFromEmotion(emotion) {
  switch(emotion) {
    case "happy": return "apollo";
    case "angry": return "ares";
    // Add new mappings
  }
}
```

## Security & Privacy

- **Local Processing** - All ML runs in browser
- **No Data Upload** - Images stay on device
- **Camera Only** - No microphone access
- **HTTPS Ready** - SSL compatible

## Advanced Configuration

### MediaPipe Settings
```javascript
// Face detection thresholds
minFaceDetectionConfidence: 0.3
minFacePresenceConfidence: 0.3
minTrackingConfidence: 0.3
```

### Effect Parameters
```javascript
// Customizable visual settings
intensity: 0.9    // Glow strength
irisSize: 1.1     // Pupil scale
bloom: 1.0        // Halo effect
sparkCount: 6     // Particle count
```

### Performance Tuning
```javascript
// Frame rate control
renderInterval: 16  // ~60 FPS
emotionUpdate: 500  // 2x per second
```

## API Reference

### Main Classes
- `FaceLandmarker` - MediaPipe face detection
- `CanvasRenderingContext2D` - Graphics rendering
- `MediaStream` - Camera access

### Core Methods
- `openCamera()` - Initialize camera
- `predictLoop()` - Main render loop
- `estimateEmotion()` - Analyze expressions
- `renderFX()` - Draw visual effects

## Deployment

### Local Development
```bash
python server.py
```

### Production
- Serve static files via any web server
- Ensure HTTPS for camera access
- Configure CORS headers

## Contributing

Add new features by extending:
- Persona definitions
- Emotion mappings
- Visual effects
- Camera controls


---

**RafalW3bCraft** | *Ancient wisdom meets modern AI*