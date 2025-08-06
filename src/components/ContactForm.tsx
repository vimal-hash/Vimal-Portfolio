import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FocusState {
  name: boolean;
  email: boolean;
  message: boolean;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [focusState, setFocusState] = useState<FocusState>({
    name: false,
    email: false,
    message: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName: keyof FocusState) => {
    setFocusState(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleBlur = (fieldName: keyof FocusState) => {
    setFocusState(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="space-y-6">
          {/* Form Container */}
          <div 
            className="p-6 sm:p-8"
            style={{
              borderRadius: '70px',
              background: 'linear-gradient(145deg, #cacaca, #f0f0f0)',
              boxShadow: '17px 17px 27px #8d8d8d, -17px -17px 27px #ffffff'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 text-center mb-6 sm:mb-8">Contact Me</h2>
            
            {/* Name Field */}
            <div className="mb-4 sm:mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
                Name
              </label>
               <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => handleFocus('name')}
                onBlur={() => handleBlur('name')}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                style={{
                  borderRadius: '24px',
                  boxShadow: 'inset 8px 8px 12px #b3b3b3, inset -8px -8px 12px #ffffff'
                }}
                placeholder={focusState.name ? "" : "Enter your name"}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4 sm:mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                style={{
                  borderRadius: '24px',
                  boxShadow: 'inset 8px 8px 12px #b3b3b3, inset -8px -8px 12px #ffffff'
                }}
                placeholder={focusState.email ? "" : "Enter your email"}
              />
            </div>

            {/* Message Field */}
            <div className="mb-6 sm:mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => handleFocus('message')}
                onBlur={() => handleBlur('message')}
                required
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none resize-none transition-all duration-200 text-sm sm:text-base"
                style={{
                  borderRadius: '24px',
                  boxShadow: 'inset 8px 8px 12px #b3b3b3, inset -8px -8px 12px #ffffff'
                }}
                placeholder={focusState.message ? "" : "Enter your message"}
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Form submitted:', formData);
                alert('Form submitted successfully!');
                setFormData({ name: '', email: '', message: '' });
              }}
              className="w-full py-3 sm:py-4 bg-gray-200 text-gray-700 font-semibold hover:text-gray-800 focus:outline-none transition-all duration-200 active:scale-95 text-sm sm:text-base"
              style={{
                borderRadius: '36px',
                boxShadow: '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #b3b3b3, inset -4px -4px 8px #ffffff';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff';
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;