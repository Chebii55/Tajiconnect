import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  X, 
  User,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Twitter
} from 'lucide-react';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { trainer, setTrainer } = useTrainer();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    expertise: [''],
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    phone: '',
    title: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.name || '',
        email: trainer.email || '',
        bio: trainer.bio || '',
        expertise: trainer.expertise && trainer.expertise.length > 0 ? trainer.expertise : [''],
        location: '',
        website: '',
        linkedin: '',
        twitter: '',
        phone: '',
        title: ''
      });
    }
  }, [trainer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }));
    setHasChanges(true);
  };

  const updateExpertise = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.map((skill, i) => i === index ? value : skill)
    }));
    setHasChanges(true);
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (trainer) {
      const updatedTrainer = {
        ...trainer,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        expertise: formData.expertise.filter(skill => skill.trim() !== '')
      };
      setTrainer(updatedTrainer);
      setHasChanges(false);
      navigate('/trainer/profile');
    }
  };

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <button
            onClick={() => navigate('/trainer/dashboard')}
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/profile')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Update your profile information and settings
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-light to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {formData.name.charAt(0) || 'T'}
                </div>
                
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG up to 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">About You</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Tell learners about your background, experience, and teaching philosophy..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas of Expertise</h3>
                <button
                  onClick={addExpertise}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.expertise.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateExpertise(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                    {formData.expertise.length > 1 && (
                      <button
                        onClick={() => removeExpertise(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Links</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;