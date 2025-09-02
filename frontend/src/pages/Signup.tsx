import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../component/Toast';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        otp: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showOTPField, setShowOTPField] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const navigate = useNavigate();
    const {showToast} = useToast();
    
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

    // const validateForm = () => {
    //     let newErrors: Record<string, string> = {};

    //     // Name: at least 2 characters
    //     if (formData.name.trim().length < 2) {
    //         newErrors.name = "Name must be at least 2 characters.";
    //     }

    //     // DOB: must be a valid date
    //     if (!formData.dateOfBirth) {
    //         newErrors.dateOfBirth = "Date of birth is required.";
    //     }

    //     // Email: basic email format check
    //     if (!formData.email || !formData.email.includes('@')) {
    //         newErrors.email = "Please enter a valid email address.";
    //     }

    //     // OTP validation only when OTP field is shown
    //     if (showOTPField && !/^\d{6}$/.test(formData.otp)) {
    //         newErrors.otp = "OTP must be exactly 6 digits.";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const handleGetOTP = async() => {
        // Validate form before showing OTP field (exclude OTP validation)
        let newErrors: Record<string, string> = {};

        if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        if (!formData.dob) {
            newErrors.dob = "Date of birth is required.";
        }

        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);
        console.log(formData);

        if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:3000/api/auth/request-otp-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          showToast(data.message || "OTP sent to your email", 'success');
          setShowOTPField(true);
        } else {
          alert(data.message || "Failed to send OTP");
        }
      } catch (error) {
        showToast("Something went wrong. Please try again.",'error');
      }
    }
  };

  // ✅ Verify OTP → signup → navigate to dashboard
  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP." });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("OTP verified successfully" ,'success');

        // Save JWT for auth
        localStorage.setItem("token", data.token);
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        showToast(data.message || "OTP verification failed" ,'error');
      }
    } catch (error) {
      showToast("Something went wrong. Please try again." ,'error');
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign up</h1>
                            <p className="text-gray-500 text-sm ">Sign up to enjoy the feature of HD</p>
                        </div>

                        <div className="hidden lg:block mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign up</h1>
                            <p className="text-gray-500 text">Sign up to enjoy the feature of HD</p>
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
                                label="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />

                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleInputChange}
                                error={!!errors.dob}
                                helperText={errors.dob}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                           
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
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

                            {showOTPField && (
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
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                            )}
                        </Box>


                        {/* Get OTP / Sign Up Button */}

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
                                width: '400px', // optional: set fixed width for the form
                                maxWidth: '100%', // responsive
                            }}
                        >
                            {showOTPField ? 'Sign up' : 'Get OTP'}
                        </Button>

                        {/* Sign In Link */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                                Already have an account?{' '}
                            </Typography>
                            <Button
                                variant="text"
                                onClick={()=>navigate('/signin')}
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
                                Sign in
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