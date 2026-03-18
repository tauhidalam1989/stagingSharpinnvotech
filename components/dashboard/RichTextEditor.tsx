'use client';

import React, { useRef, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  galleryImages?: string[]; // Optional: pick from already uploaded images
}

const RichTextEditor = ({ value, onChange, placeholder, galleryImages = [] }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'bg' | null>(null);
  const [showImageSource, setShowImageSource] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);

  // Sync value from props to editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, htmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    if (htmlMode) return;
    document.execCommand(command, false, value);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        const fullUrl = 'https://' + url;
        execCommand('createLink', fullUrl);
      } else {
        execCommand('createLink', url);
      }
    }
  };

  const insertImage = () => {
    setShowImageSource(!showImageSource);
  };

  const handleImageUrl = () => {
    const url = prompt('Enter the image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
    setShowImageSource(false);
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        execCommand('insertImage', base64);
      };
      reader.readAsDataURL(file);
    }
    setShowImageSource(false);
  };

  const selectFromGallery = (url: string) => {
    execCommand('insertImage', url);
    setShowGalleryPicker(false);
    setShowImageSource(false);
  };

  const colors = [
    '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
    '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
    '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79',
    '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47',
    '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130',
  ];

  const ToolbarButton = ({ command, icon, label, val = '', onClick }: { command?: string, icon: string, label: string, val?: string, onClick?: () => void }) => (
    <button
      type="button"
      onClick={onClick || (() => execCommand(command!, val))}
      disabled={htmlMode && command !== 'html'}
      className={`p-2 h-8 min-w-[32px] flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors ${htmlMode && command !== 'html' ? 'opacity-30 cursor-not-allowed' : ''}`}
      title={label}
    >
      <i className={`fas ${icon} text-xs`}></i>
    </button>
  );

  return (
    <div className={`relative flex flex-col rounded-xl border transition-all ${
      isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-200 dark:border-zinc-800'
    } bg-white dark:bg-zinc-900`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 relative z-20 rounded-t-xl">
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700">
          <ToolbarButton command="bold" icon="fa-bold" label="Bold" />
          <ToolbarButton command="italic" icon="fa-italic" label="Italic" />
          <ToolbarButton command="underline" icon="fa-underline" label="Underline" />
          <ToolbarButton command="strikeThrough" icon="fa-strikethrough" label="Strikethrough" />
        </div>
        
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700">
          <ToolbarButton command="formatBlock" val="h1" icon="fa-heading" label="Heading 1" />
          <ToolbarButton command="formatBlock" val="h2" icon="fa-heading" label="Heading 2" />
          <ToolbarButton command="formatBlock" val="h3" icon="fa-heading" label="Heading 3" />
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700">
          <ToolbarButton command="insertUnorderedList" icon="fa-list-ul" label="Bullet List" />
          <ToolbarButton command="insertOrderedList" icon="fa-list-ol" label="Numbered List" />
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700">
          <ToolbarButton command="justifyLeft" icon="fa-align-left" label="Align Left" />
          <ToolbarButton command="justifyCenter" icon="fa-align-center" label="Align Center" />
          <ToolbarButton command="justifyRight" icon="fa-align-right" label="Align Right" />
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700 relative">
          <ToolbarButton icon="fa-link" label="Insert Link" onClick={insertLink} />
          <ToolbarButton icon="fa-image" label="Insert Image" onClick={insertImage} />
          
          {showImageSource && (
            <div className="absolute top-full left-0 z-50 mt-1 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl w-48 space-y-1">
              <button 
                type="button"
                onClick={() => { fileInputRef.current?.click(); }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center gap-2"
              >
                <i className="fas fa-upload text-[10px]"></i>
                Upload from Local
              </button>
              {galleryImages.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setShowGalleryPicker(true)}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center gap-2"
                >
                  <i className="fas fa-images text-[10px]"></i>
                  Pick from Gallery
                </button>
              )}
              <button 
                type="button"
                onClick={handleImageUrl}
                className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center gap-2"
              >
                <i className="fas fa-link text-[10px]"></i>
                Insert from URL
              </button>
            </div>
          )}

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLocalImageUpload} />
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-zinc-200 dark:border-zinc-700 relative">
          <ToolbarButton 
            onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')} 
            icon="fa-font" 
            label="Text Color" 
          />
          <ToolbarButton 
            onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')} 
            icon="fa-fill-drip" 
            label="Background Color" 
          />
          
          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl grid grid-cols-8 gap-1 w-48">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', color);
                    setShowColorPicker(null);
                  }}
                  className="w-5 h-5 rounded-sm border border-zinc-200 dark:border-zinc-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5">
           <button
            type="button"
            onClick={() => setHtmlMode(!htmlMode)}
            className={`p-2 h-8 min-w-[32px] flex items-center justify-center rounded-md transition-colors ${
              htmlMode 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}
            title="Toggle HTML Mode"
          >
            <i className="fas fa-code text-xs"></i>
          </button>
          <ToolbarButton command="removeFormat" icon="fa-eraser" label="Clear Formatting" />
        </div>
      </div>

      {/* Editable Area / Code Area */}
      <div className="relative min-h-[300px] flex flex-col rounded-b-xl overflow-hidden">
        {htmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-grow p-4 md:p-5 outline-none text-sm text-blue-600 dark:text-blue-400 font-mono bg-zinc-50 dark:bg-zinc-800/20 resize-none min-h-[300px]"
            spellCheck="false"
            placeholder="Enter HTML code here..."
          />
        ) : (
          <>
            {(!value || value === '<br>') && !isFocused && (
              <div className="absolute top-4 left-5 text-zinc-400 pointer-events-none text-sm font-medium">
                {placeholder || 'Start typing...'}
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-grow p-4 md:p-5 outline-none text-sm text-zinc-900 dark:text-zinc-100 font-medium prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 overflow-y-auto min-h-[300px]"
              spellCheck="false"
            ></div>
          </>
        )}
      </div>

      {/* Gallery Picker Modal Overlay */}
      {showGalleryPicker && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowGalleryPicker(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">Select from Gallery</h3>
              <button type="button" onClick={() => setShowGalleryPicker(false)} className="text-zinc-400 hover:text-zinc-600"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {galleryImages.map((img, i) => (
                <button key={i} type="button" onClick={() => selectFromGallery(img)} className="aspect-square rounded-lg overflow-hidden border border-zinc-200 hover:border-blue-500 transition-all group relative">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-blue-600/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <i className="fas fa-plus text-white shadow-sm"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #a1a1aa;
          cursor: text;
        }
        .prose h1 { font-size: 1.5rem !important; font-weight: 800 !important; margin-bottom: 0.5rem !important; }
        .prose h2 { font-size: 1.25rem !important; font-weight: 700 !important; margin-bottom: 0.5rem !important; }
        .prose h3 { font-size: 1.1rem !important; font-weight: 600 !important; margin-bottom: 0.5rem !important; }
        .prose p { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; line-height: 1.6 !important; }
        .prose a { color: #2563eb !important; text-decoration: underline !important; cursor: pointer; }
        .prose a:hover { color: #1d4ed8 !important; }
        .prose img { max-width: 100%; border-radius: 0.75rem; display: block; margin: 1rem auto; }
        .dark .prose { color: #e4e4e7 !important; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
