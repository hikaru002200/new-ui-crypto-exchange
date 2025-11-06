import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Shield, 
  Mail, 
  Lock, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  Award
} from 'lucide-react';

export function AccountCreation() {
  const { setUser, setAuthenticated } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreedToTerms: false,
    confirmedEligibility: false,
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const restrictedCountries = ['JP', 'US', 'CN', 'KP', 'IR', 'SY'];
  
  const countries = [
    { code: 'CH', name: 'Switzerland' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'AT', name: 'Austria' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IE', name: 'Ireland' },
    { code: 'ES', name: 'Spain' },
    { code: 'PT', name: 'Portugal' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'JP', name: 'Japan' },
    { code: 'US', name: 'United States' },
    { code: 'CN', name: 'China' }
  ];

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = 'Password must be stronger (8+ chars, uppercase, lowercase, number)';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.country) {
      newErrors.country = 'Please select your country of residence';
    } else if (restrictedCountries.includes(formData.country)) {
      newErrors.country = 'Sorry, we cannot provide services to residents of this country';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service';
    }
    
    if (!formData.confirmedEligibility) {
      newErrors.confirmedEligibility = 'You must confirm your eligibility';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3) {
      // Simulate email verification
      if (formData.verificationCode === '123456') {
        setStep(4);
      } else {
        setErrors({ verificationCode: 'Invalid verification code. Try 123456 for demo.' });
      }
    } else if (step === 4) {
      // Complete registration
      const user = {
        id: Date.now().toString(),
        email: formData.email,
        isKycVerified: false,
        is2faEnabled: false,
        country: formData.country,
        createdAt: new Date().toISOString()
      };
      setUser(user);
      setAuthenticated(true);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join the Swiss-licensed crypto exchange</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600 text-sm">Enter your email and create a secure password</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Residency Check */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Residency Verification</h2>
                <p className="text-gray-600 text-sm">We need to verify your country of residence for compliance</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Residence
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <div className="flex items-center space-x-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{errors.country}</p>
                  </div>
                )}
              </div>

              {/* Compliance Checkboxes */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmedEligibility}
                    onChange={(e) => setFormData({ ...formData, confirmedEligibility: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I am not a resident of Japan, United States, or any other restricted jurisdiction
                  </span>
                </label>
              </div>

              {errors.agreedToTerms && (
                <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>
              )}
              {errors.confirmedEligibility && (
                <p className="text-red-500 text-sm">{errors.confirmedEligibility}</p>
              )}
            </div>
          )}

          {/* Step 3: Email Verification */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to<br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest ${
                    errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {errors.verificationCode && (
                  <p className="text-red-500 text-sm mt-2">{errors.verificationCode}</p>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <p>Didn't receive the code?</p>
                <button className="text-blue-600 hover:underline mt-1">
                  Resend verification code
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-xs">
                  💡 Demo tip: Use code <strong>123456</strong> to continue
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Welcome & Next Steps */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to SwissCrypto!</h2>
                <p className="text-gray-600 text-sm">
                  Your account has been created successfully
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Swiss DLT Licensed</h3>
                <p className="text-sm text-gray-600">
                  Your account is protected by Swiss banking-grade security and regulatory compliance
                </p>
              </div>

              <div className="space-y-3 text-left">
                <h4 className="font-semibold text-gray-900">Next Steps:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-sm text-gray-700">Complete KYC verification (required for trading)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-sm text-gray-700">Enable 2FA for enhanced security (recommended)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-sm text-gray-700">Start trading with our dual-mode interface</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleNext}
            disabled={
              (step === 2 && restrictedCountries.includes(formData.country)) ||
              (step === 1 && (!formData.email || !formData.password || !formData.confirmPassword)) ||
              (step === 2 && (!formData.country || !formData.agreedToTerms || !formData.confirmedEligibility)) ||
              (step === 3 && !formData.verificationCode)
            }
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <span>
              {step === 1 && 'Continue'}
              {step === 2 && 'Verify Email'}
              {step === 3 && 'Verify Code'}
              {step === 4 && 'Enter SwissCrypto'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Back Button */}
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              Back
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Protected by Swiss banking-grade security</p>
          <p className="mt-1">Licensed under Swiss DLT regulations</p>
        </div>
      </div>
    </div>
  );
}