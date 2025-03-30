"use client"

import { useUploadThing } from "@/utils/uploadthing"
import { useState } from "react";

export default function TestUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: () => {
            alert("uploaded successfully!");
            setFiles([]);
        },
        onUploadError: () => {
            alert("error occurred while uploading");
        },
        onUploadBegin: (file) => {
            console.log("upload has begun for", file);
        },
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Image</h1>
                
                <div 
                    className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-colors
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <input 
                        id="file-input"
                        type="file" 
                        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="hidden" 
                        accept="image/*"
                    />
                    
                    {files.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Selected file:</p>
                            {files.map((file, i) => (
                                <p key={i} className="text-sm text-gray-600 truncate">{file.name}</p>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select</p>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={() => startUpload(files)}
                    disabled={files.length === 0}
                    className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors
                        ${files.length === 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {files.length === 0 ? 'Select an image to upload' : 'Upload Image'}
                </button>
            </div>
        </div>
    )
}
