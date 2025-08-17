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

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // FREE Option 1: Formspree (100 submissions/month free)
      const response = await fetch('https://formspree.io/f/mgvzbkpz', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email,
          _subject: `New message from ${formData.name}`
        })
      });

      if (response.ok) {
        alert('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      // FREE Fallback: Open email client
      const subject = encodeURIComponent(`Message from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      const mailtoLink = `mailto:vimaloffi1@gmail.com?subject=${subject}&body=${body}`;
      
      if (confirm('Direct email sending failed. Would you like to open your email client instead?')) {
        window.open(mailtoLink);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
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
                disabled={isSubmitting}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-0 text-gray-700 placeholder-gray-500 focus:outline-none resize-none transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 sm:py-4 bg-gray-200 text-gray-700 font-semibold hover:text-gray-800 focus:outline-none transition-all duration-200 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: '36px',
                boxShadow: '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff'
              }}
              onMouseDown={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #b3b3b3, inset -4px -4px 8px #ffffff';
                }
              }}
              onMouseUp={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff';
                }
              }}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;