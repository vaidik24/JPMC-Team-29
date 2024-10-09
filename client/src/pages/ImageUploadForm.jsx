import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { current } from '@reduxjs/toolkit';

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');
  const [captureMode, setCaptureMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const sellerId = currentUser ? currentUser._id : null; // Adjust according to your state structure
  // console.log(currentUser._id) ;
  // console.log(currentUser)
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
      toast.error('Please choose an image file only!');
      event.target.value = null;
    }
  };

  const startCaptureHandler = () => {
    setCaptureMode(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
          toast.error('Failed to access camera!');
        });
    }
  };

  const captureImageHandler = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      setSelectedFile(blob);
      setPreview(URL.createObjectURL(blob));
      setCaptureMode(false); // Exit capture mode after capturing
    }, 'image/jpeg');
  };

  const fileUploadHandler = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file or capture an image first!');
      return;
    }
    if (!category) {
      toast.error('Please select a category!');
      return;
    }
    if (!sellerId) {
      toast.error('Seller ID is missing!');
      return;
    }

    if (isUploading) {
      toast.info('Image is already being uploaded. Please wait.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'Team29upload'); // Ensure this preset is configured for unsigned uploads

      const response = await fetch('https://api.cloudinary.com/v1_1/da1gzwvnr/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      const imageUrl = data.secure_url; // This is the URL of the uploaded image on Cloudinary

      // Now save `imageUrl`, `category`, and `seller_id` to your backend
      const uploadData = { category, image_url: imageUrl, seller_id: sellerId };
      console.log("upload data", uploadData)
      const saveResponse = await axios.post('http://localhost:3000/api/products/upload-image', uploadData);
      console.log(saveResponse.data);
      toast.success('Image uploaded successfully!');
      setSelectedFile(null);
      setPreview(null);
      setCategory('');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 mb-8 border border-gray-300 rounded-lg bg-gray-100 shadow-md md:flex">
      <ToastContainer />
      {/* Left side - Instructions */}
      <div className="flex-1 pr-4">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">English:</h3>
          <ul className="list-disc pl-4">
            <li>Capture the image with a white background.</li>
            <li>Ensure adequate lighting while capturing the image.</li>
            <li>Capture the entire article in the frame.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Hindi:</h3>
          <ul className="list-disc pl-4">
            <li>सफेद पृष्ठभूमि के साथ छवि को कैप्चर करें।</li>
            <li>छवि को कैप्चर करते समय उचित प्रकाश सुनिश्चित करें।</li>
            <li>फ्रेम में पूरे वस्त्रादि को कैप्चर करें।</li>
          </ul>
        </div>
      </div>
      {/* Right side - Image Capture */}
      <div className="flex-1 pl-4">
        <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
        <form onSubmit={fileUploadHandler} className="space-y-4">
          <div className="flex items-center justify-center gap-4 space-y-2">
            <label htmlFor="category" className="sr-only">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="">Select a category</option>
              <option value="Terracotta Ornaments & Home Décor">Terracotta Ornaments & Home Décor</option>
              <option value="Moonj Based Handicrafts">Moonj Based Handicrafts</option>
              <option value="Banana Fiber based ornaments & Home Décor">Banana Fiber based ornaments & Home Décor</option>
              <option value="Jute Bags & Allied Products">Jute Bags & Allied Products</option>
              <option value="Macrame Based Handicraft">Macrame Based Handicraft</option>
              <option value="Other">Others</option>
            </select>
            <input type="file" onChange={fileSelectedHandler} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center justify-center">
            {!captureMode && (
              <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 hover:bg-blue-400">Upload Image</button>
            )}
          </div>
          {preview && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Image Preview:</h3>
              <img src={preview} alt="Preview" className="max-w-full h-auto border border-gray-300 rounded-lg" />
            </div>
          )}
        </form>
        <div className="mt-4">
          {!captureMode ? (
            <button onClick={startCaptureHandler} className="w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:bg-green-600">Capture Image</button>
          ) : (
            <div>
              <video ref={videoRef} className="w-full h-auto border border-gray-300 rounded-lg mb-4" />
              <button onClick={captureImageHandler} className="w-full py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Capture Photo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadForm;
