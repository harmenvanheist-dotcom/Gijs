'use client';

import { useState, useEffect } from 'react';
import { getStoredMaterials } from '@/lib/materials';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  // Materials state to display "Detected Mappings" (Simulator)
  const [materials, setMaterials] = useState({});

  useEffect(() => {
    setMaterials(getStoredMaterials());
    // Try to load key from local storage for convenience
    const storedKey = localStorage.getItem('replicate_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleKeySave = (val) => {
    setApiKey(val);
    localStorage.setItem('replicate_api_key', val);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultImage(null); // Reset previous result
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);

    try {
      const base64Image = await convertToBase64(selectedImage);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          materials,
          image: base64Image,
          userApiKey: apiKey
        })
      });

      const data = await res.json();

      if (data.success) {
        setResultImage(data.resultUrl);
      } else {
        alert("Error: " + data.error);
        if (data.error.includes("API Key")) setShowKeyInput(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate render");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 0', position: 'relative' }}>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          style={{ position: 'absolute', top: 20, right: 0, fontSize: '0.8rem', opacity: 0.5 }}
        >
          {apiKey ? 'API Key Set ✓' : 'Set API Key'}
        </button>

        {showKeyInput && (
          <div style={{ position: 'absolute', top: 50, right: 0, zIndex: 10, background: 'var(--surface)', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
            <input
              type="password"
              placeholder="Replicate API Token"
              value={apiKey}
              onChange={(e) => handleKeySave(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        )}
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', lineHeight: 1.1 }}>
          Turn SketchUp into <span style={{ color: 'var(--primary)' }}>Reality</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Upload your raw SketchUp export, map your colors, and get a photorealistic render in seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>

        {/* Left Column: Editor & Preview */}
        <div>
          {/* Upload Area */}
          <div style={{
            aspectRatio: '16/9',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            {!previewUrl ? (
              <>
                <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Drag and drop or click to upload</p>
                <label className="btn btn-primary">
                  Select SketchUp Export
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
              </>
            ) : (
              // If we have a result, show comparison or just result?
              // For MVP let's toggle between Input and Output if result exists, or show side-by-side?
              // Let's simple show result if ready, else preview.
              <img
                src={resultImage || previewUrl}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}

            {isGenerating && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
              }}>
                <div className="spinner" style={{
                  width: '40px', height: '40px', border: '3px solid var(--border)',
                  borderTopColor: 'var(--primary)', borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '16px', color: 'var(--text-main)' }}>Rendering with AI...</p>
                <style jsx>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
              </div>
            )}
          </div>

          {/* Prompt Bar */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <input
              style={{ flex: 1, height: '56px', fontSize: '1.1rem' }}
              placeholder="Describe the style (e.g. Modern Scandinavian, Warm Lighting, Evening)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="btn btn-primary"
              style={{ height: '56px', padding: '0 40px', fontSize: '1.1rem' }}
              onClick={handleGenerate}
              disabled={isGenerating || !selectedImage}
            >
              Generate Render
            </button>
          </div>
        </div>

        {/* Right Column: Active Mappings */}
        <div>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Active Material Map</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              The AI will look for these colors in your image and replace them with real materials.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.values(materials).map((mat) => (
                <div key={mat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '4px',
                    background: mat.previewColor, border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{mat.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{mat.material || mat.component}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Need to change a material?
              </p>
              <a href="/materials" className="btn btn-secondary" style={{ width: '100%', height: '40px' }}>
                Edit Library
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
