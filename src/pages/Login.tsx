import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, PasswordInput, Logo } from '../components/ui';
import type { AuthFormData } from '../types';
import { toast } from 'sonner';
import { supabaseSignIn } from '../apis/SupabaseAuth';
import { checkUserProfileExists } from '../utils/profileCheck';
import { getUserIdByEmailApi } from '../apis/Users';
import { verifyOrganiserApi } from '../apis/Organisers';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  const loginHandler = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const errors: Partial<AuthFormData> = {};
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      if (!email) {
        errors.email = 'Email is required';
        toast.error('Email is required');
        setIsLoading(false);
        return;
      } else if (!gmailRegex.test(email)) {
        errors.email = 'Please enter a valid Gmail address';
        toast.error('Please enter a valid Gmail address');
        setIsLoading(false);
        return;
      }

      if (!password) {
        errors.password = 'Password is required';
        toast.error('Password is required');
        setIsLoading(false);
        return;
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        toast.error('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const loginResponse = await supabaseSignIn(email, password);

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      const getUserIdByEmailResponse = await getUserIdByEmailApi(email);
      if (getUserIdByEmailResponse.success) {
        localStorage.setItem('userId', getUserIdByEmailResponse.user.id);
        localStorage.setItem('userRole', getUserIdByEmailResponse.user.role);
        const organiserResponse = await verifyOrganiserApi();
        if (organiserResponse.success) {
          localStorage.setItem('organiserId', organiserResponse.data.id);
        }
      }
      else {
        throw new Error(getUserIdByEmailResponse.message);
      }
      toast.success('Login successful');
      // Store Supabase JWT token in localStorage
      console.log(loginResponse.data);
      if (loginResponse.data?.session?.access_token) {
        localStorage.setItem('token', loginResponse.data.session.access_token);
      } else {
        throw new Error(loginResponse.message);
      }

      const userRole = localStorage.getItem('userRole') || 'student';
      const organiserId = localStorage.getItem('organiserId');
      const hasProfile = await checkUserProfileExists();

      // Check if user is an organiser first
      if (organiserId) {
        navigate('/organiser');
      } else if (userRole === 'student') {
        if (hasProfile) {
          navigate('/student-home');
        } else {
          navigate('/student-profile');
        }
      } else {
        if (hasProfile) {
          navigate('/teacher-home');
        } else {
          navigate('/teacher-profile');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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
            <div className="w-full max-w-md mb-20">
              <div className="space-y-6">
                {/* Email Input */}
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={errors.email}
                  className="w-full"
                />

                {/* Password Input */}
                <PasswordInput
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                  className="w-full"
                />

                {/* Login Button */}
                <Button
                  type="button"
                  onClick={() => loginHandler(email, password)}
                  variant="primary"
                  className="w-full py-4 rounded-[32px] text-base font-bold"
                  style={{ backgroundColor: '#C2A46D' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Log In'
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="flex justify-between items-center text-xs mt-5">
                  <span className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#1E395D] hover:underline font-medium underline">
                      Sign Up
                    </Link>
                  </span>
                  <a href="#" className="text-[#1E395D] hover:underline font-medium underline">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
export default Login;
