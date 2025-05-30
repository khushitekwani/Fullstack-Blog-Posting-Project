"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { createPost } from '../api/apiHandler'; 

function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'active',
    tag: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required('Title is required'),
    
    content: yup
      .string()
      .trim()
      .required('Content is required'),
    
    status: yup
      .string()
      .required('Status is required'),
    
    tag: yup
      .string()
      .trim()
      .required('Tag are required')
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error.inner) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateField = async (fieldName) => {
    try {
      await validationSchema.validateAt(fieldName, formData);
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const processedFormData = {
        ...formData,
        tag: formData.tag.trim() 
          ? formData.tag.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
          : []
      };
      
      const result = await createPost(processedFormData);
      
      if (result.code === "1") {
        Swal.fire({
          title: 'Success!',
          text: result.message || 'Post created successfully',
          icon: 'success',
          confirmButtonText: 'View All Posts'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/allPost');
          }
        });
        
        setFormData({
          title: '',
          content: '',
          status: 'active',
          tag: ''
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: result.message || 'Failed to create post. All the fields are required',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Something went wrong',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="Enter post title"
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48`}
            placeholder="Enter post content"
          ></textarea>
          {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs italic mt-1">{errors.status}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tag">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.tag ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="Enter tags separated by commas"
          />
          {errors.tag && <p className="text-red-500 text-xs italic mt-1">{errors.tag}</p>}
          <p className="text-gray-500 text-xs mt-1">Example: technology, programming, web development</p>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/allPost')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;