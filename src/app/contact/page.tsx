"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // This would normally be an API call to submit the form
      // For demo purposes, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#ffc107]">Contact</span> Us
          </h1>
          <div className="w-20 h-1 bg-[#ffc107] mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Have questions about Halal Finder? Want to suggest a restaurant or report an issue? We&apos;re here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-6">
              <Mail className="h-12 w-12 text-[#ffc107]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-400 mb-4">For general inquiries and support</p>
            <a href="mailto:alihaidar2950@gmail.com" className="text-[#ffc107] hover:underline">
              alihaidar2950@gmail.com
            </a>
          </div>

          <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-6">
              <Phone className="h-12 w-12 text-[#ffc107]" />
            </div>
          </div>

          <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
            <div className="flex justify-center mb-6">
              <MapPin className="h-12 w-12 text-[#ffc107]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-gray-400 mb-4">Our headquarters</p>
            <address className="text-[#ffc107] not-italic">
              123 Main Street<br />
              City, Country
            </address>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-[#ffc107]">Send</span> Message
            </h2>
            <div className="h-1 w-16 bg-[#ffc107] mb-8"></div>
            <p className="text-gray-300 mb-8">
              Fill out the form below and our team will get back to you as soon as possible. We value your feedback and inquiries.
            </p>
            
            <div className="flex items-start mb-8">
              <MessageSquare className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Restaurant Suggestions</h4>
                <p className="text-gray-400">
                  Know a great halal restaurant that should be on our platform? Let us know and we'll check it out!
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MessageSquare className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Verification Requests</h4>
                <p className="text-gray-400">
                  Restaurant owners can contact us to initiate the verification process for their establishment.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg">
            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#ffc107]/20 text-[#ffc107] mb-6">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                <p className="text-gray-300 mb-6">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-[#ffc107] hover:bg-[#e6b006] text-black px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#ffc107]"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#ffc107]"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#ffc107]"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="suggestion">Restaurant Suggestion</option>
                    <option value="verification">Verification Request</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#ffc107]"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                {error && (
                  <div className="text-red-500 bg-red-950 border border-red-900 p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center bg-[#ffc107] hover:bg-[#e6b006] text-black px-6 py-3 rounded-md font-medium transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-black rounded-full"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 