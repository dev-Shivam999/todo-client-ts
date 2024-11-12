import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

const ImageUploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [p, pic] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };



    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            setUploadStatus('Please select an image.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);;

            const{data}:AxiosResponse<U>= await axios.post('http://localhost:3000/upload', formData, {
                // You can add any additional config options here
            });
            pic(data.url)

            setUploadStatus('Image uploaded successfully.');
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadStatus('Error uploading image.');
        }
    };

    return (
        <div>
            <h2>Image Upload</h2>
            <form action="/upload" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input type="file" name="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus} 
            <img src={p} alt="" />
            </p>}
        </div>
    );
};

export default ImageUploadForm;
