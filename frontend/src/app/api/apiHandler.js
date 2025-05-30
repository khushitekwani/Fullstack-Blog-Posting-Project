import { axiosClient } from "@/app/api/apiClient";

export async function signup(payload) {
  try {
    const res = await axiosClient.post(`/v1/user/signup`, payload);
    console.log("Signup response:", res); // Debugging line
    return res; 
  } catch (err) {
    console.error("Error in signupUser:", err);
    throw err;
  }
}


export async function login(data) {
  try {
    const response = await axiosClient.post('/v1/user/login', data);
    return response;
  } catch (err) {
    console.error('Error logging in:', err);
    throw new Error('Login failed');
  }
}


export async function allPost() {
  try {
    const res = await axiosClient.post(`/v1/user/all-post`, {});
    return res;
  } catch (err) {
    console.error("Error in allPost:", err);
    throw err;
  }
}


export async function deletePost(postId) {
  try {
    const res = await axiosClient.post(`/v1/user/delete-post`, postId);
    return res;
  } catch (err) {
    console.error("Error in deletePost:", err);
    throw err;
  }
}

export async function createPost(postData) {
  try {
    const res = await axiosClient.post(`/v1/user/create-post`, postData);
    return res;
  } catch (err) {
    console.error("Error in createPost:", err);
    throw err;
  }
}


export async function updatePost(postData) {
  try {
    const res = await axiosClient.post(`/v1/user/update-post`, postData);
    return res;
  } catch (err) {
    console.error("Error in updatePost:", err);
    throw err;
  }
}


export async function getPostById(postId) {
  try {
    const res = await axiosClient.post(`/v1/user/post-details`, { post_id: postId });
    return res;
  } catch (err) {
    console.error("Error in getPostById:", err);
    throw err;
  }
}