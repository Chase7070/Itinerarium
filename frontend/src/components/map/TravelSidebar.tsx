import Image from 'next/image';
import React, { useRef, useState } from 'react';

const TravelSidebar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: string; file: File }[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageObjects = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setUploadedImages((prev) => [...prev, ...imageObjects]);
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click(); // click + to trigger upload
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, img: { id: string; file: File }) => {
    e.dataTransfer.setData('image/id', img.id); // use this ID to mark on the map
  };

  return (
    <div style={styles.sidebar}>
      <button style={styles.box}>📍</button>
      <button style={styles.box} onClick={handlePlusClick}>➕</button>
      <button style={styles.box}>share</button>
      <button style={{ ...styles.box, marginTop: '20px' }}>Today Plan</button>

      {/* hidden file upload control */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* My Album title + image thumbnail display */}
      {uploadedImages.length > 0 && (
        <div style={styles.albumSection}>
          <h4 style={styles.albumTitle}>My Album</h4>
          <div style={styles.imageContainer}>
            {uploadedImages.map((img) => (
              <Image unoptimized width={70} height={70}
                key={img.id}
                src={img.id}
                alt="uploaded"
                draggable
                onDragStart={(e) => handleDragStart(e, img)}
                style={styles.thumbnail}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  box: {
    border: '1px solid rgba(0, 0, 0, 0.2)',
    padding: '12px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'transform 0.2s ease',
  },
  albumSection: {
    marginTop: '30px',
  },
  albumTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#444',
  },
  imageContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  thumbnail: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'grab',
    border: '1px solid #ccc',
  },
};

export default TravelSidebar;
