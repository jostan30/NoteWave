import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext'; // Import from AuthContext
import { useToast } from '../component/Toast';

interface FormData {
    email: string;
    otp: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function SignInPage() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        otp: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showOTPField, setShowOTPField] = useState<boolean>(false);
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Use login from AuthContext
    const { showToast } = useToast();
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    const handleGetOTP = async () => {
        // Validate email before showing OTP field
        let newErrors: Record<string, string> = {};

        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/request-otp-in`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email }),
                });

                const data = await response.json();

                if (response.ok) {
                    showToast(data.message || "OTP sent to your email", 'success');
                    setShowOTPField(true);
                } else {
                    alert(data.message || "Failed to send OTP");
                }
            } catch (error) {
                showToast("Something went wrong. Please try again.", 'error');
            }
        }
    };

    const handleVerifyOTP = async () => {
        let newErrors: Record<string, string> = {};

        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.otp || formData.otp.length !== 6) {
            newErrors.otp = "Please enter a valid 6-digit OTP.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, otp: formData.otp }),
                });

                const data = await response.json();

                if (response.ok) {
                    showToast(data.message || "OTP verified successfully", 'success');
                    // Use AuthContext login function
                    login(data.token);
                    navigate("/dashboard");
                } else {
                    showToast(data.message || "OTP verification failed", 'error');
                }
            } catch (error) {
                showToast("Something went wrong. Please try again.", 'error');
            }
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/request-otp-in`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "OTP resent to your email");
                setFormData(prev => ({
                    ...prev,
                    otp: '' // Clear current OTP
                }));
            } else {
                showToast(data.message || "Failed to resend OTP" , 'error');
            }
        } catch (error) {
            showToast("Something went wrong. Please try again." , 'error');;
        }
    };

    const toggleShowOTP = () => {
        setShowOTP(!showOTP);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Desktop Layout */}
            <div className="lg:flex lg:min-h-screen">
                {/* Left Side - Form */}
                <div className="lg:w-2/5 lg:flex lg:flex-col lg:justify-start lg:p-[12px]">
                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-30 mx-6 mt-5">
                        <div className="flex items-center mb-6">
                            <div className="w-8 h-8 mr-2">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500">
                                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold">HD</span>
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="lg:hidden text-center px-6 py-8 mt-5">
                        <div className="flex items-center justify-center ">
                            <div className="w-8 h-8 mr-2">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500">
                                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold">HD</span>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-6  lg:px-0 lg:max-w-md mx-auto">
                        <div className="lg:hidden text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
                            <p className="text-gray-500 text-sm ">Please login to continue to your account</p>
                        </div>

                        <div className="hidden lg:block mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign in</h1>
                            <p className="text-gray-500 text">Please login to continue to your account</p>
                        </div>

                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { mb: 3 }, // spacing between fields
                                width: '400px', // optional: set fixed width for the form
                                maxWidth: '100%', // responsive
                                height: 'fit-content',
                            }}
                        >
                           
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                placeholder="jonas_kahnwald@gmail.com"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color:"#3b82f6",
                                        '&.Mui-focused': { color: '#3b82f6' },
                                    },
                                }}
                            />

                            {/* OTP Field - Only show when showOTPField is true */}
                            {showOTPField && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="OTP"
                                        name="otp"
                                        type={showOTP ? 'text' : 'password'}
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        error={!!errors.otp}
                                        helperText={errors.otp}
                                        variant="outlined"
                                        inputProps={{ maxLength: 6 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle OTP visibility"
                                                        onClick={toggleShowOTP}
                                                        edge="end"
                                                    >
                                                        {showOTP ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': { 
                                                borderRadius: '8px',
                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color:"#3b82f6",
                                                '&.Mui-focused': { color: '#3b82f6' },
                                            },
                                        }}
                                    />

                                    {/* Resend OTP Link - Only show when OTP field is visible */}
                                    <Box sx={{ textAlign: 'left', mb: 2 }}>
                                        <Button
                                            variant="text"
                                            onClick={handleResendOTP}
                                            sx={{
                                                color: '#3b82f6',
                                                textTransform: 'none',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                minWidth: 'auto',
                                                p: 0,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Resend OTP
                                        </Button>
                                    </Box>
                                </>
                            )}

                            {/* Keep me logged in checkbox - Only show when OTP field is visible */}
                            {showOTPField && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={keepLoggedIn}
                                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                            sx={{
                                                color: '#3b82f6',
                                                '&.Mui-checked': {
                                                    color: '#3b82f6',
                                                },
                                            }}
                                        />
                                    }
                                    label="Keep me logged in"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '14px',
                                            color: '#374151',
                                        },
                                    }}
                                />
                            )}

                        </Box>

                        {/* Send OTP / Sign In Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={showOTPField ? handleVerifyOTP : handleGetOTP}
                            sx={{
                                mt: 4,
                                backgroundColor: '#3b82f6',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                },
                                width: '400px',
                                maxWidth: '100%',
                            }}
                        >
                            {showOTPField ? 'Sign in' : 'Send OTP'}
                        </Button>

                        {/* Sign Up Link */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                                Need an account?{' '}
                            </Typography>
                            <Button
                                variant="text"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    color: '#3b82f6',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    minWidth: 'auto',
                                    p: 0,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Create One
                            </Button>
                        </Box>
                    </div>
                </div>

                {/* Right Side - Image (Desktop Only) */}
                <div className="hidden lg:block lg:w-3/5 relative overflow-hidden p-[10px]">
                    <img
                        src="/images/authPage.jpg"
                        alt="Abstract Right Side"
                        className="w-full h-full object-cover rounded-[24px]"
                    />
                </div>
            </div>
        </div>
    );
}