
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setThumbnail, setPromoVideo } from '@/store/slices/courseFormSlice';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const MediaForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { thumbnailUrl, promoVideoUrl } = useAppSelector(state => state.courseForm);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    setThumbnailUploading(true);
    
    try {
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // In a real application, you would upload the file to your server or cloud storage
      const response = await uploadFile(file, 'image');
      
      dispatch(setThumbnail({ url: previewUrl, file }));
      
      toast({
        title: "Thumbnail uploaded",
        description: "Your course thumbnail has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your thumbnail.",
        variant: "destructive"
      });
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please upload a video file (MP4, MOV, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    setVideoUploading(true);
    
    try {
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // In a real application, you would upload the file to your server or cloud storage
      const response = await uploadFile(file, 'video');
      
      dispatch(setPromoVideo({ url: previewUrl, file }));
      
      toast({
        title: "Video uploaded",
        description: "Your promo video has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video.",
        variant: "destructive"
      });
    } finally {
      setVideoUploading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    dispatch(setThumbnail({ url: '', file: null }));
  };

  const handleRemoveVideo = () => {
    dispatch(setPromoVideo({ url: '', file: null }));
  };

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg font-medium mb-2 block">Course Thumbnail</Label>
        <p className="text-gray-500 mb-4">Upload a high-quality image that represents your course. Recommended size: 1280x720 pixels.</p>
        
        {thumbnailUrl ? (
          <div className="relative">
            <img 
              src={thumbnailUrl} 
              alt="Course thumbnail" 
              className="w-full max-w-md rounded-md shadow-md"
            />
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="file-input-wrapper">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-stellar-accent">
              {thumbnailUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stellar-accent"></div>
                  <p className="mt-2 text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={thumbnailUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Promotional Video</Label>
        <p className="text-gray-500 mb-4">Upload a short promotional video to attract students to your course. Recommended length: 2-5 minutes.</p>
        
        {promoVideoUrl ? (
          <div className="relative">
            <video 
              src={promoVideoUrl} 
              controls 
              className="w-full max-w-md rounded-md shadow-md"
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="file-input-wrapper">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-stellar-accent">
              {videoUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stellar-accent"></div>
                  <p className="mt-2 text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M15 8h.01M12 20h9a3 3 0 003-3V8a3 3 0 00-3-3H9a3 3 0 00-3 3v9a3 3 0 003 3h1m12 0l9 9m0 0l9 9m-9-9l9-9m-9 9l-9 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500">MP4, MOV up to 1GB</p>
                </>
              )}
              <input 
                type="file" 
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={videoUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import the X icon at the top
import { X } from 'lucide-react';

export default MediaForm;
