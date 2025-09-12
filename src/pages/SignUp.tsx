import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, PasswordInput, Logo } from '../components/ui';
import type { AuthFormData } from '../types';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    role: 'student'
  });

  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AuthFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRoleChange = (role: 'student' | 'teacher') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
      <div className="overflow-hidden w-full max-w-5xl">
        <div className="flex h-[760px]">
          {/* Left Section - Branding */}
          <div className="w-[566px] bg-[#1E395D] flex flex-col items-center justify-end p-12 relative flex-shrink-0 rounded-[32px]">
            {/* Logo */}
            <div className="mb-10">
              <div className="bg-[#F7F7F7] p-6 rounded-[24px] shadow-lg">
                <Logo size="figma" />
              </div>
            </div>
            
            {/* Slogan */}
            <h2 className="text-[#F7F7F7] text-[21px] font-normal mb-12 text-center leading-normal font-[Poppins]">
              Quest for Leadership, Quest for Change
            </h2>
            
            {/* Quote */}
            <div className="flex items-center mt-20 mb-10">
              <h1 className="text-[#F7F7F7] text-[32px] font-normal text-center leading-normal">
                "Future Leaders Start Here"
              </h1>
            </div>
            
            {/* Copyright */}
            <div className='mt-16'>
              <p className="text-[#AAA] text-center font-[Poppins] text-[16px] font-normal leading-normal">
                © Iman Praveesh Hassan
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex flex-col items-center justify-center p-10 flex-1">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              className="w-full"
            />

            {/* Password Input */}
            <PasswordInput
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              className="w-full"
            />

            {/* Role Selection */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.role === 'student' ? 'role-select-active' : 'role-select'}
                onClick={() => handleRoleChange('student')}
                className="flex-1 py-3.5 rounded-[16px] text-sm font-medium text-black"
              >
                Student
              </Button>
              <Button
                type="button"
                variant={formData.role === 'teacher' ? 'role-select-active' : 'role-select'}
                onClick={() => handleRoleChange('teacher')}
                className="flex-1 py-3.5 rounded-[16px] text-sm font-medium border border-black"
              >
                Teacher
              </Button>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 rounded-[32px] text-base font-bold"
              style={{ backgroundColor: '#C2A46D' }}
            >
              Sign Up
            </Button>

            {/* Login Link */}
            <div className="flex justify-between items-center text-xs mt-5">
              <span className="text-gray-600">
                Have an account?{' '}
                <Link to="/login" className="text-[#1E395D] hover:underline font-medium underline">
                  Log In
                </Link>
              </span>
              <a href="#" className="text-[#1E395D] hover:underline font-medium underline">
                Read Terms and Conditions
              </a>
            </div>
          </form>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
