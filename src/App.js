import React, { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  FileText, Download, User, Briefcase, GraduationCap, Code, Award, 
  ImageIcon, X, Plus, Trash2 
} from 'lucide-react';

const countryOptions = [
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Iraq', label: 'Iraq' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Lebanon', label: 'Lebanon' },
  { value: 'Libya', label: 'Libya' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Sudan', label: 'Sudan' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Tunisia', label: 'Tunisia' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'United States', label: 'United States' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'India', label: 'India' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Thailand', label: 'Thailand' }
];

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: null
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  });
 
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const resumeRef = useRef(null);

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, {
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }]
    });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, { id: Date.now(), category: '', items: '' }]
    });
  };

  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        url: ''
      }]
    });
  };

  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, { id: Date.now(), name: '', proficiency: '' }]
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData({
          ...resumeData,
          personalInfo: { ...resumeData.personalInfo, photo: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, photo: null }
    });
  };

  const generatePDF = async () => {
    const element = document.getElementById('resume');
    const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ATS Resume Builder</h1>
                <p className="text-sm text-gray-600">Professional & ATS-Optimized</p>
              </div>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'personal', label: 'Personal', icon: User },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'skills', label: 'Skills', icon: Code },
                  { id: 'other', label: 'Other', icon: Award }
                ].map(tab => {
                  const Icon = tab.icon;
                    return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                    );
                  })}
                  </div>
                </div>

                {/* Input Forms */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                  {activeTab === 'personal' && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Personal Information</h2>

                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                          type="text"
                          placeholder="Professional Title (e.g., Software Developer)"
                          value={resumeData.personalInfo.title}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="email"
                            placeholder="Email *"
                            value={resumeData.personalInfo.email}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />

                          <input
                            type="tel"
                            placeholder="Phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <Select
                          options={countryOptions}
                          value={countryOptions.find(option => option.value === resumeData.personalInfo.country)}
                          onChange={(selected) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, country: selected.value }
                            })
                          }
                        />

                        <input
                          type="url"
                          placeholder="LinkedIn URL"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                          type="url"
                          placeholder="Website/Portfolio URL"
                          value={resumeData.personalInfo.website}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, website: e.target.value }
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <div>
                          <button
                            onClick={() => setShowPhotoInput(!showPhotoInput)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <ImageIcon className="w-5 h-5" />
                            <span>{showPhotoInput ? 'Hide' : 'Add'} Professional Photo (Optional)</span>
                          </button>

                          {showPhotoInput && (
                            <div className="mt-3">
                              {resumeData.personalInfo.photo ? (
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={resumeData.personalInfo.photo}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                                  />
                                  <button
                                    onClick={removePhoto}
                                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                        <textarea
                          value={resumeData.summary}
                          onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                          placeholder="Brief overview of your professional background, key skills, and career objectives..."
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                        <button
                          onClick={addExperience}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>

                      {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">Position {index + 1}</h3>
                            <button
                              onClick={() =>
                                setResumeData({
                                  ...resumeData,
                                  experience: resumeData.experience.filter((e) => e.id !== exp.id)
                                })
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Job Title *"
                            value={exp.title}
                            onChange={(e) => {
                              const updated = resumeData.experience.map((item) =>
                                item.id === exp.id ? { ...item, title: e.target.value } : item
                              );
                              setResumeData({ ...resumeData, experience: updated });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                              type="text"
                              placeholder="Company Name *"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                );
                                setResumeData({ ...resumeData, experience: updated });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />

                              <input
                              type="text"
                              placeholder="Location"
                              value={exp.location}
                              onChange={(e) => {
                            const updated = resumeData.experience.map(item =>
                            item.id === exp.id ? { ...item, location: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Start Date (MM/YYYY)"
                            value={exp.startDate}
                            onChange={(e) => {
                            const updated = resumeData.experience.map(item =>
                              item.id === exp.id ? { ...item, startDate: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="End Date (MM/YYYY)"
                            value={exp.endDate}
                            onChange={(e) => {
                            const updated = resumeData.experience.map(item =>
                              item.id === exp.id ? { ...item, endDate: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, experience: updated });
                            }}
                            disabled={exp.current}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                          </div>
                          
                          <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                            const updated = resumeData.experience.map(item =>
                              item.id === exp.id ? { ...item, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' } : item
                            );
                            setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Currently working here</span>
                          </label>
                          
                          <textarea
                          value={exp.description}
                        onChange={(e) => {
                          const updated = resumeData.experience.map(item =>
                            item.id === exp.id ? { ...item, description: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                        placeholder="Key responsibilities and achievements (use bullet points with • or -)"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  
                  {resumeData.experience.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No experience added yet. Click "Add" to start.</p>
                  )}
                </div>
              )}

              {/* Education */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-900">Education</h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">Education {index + 1}</h3>
                        <button
                          onClick={() => setResumeData({
                            ...resumeData,
                            education: resumeData.education.filter(e => e.id !== edu.id)
                          })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Degree/Diploma *"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = resumeData.education.map(item =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <input
                        type="text"
                        placeholder="Institution Name *"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = resumeData.education.map(item =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Location"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = resumeData.education.map(item =>
                              item.id === edu.id ? { ...item, location: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        
                        <input
                          type="text"
                          placeholder="Graduation Date"
                          value={edu.graduationDate}
                          onChange={(e) => {
                            const updated = resumeData.education.map(item =>
                              item.id === edu.id ? { ...item, graduationDate: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <input
                        type="text"
                        placeholder="GPA (Optional)"
                        value={edu.gpa}
                        onChange={(e) => {
                          const updated = resumeData.education.map(item =>
                            item.id === edu.id ? { ...item, gpa: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  
                  {resumeData.education.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No education added yet. Click "Add" to start.</p>
                  )}
                </div>
              )}

              {/* Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                    <button
                      onClick={addSkill}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                  
                  {resumeData.skills.map((skill, index) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">Skill Category {index + 1}</h3>
                        <button
                          onClick={() => setResumeData({
                            ...resumeData,
                            skills: resumeData.skills.filter(s => s.id !== skill.id)
                          })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Category (e.g., Programming Languages, Tools)"
                        value={skill.category}
                        onChange={(e) => {
                          const updated = resumeData.skills.map(item =>
                            item.id === skill.id ? { ...item, category: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, skills: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <input
                        type="text"
                        placeholder="Skills (comma separated: Python, Java, React)"
                        value={skill.items}
                        onChange={(e) => {
                          const updated = resumeData.skills.map(item =>
                            item.id === skill.id ? { ...item, items: e.target.value } : item
                          );
                          setResumeData({ ...resumeData, skills: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  
                  {resumeData.skills.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No skills added yet. Click "Add Category" to start.</p>
                  )}
                </div>
              )}

              {/* Other (Certifications & Languages) */}
              {activeTab === 'other' && (
                <div className="space-y-6">
                  {/* Certifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                      <button
                        onClick={addCertification}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    
                    {resumeData.certifications.map((cert, index) => (
                      <div key={cert.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">Certification {index + 1}</h3>
                          <button
                            onClick={() => setResumeData({
                              ...resumeData,
                              certifications: resumeData.certifications.filter(c => c.id !== cert.id)
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Certification Name *"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = resumeData.certifications.map(item =>
                              item.id === cert.id ? { ...item, name: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Issuing Organization"
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = resumeData.certifications.map(item =>
                                item.id === cert.id ? { ...item, issuer: e.target.value } : item
                              );
                              setResumeData({ ...resumeData, certifications: updated });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Date Obtained"
                            value={cert.date}
                            onChange={(e) => {
                              const updated = resumeData.certifications.map(item =>
                                item.id === cert.id ? { ...item, date: e.target.value } : item
                              );
                              setResumeData({ ...resumeData, certifications: updated });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Credential ID (Optional)"
                          value={cert.credentialId}
                          onChange={(e) => {
                            const updated = resumeData.certifications.map(item =>
                              item.id === cert.id ? { ...item, credentialId: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        
                        <input
                          type="url"
                          placeholder="Certificate URL (Optional)"
                          value={cert.url}
                          onChange={(e) => {
                            const updated = resumeData.certifications.map(item =>
                              item.id === cert.id ? { ...item, url: e.target.value } : item
                            );
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    
                    {resumeData.certifications.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No certifications added yet.</p>
                    )}
                  </div>

                  {/* Languages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h2 className="text-xl font-bold text-gray-900">Languages</h2>
                      <button
                        onClick={addLanguage}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    
                    {resumeData.languages.map((lang, index) => (
                      <div key={lang.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">Language {index + 1}</h3>
                          <button
                            onClick={() => setResumeData({
                              ...resumeData,
                              languages: resumeData.languages.filter(l => l.id !== lang.id)
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Language"
                            value={lang.name}
                            onChange={(e) => {
                              const updated = resumeData.languages.map(item =>
                                item.id === lang.id ? { ...item, name: e.target.value } : item
                              );
                              setResumeData({ ...resumeData, languages: updated });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <select
                            value={lang.proficiency}
                            onChange={(e) => {
                              const updated = resumeData.languages.map(item =>
                                item.id === lang.id ? { ...item, proficiency: e.target.value } : item
                              );
                              setResumeData({ ...resumeData, languages: updated });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Level</option>
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    
                    {resumeData.languages.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No languages added yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
                <h2 className="text-white font-semibold">Live Preview</h2>
              </div>
              
              <div className="p-8 overflow-auto max-h-[800px]">
                <div ref={resumeRef} className="bg-white" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: '1.3' }}>
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a1a' }}>
                          {resumeData.personalInfo.fullName || 'Your Name'}
                        </h1>
                        {resumeData.personalInfo.title && (
                          <p style={{ fontSize: '12pt', color: '#4a4a4a', marginBottom: '8px' }}>
                            {resumeData.personalInfo.title}
                          </p>
                        )}
                        
                        <div style={{ fontSize: '10pt', color: '#4a4a4a', marginTop: '6px' }}>
                          {resumeData.personalInfo.email && (
                            <div>{resumeData.personalInfo.email}</div>
                          )}
                          {resumeData.personalInfo.phone && (
                            <div>{resumeData.personalInfo.phone}</div>
                          )}
                          {resumeData.personalInfo.location && (
                            <div>{resumeData.personalInfo.location}</div>
                          )}
                          {resumeData.personalInfo.linkedin && (
                            <div>
                              <a href={resumeData.personalInfo.linkedin} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                {resumeData.personalInfo.linkedin}
                              </a>
                            </div>
                          )}
                          {resumeData.personalInfo.website && (
                            <div>
                              <a href={resumeData.personalInfo.website} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                {resumeData.personalInfo.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {resumeData.personalInfo.photo && (
                        <img
                          src={resumeData.personalInfo.photo}
                          alt="Profile"
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '4px',
                            objectFit: 'cover',
                            marginLeft: '16px'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  {resumeData.summary && (
                    <div className="mb-4">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p style={{ textAlign: 'justify', color: '#2a2a2a' }}>
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {resumeData.experience.length > 0 && (
                    <div className="mb-4">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        WORK EXPERIENCE
                      </h2>
                      {resumeData.experience.map((exp, index) => (
                        <div key={exp.id} style={{ marginBottom: index < resumeData.experience.length - 1 ? '12px' : '0' }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 style={{ fontSize: '11.5pt', fontWeight: 'bold', color: '#1a1a1a' }}>
                                {exp.title || 'Job Title'}
                              </h3>
                              <p style={{ fontSize: '10.5pt', fontStyle: 'italic', color: '#4a4a4a', marginTop: '2px' }}>
                                {exp.company || 'Company Name'}{exp.location && ` | ${exp.location}`}
                              </p>
                            </div>
                            <div style={{ fontSize: '10pt', color: '#4a4a4a', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                              {exp.startDate || 'MM/YYYY'} - {exp.current ? 'Present' : (exp.endDate || 'MM/YYYY')}
                            </div>
                          </div>
                          {exp.description && (
                            <div style={{ marginTop: '6px', color: '#2a2a2a', fontSize: '10.5pt' }}>
                              {exp.description.split('\n').map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) return null;
                                const startsWithBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
                                const content = startsWithBullet ? trimmed.substring(1).trim() : trimmed;
                                return (
                                  <div key={i} style={{ marginLeft: startsWithBullet ? '0' : '0', marginBottom: '3px' }}>
                                    {startsWithBullet && '• '}{content}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <div className="mb-4">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        EDUCATION
                      </h2>
                      {resumeData.education.map((edu, index) => (
                        <div key={edu.id} style={{ marginBottom: index < resumeData.education.length - 1 ? '10px' : '0' }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 style={{ fontSize: '11.5pt', fontWeight: 'bold', color: '#1a1a1a' }}>
                                {edu.degree || 'Degree/Diploma'}
                              </h3>
                              <p style={{ fontSize: '10.5pt', fontStyle: 'italic', color: '#4a4a4a', marginTop: '2px' }}>
                                {edu.institution || 'Institution Name'}{edu.location && ` | ${edu.location}`}
                              </p>
                              {edu.gpa && (
                                <p style={{ fontSize: '10pt', color: '#4a4a4a', marginTop: '2px' }}>
                                  GPA: {edu.gpa}
                                </p>
                              )}
                            </div>
                            {edu.graduationDate && (
                              <div style={{ fontSize: '10pt', color: '#4a4a4a', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                {edu.graduationDate}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="mb-4">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        SKILLS
                      </h2>
                      {resumeData.skills.map((skill, index) => (
                        <div key={skill.id} style={{ marginBottom: '6px' }}>
                          {skill.category && (
                            <span style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '10.5pt' }}>
                              {skill.category}:{' '}
                            </span>
                          )}
                          <span style={{ color: '#2a2a2a', fontSize: '10.5pt' }}>
                            {skill.items}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications.length > 0 && (
                    <div className="mb-4">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        CERTIFICATIONS
                      </h2>
                      {resumeData.certifications.map((cert, index) => (
                        <div key={cert.id} style={{ marginBottom: '6px' }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '10.5pt' }}>
                                {cert.name || 'Certification Name'}
                              </span>
                              {cert.issuer && (
                                <span style={{ color: '#4a4a4a', fontSize: '10pt', fontStyle: 'italic' }}>
                                  {' '}- {cert.issuer}
                                </span>
                              )}
                              {cert.credentialId && (
                                <div style={{ fontSize: '9.5pt', color: '#4a4a4a', marginTop: '2px' }}>
                                  Credential ID: {cert.credentialId}
                                </div>
                              )}
                              {cert.url && (
                                <div style={{ fontSize: '9.5pt', marginTop: '2px' }}>
                                  <a href={cert.url} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                    View Certificate
                                  </a>
                                </div>
                              )}
                            </div>
                            {cert.date && (
                              <div style={{ fontSize: '10pt', color: '#4a4a4a', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                {cert.date}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Languages */}
                  {resumeData.languages.length > 0 && (
                    <div className="mb-2">
                      <h2 style={{ fontSize: '13pt', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2px', marginBottom: '8px', color: '#1a1a1a' }}>
                        LANGUAGES
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {resumeData.languages.map((lang) => (
                          <div key={lang.id} style={{ fontSize: '10.5pt', color: '#2a2a2a' }}>
                            <span style={{ fontWeight: 'bold' }}>{lang.name || 'Language'}</span>
                            {lang.proficiency && ` (${lang.proficiency})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load external libraries */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </div>
  );
};

export default ResumeBuilder;