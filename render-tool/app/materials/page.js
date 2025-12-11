'use client';

import { useState, useEffect } from 'react';
import { getStoredMaterials, saveMaterials } from '@/lib/materials';

export default function MaterialsPage() {
    const [materials, setMaterials] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);
    const [editForm, setEditForm] = useState(null);

    // Load on mount
    useEffect(() => {
        setMaterials(getStoredMaterials());
    }, []);

    const handleEditClick = (key) => {
        setSelectedKey(key);
        setEditForm({ ...materials[key] });
    };

    const handleSave = () => {
        const updated = { ...materials, [selectedKey]: editForm };
        setMaterials(updated);
        saveMaterials(updated);
        setSelectedKey(null);
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '8px' }}>Material Library</h1>
                <p style={{ color: 'var(--text-muted)' }}>Map SketchUp colors to real-world textures and finishes.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.entries(materials).map(([key, item]) => (
                        <div
                            key={key}
                            onClick={() => handleEditClick(key)}
                            style={{
                                background: 'var(--surface)',
                                border: selectedKey === key ? '1px solid var(--primary)' : '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: item.previewColor,
                                border: '2px solid var(--border)'
                            }} />
                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.name || key}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {item.material || item.component}
                                </p>
                            </div>
                        </div>
                    ))}

                    <button
                        className="btn btn-secondary"
                        onClick={() => alert('New Material Creation would go here (Out of scope for this step)')}
                    >
                        + Add New Color Mapping
                    </button>
                </div>

                {/* Editor */}
                <div>
                    {selectedKey && editForm ? (
                        <div style={{
                            background: 'var(--surface)',
                            padding: '32px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            position: 'sticky',
                            top: '24px'
                        }}>
                            <h2 style={{ marginBottom: '24px' }}>Edit: {selectedKey}</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Mapping Name</label>
                                    <input
                                        style={{ width: '100%' }}
                                        value={editForm.name || ''}
                                        onChange={e => handleInputChange('name', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Real Material Name</label>
                                    <input
                                        style={{ width: '100%' }}
                                        value={editForm.material || ''}
                                        onChange={e => handleInputChange('material', e.target.value)}
                                        placeholder="e.g. Oak Veneer"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Finish</label>
                                        <select
                                            style={{ width: '100%' }}
                                            value={editForm.finish || ''}
                                            onChange={e => handleInputChange('finish', e.target.value)}
                                        >
                                            <option value="Matte">Matte</option>
                                            <option value="Satin">Satin</option>
                                            <option value="Polished">Polished</option>
                                            <option value="Brushed">Brushed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Color Code (Real)</label>
                                        <input
                                            style={{ width: '100%' }}
                                            value={editForm.colorCode || ''}
                                            onChange={e => handleInputChange('colorCode', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Description / Component Type</label>
                                    <textarea
                                        style={{ width: '100%', minHeight: '100px' }}
                                        value={editForm.component || ''}
                                        onChange={e => handleInputChange('component', e.target.value)}
                                        placeholder="Is this an appliance? (e.g. Oven)"
                                    />
                                </div>

                                <div style={{ paddingTop: '16px', display: 'flex', gap: '12px' }}>
                                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                                    <button className="btn btn-secondary" onClick={() => setSelectedKey(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            Select a mapping to edit
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
