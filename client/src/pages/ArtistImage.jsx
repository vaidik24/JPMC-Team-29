import React, { useState } from 'react';

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Kindly choose an image only!');
      event.target.value = null;
    }
  };

  const fileUploadHandler = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    if (!category) {
      alert('Please select a category!');
      return;
    }

    console.log('File:', selectedFile);
    console.log('Category:', category);

    alert('File uploaded successfully!');
  };

  const containerStyle = {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px 0',
    marginTop: '20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0056b3',
  };

  const imageStyle = {
    maxWidth: '100%',
    marginTop: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <h2>Upload Image</h2>
      <ol style={{ textAlign: 'left' }}>
        <li>The background must be white.</li>
        <li>The image should be clear.</li>
      </ol>
      <form onSubmit={fileUploadHandler}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">Select a category</option>
          <option value="Terracotta Ornaments & Home Décor">Terracotta Ornaments & Home Décor</option>
          <option value="Moonj Based Handicrafts">Moonj Based Handicrafts</option>
          <option value="Banana Fiber based ornaments & Home Décor">Banana Fiber based ornaments & Home Décor</option>
          <option value="Jute Bags & Allied Products">Jute Bags & Allied Products</option>
          <option value="Macrame Based Handicraft">Macrame Based Handicraft</option>
          <option value="Others">Others</option>
        </select>
        <input type="file" onChange={fileSelectedHandler} style={{ marginTop: '10px' }} />
        {preview && <img src={preview} alt="Preview" style={imageStyle} />}
        <button type="submit" style={buttonStyle} onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)} onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}>Upload Image</button>
      </form>
    </div>
  );
};

export default ImageUploadForm;
