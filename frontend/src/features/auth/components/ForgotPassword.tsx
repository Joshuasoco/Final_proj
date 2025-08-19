import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Send} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForgotPassword } from '../hooks/useForgotPassword';

interface ForgotPasswordProps {
  onSuccess: (email: string) => void;
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSuccess, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const { buttonState, error, forgotPassword, resetState } = useForgotPassword();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (buttonState === 'success') {
      const timer = setTimeout(() => {
        onSuccess(email);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [buttonState, email, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    const result = await forgotPassword({ email });
    if (!result.success) {
      setTimeout(() => resetState(), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) resetState();
  };

  const getButtonText = () => {
    switch (buttonState) {
      case 'loading':
        return 'Sending...';
      case 'success':
        return 'Sent Successfully';
      default:
        return isValidEmail ? 'Reset Password' : 'Reset Password';
    }
  };

  const getButtonIcon = () => {
    switch (buttonState) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Send className="w-2 h-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-2 bg-black rounded-full flex items-center justify-center"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
          Enter your email address and we'll send you a code to reset your password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`pl-10 pr-4 py-3 transition-all duration-200 ${
                    email && !isValidEmail 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : isValidEmail 
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  disabled={buttonState === 'loading' || buttonState === 'success'}
                />
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  email && !isValidEmail 
                    ? 'text-red-400' 
                    : isValidEmail 
                      ? 'text-green-400'
                      : 'text-gray-400'
                }`} />
                
                <AnimatePresence>
                  {isValidEmail && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {email && !isValidEmail && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600"
                  >
                    Please enter a valid email address
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileTap={{ scale: 0.98 }}
                    >
              <Button
                type="submit"
                disabled={!isValidEmail || buttonState === 'loading' || buttonState === 'success'}
                className={`w-full py-4 text-base font-medium transition-all duration-300 ${
                  !isValidEmail
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : buttonState === 'success'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : buttonState === 'loading'
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-black text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {getButtonIcon()}
                  {getButtonText()}
                </span>
              </Button>
            </motion.div>
          </CardContent>
        </form>
        <CardFooter>
          <div className="w-full text-center text-sm text-gray-600">
            Remember your password?{' '}
            <motion.button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none cursor-pointer"
              disabled={buttonState === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};