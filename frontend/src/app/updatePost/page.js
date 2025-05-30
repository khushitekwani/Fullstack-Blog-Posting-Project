"use client";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost } from '../api/apiHandler'; 

function EditPost() {
  const [post, setPost] = useState({
    id: '',
    title: '',
    content: '',
    status: 'active',
    tag: ''
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const postId = localStorage.getItem('editPostId');
    if (!postId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No post selected for editing'
      });
      router.push('/');
      return;
    }
    
    fetchPostDetails(postId);
  }, [router]);
  
  const fetchPostDetails = async (postId) => {
    try {
      setLoading(true);
      const result = await getPostById(postId);
      
      if (result.code === "1" && result.data) {
        const postData = result.data;
        setPost({
          id: postId, 
          title: postData.title || '',
          content: postData.content || '',
          status: postData.status || 'active',
          tag: postData.tag || ''
        });
      } else {
        throw new Error(result.message || 'Failed to load post details');
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: error.message || 'Failed to fetch post details'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requestBody = {
        post_id: post.id,
        title: post.title,
        content: post.content,
        status: post.status,
        tag: post.tag
      };
      
      console.log("Updating post with data:", requestBody);
      
      const result = await updatePost(requestBody);
      
      if (result.code === "1") {
        Swal.fire({
          title: 'Updated!',
          text: result.message || 'Post has been updated successfully.',
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          router.push('/allPost');
        });
      } else {
        throw new Error(result.message || 'Failed to update post');
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.message || 'Failed to update post'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading post details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={post.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={post.tag}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/allPost')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors duration-200"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;