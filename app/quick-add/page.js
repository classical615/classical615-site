'use client';

import { useState } from 'react';

export default function QuickAddPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  function unlock() {
    setUnlocked(true);
  }

  async function handleExtract() {
    setError('');
    setSavedMessage('');
    setExtracted(null);
    setLoading(true);
    try {
      const res = await fetch('/api/quick-add-extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quick-add-password': password,
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setExtracted(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setExtracted((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/quick-add-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-quick-add-password': password,
        },
        body: JSON.stringify(extracted),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong saving');
      } else {
        setSavedMessage('Added to your Pending Approval view in Airtable!');
        setExtracted(null);
        setUrl('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!unlocked) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>Quick Add - Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          onClick={unlock}
          style={{ width: '100%', padding: 10, background: '#2C4031', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Quick Add a Concert</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Paste a link to any concert page. It'll be read and pulled into a preview below for you to check
        before anything gets saved.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/some-concert"
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          onClick={handleExtract}
          disabled={loading || !url}
          style={{
            padding: '10px 20px',
            background: loading ? '#999' : '#D97A43',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Reading page...' : 'Extract Info'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#fee', color: '#900', borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {savedMessage && (
        <div style={{ padding: 12, background: '#efe', color: '#060', borderRadius: 6, marginBottom: 16 }}>
          {savedMessage}
        </div>
      )}

      {extracted && (
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
          <h2 style={{ fontSize: 16, marginBottom: 16 }}>Review before saving:</h2>

          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Concert Name</div>
            <input
              value={extracted.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Date (YYYY-MM-DD)</div>
              <input
                value={extracted.date || ''}
                onChange={(e) => updateField('date', e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </label>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Time</div>
              <input
                value={extracted.time || ''}
                onChange={(e) => updateField('time', e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Venue</div>
            <input
              value={extracted.venue || ''}
              onChange={(e) => updateField('venue', e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Presenter</div>
            <input
              value={extracted.presenter || ''}
              onChange={(e) => updateField('presenter', e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Ticket Price</div>
              <input
                value={extracted.ticketPrice || ''}
                onChange={(e) => updateField('ticketPrice', e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </label>
            <label style={{ flex: 2 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Ticket Link</div>
              <input
                value={extracted.ticketLink || ''}
                onChange={(e) => updateField('ticketLink', e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Description</div>
            <textarea
              value={extracted.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: 12,
              background: saving ? '#999' : '#2C4031',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: saving ? 'default' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {saving ? 'Saving...' : 'Add to Pending Approval'}
          </button>
        </div>
      )}
    </div>
  );
}
