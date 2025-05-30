"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { signup } from '../api/apiHandler';

function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    login_type: 'simple',
    address: '',
    latitude: '',
    longitude: '',
    profile_image: '',
    device_type: 'android',
    os_version: '',
    app_version: '1.0.0',
    time_zone: 'America/New_York',
    mobile: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match',
      });
    }

    try {
      setLoading(true);
      const result = await signup(form);
        console.log("Signup result:", result);
      if (result.code == '1') {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: result.message || "You have signed up successfully!",
        });
        router.push("/login");
      } else {
        throw new Error(result.message|| "Signup failed");
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text:"Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Name */}
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Address */}
        <input
          name="address"
          type="text"
          placeholder="Address"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.address}
          onChange={handleChange}
          required
        />

        {/* Latitude */}
        <input
          name="latitude"
          type="text"
          placeholder="Latitude"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.latitude}
          onChange={handleChange}
          required
        />

        {/* Longitude */}
        <input
          name="longitude"
          type="text"
          placeholder="Longitude"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.longitude}
          onChange={handleChange}
          required
        />

        {/* Profile Image */}
        <input
          name="profile_image"
          type="text"
          placeholder="Profile Image (URL)"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.profile_image}
          onChange={handleChange}
        />

        {/* Device Type */}
        <input
          name="device_type"
          type="text"
          placeholder="Device Type"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.device_type}
          onChange={handleChange}
          required
        />

        {/* OS Version */}
        <input
          name="os_version"
          type="text"
          placeholder="OS Version"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.os_version}
          onChange={handleChange}
          required
        />

        {/* App Version */}
        <input
          name="app_version"
          type="text"
          placeholder="App Version"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.app_version}
          onChange={handleChange}
          required
        />

        {/* Time Zone */}
        <input
          name="time_zone"
          type="text"
          placeholder="Time Zone"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={form.time_zone}
          onChange={handleChange}
          required
        />

        {/* Mobile */}
        <input
          name="mobile"
          type="text"
          placeholder="Mobile Number"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded"
          value={form.mobile}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
