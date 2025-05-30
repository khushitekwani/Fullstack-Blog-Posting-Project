"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { login } from '../api/apiHandler';

function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    login_type: 'simple', // added login_type
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

    try {
      setLoading(true);
      const result = await login(form);

      if (result.code == '1') { 
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text:  result.message || "You have logged in successfully!",
        });
        // router.push("/dashboard");
      } else {
        throw new Error(result.message|| "Login failed");
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message || "Something went wrong",
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
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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

        {/* Login Type */}
        <select
          name="login_type"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded"
          value={form.login_type}
          onChange={handleChange}
          required
        >
          <option value="simple">Simple</option>
          <option value="google">Google</option>
          <option value="facebook">Facebook</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
