"use client";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { allPost, deletePost } from '../api/apiHandler'; 

function ListBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await allPost();
      
      if (result.code === "1") {
        setPosts(result.data && result.data.posts ? result.data.posts : []);
      } else {
        throw new Error(result.message || "Failed to load posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        performDelete(id);
      }
    });
  };

  const performDelete = async (id) => {
    try {
      setLoading(true);
      console.log("Deleting post with ID:", id);
      const data = { post_id: id };
      const result = await deletePost(data);
      
      if (result.code === "1") {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: result.message || 'Post has been deleted successfully.',
          icon: "success",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        throw new Error(result.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Deleting Post',
        text: error.message || "Something went wrong while deleting the post"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (id) => {
    localStorage.setItem('editPostId', id);
    router.push(`/updatePost`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold mb-4">Blog Listing</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No posts available. Create your first post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href="/createPost" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-4 inline-block">
        <button>Create New Post</button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Blog Listing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-5">
              <h2 className="text-xl font-bold truncate mb-2">{post.title}</h2>
              <div className="h-20 overflow-hidden mb-4">
                <p className="text-gray-700">{post.content}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs ${post.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {post.status}
                </span>
                {/* Display tags as an array properly */}
                {post.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
                {/* Fallback for single tag as string */}
                {post.tag && typeof post.tag === 'string' && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {post.tag}
                  </span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => handleEdit(post.id)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListBlog;