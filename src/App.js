import React, { useState } from 'react';
import { Download, Plus, Trash2, Image as ImageIcon, X, FileText, Moon, Sun, Palette } from 'lucide-react';
import { jsPDF } from 'jspdf';


const App = () => {
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
    projects: [],
    certifications: [],
    languages: []
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [darkMode, setDarkMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorPresets = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Indigo', value: '#4f46e5' }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const addItem = (type) => {
    const newItem = { id: Date.now() };
    
    switch(type) {
      case 'experience':
        Object.assign(newItem, {
          title: '', company: '', location: '',
          startDate: '', endDate: '', current: false, description: ''
        });
        break;
      case 'education':
        Object.assign(newItem, {
          degree: '', institution: '', location: '',
          graduationDate: '', gpa: '', courses: ''
        });
        break;
      case 'skills':
        Object.assign(newItem, { category: '', items: '' });
        break;
      case 'projects':
        Object.assign(newItem, {
          name: '', description: '', technologies: '', url: ''
        });
        break;
      case 'certifications':
        Object.assign(newItem, {
          name: '', issuer: '', date: '', credentialId: '', url: ''
        });
        break;
      case 'languages':
        Object.assign(newItem, { name: '', proficiency: '' });
        break;
      default:
        break;
    }
    
    setResumeData({
      ...resumeData,
      [type]: [...resumeData[type], newItem]
    });
  };

  const removeItem = (type, id) => {
    setResumeData({
      ...resumeData,
      [type]: resumeData[type].filter(item => item.id !== id)
    });
  };

  const updateItem = (type, id, field, value) => {
    setResumeData({
      ...resumeData,
      [type]: resumeData[type].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 37, g: 99, b: 235 };
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr || dateStr === 'Present') return dateStr;
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    doc.setFont('times', 'normal');
    
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = resumeData;
    
    const checkPageBreak = (height) => {
      if (yPosition + height > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Header with photo
    if (personalInfo.photo) {
      try {
        doc.addImage(personalInfo.photo, 'JPEG', pageWidth - margin - 25, margin, 25, 25, '', 'FAST');
      } catch (e) {
        console.error('Photo error:', e);
      }
    }

    // Name
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text(personalInfo.fullName || 'Your Name', margin, yPosition);
    yPosition += 8;

    // Title
    if (personalInfo.title) {
      doc.setFontSize(12);
      doc.setFont('times', 'italic');
      doc.setTextColor(80, 80, 80);
      doc.text(personalInfo.title, margin, yPosition);
      yPosition += 6;
    }

    // Contact info
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      doc.text(contactInfo, margin, yPosition);
      yPosition += 5;
    }

    // Links
    if (personalInfo.linkedin) {
      doc.setTextColor(0, 102, 204);
      doc.textWithLink('LinkedIn', margin, yPosition, { url: personalInfo.linkedin });
      yPosition += 5;
    }
    
    if (personalInfo.website) {
      doc.setTextColor(0, 102, 204);
      doc.textWithLink('Portfolio', margin, yPosition, { url: personalInfo.website });
      yPosition += 5;
    }

    yPosition += 5;
    doc.setTextColor(0, 0, 0);

    // Summary
    if (summary) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      const summaryLines = doc.splitTextToSize(summary, contentWidth);
      doc.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 5 + 5;
    }

    // Experience
    if (experience.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('WORK EXPERIENCE', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      experience.forEach((exp) => {
        checkPageBreak(25);
        
        doc.setFontSize(11);
        doc.setFont('times', 'bold');
        doc.text(exp.title || 'Job Title', margin, yPosition);
        
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        const startDateFormatted = formatDateForDisplay(exp.startDate) || 'MM/YYYY';
        const endDateFormatted = exp.current ? 'Present' : (formatDateForDisplay(exp.endDate) || 'MM/YYYY');
        const dateText = `${startDateFormatted} - ${endDateFormatted}`;
        doc.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text(`${exp.company || 'Company'}${exp.location ? ' | ' + exp.location : ''}`, margin, yPosition);
        yPosition += 5;
        
        if (exp.description) {
          doc.setFont('times', 'normal');
          const descLines = exp.description.split('\n').filter(l => l.trim());
          descLines.forEach(line => {
            const trimmed = line.trim();
            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
            const content = isBullet ? '• ' + trimmed.substring(1).trim() : trimmed;
            const wrapped = doc.splitTextToSize(content, contentWidth - 5);
            
            checkPageBreak(wrapped.length * 5);
            doc.text(wrapped, margin + 3, yPosition);
            yPosition += wrapped.length * 4.5;
          });
        }
        yPosition += 3;
      });
      yPosition += 2;
    }

    // Education
    if (education.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('EDUCATION', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      education.forEach(edu => {
        checkPageBreak(20);
        
        doc.setFontSize(11);
        doc.setFont('times', 'bold');
        doc.text(edu.degree || 'Degree', margin, yPosition);
        
        if (edu.graduationDate) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.text(formatDateForDisplay(edu.graduationDate), pageWidth - margin, yPosition, { align: 'right' });
        }
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text(`${edu.institution || 'Institution'}${edu.location ? ' | ' + edu.location : ''}`, margin, yPosition);
        yPosition += 5;
        
        if (edu.gpa) {
          doc.setFont('times', 'normal');
          doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
          yPosition += 4;
        }
        
        if (edu.courses) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          const coursesText = 'Relevant Coursework: ' + edu.courses;
          const courseLines = doc.splitTextToSize(coursesText, contentWidth);
          doc.text(courseLines, margin, yPosition);
          yPosition += courseLines.length * 4;
        }
        yPosition += 3;
      });
      yPosition += 2;
    }

    // Projects
    if (projects.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('PROJECTS', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      projects.forEach(proj => {
        checkPageBreak(20);
        
        doc.setFontSize(11);
        doc.setFont('times', 'bold');
        doc.text(proj.name || 'Project Name', margin, yPosition);
        yPosition += 5;
        
        if (proj.description) {
          doc.setFontSize(10);
          doc.setFont('times', 'normal');
          const descLines = doc.splitTextToSize(proj.description, contentWidth);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 4.5;
        }
        
        if (proj.technologies) {
          doc.setFont('times', 'italic');
          doc.setFontSize(9);
          doc.text('Technologies: ' + proj.technologies, margin, yPosition);
          yPosition += 4;
        }
        
        if (proj.url) {
          doc.setTextColor(0, 102, 204);
          doc.textWithLink('View Project', margin, yPosition, { url: proj.url });
          doc.setTextColor(0, 0, 0);
          yPosition += 4;
        }
        yPosition += 3;
      });
      yPosition += 2;
    }

    // Skills
    if (skills.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('SKILLS', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      skills.forEach(skill => {
        checkPageBreak(10);
        doc.setFontSize(10);
        
        if (skill.category) {
          doc.setFont('times', 'bold');
          doc.text(skill.category + ':', margin, yPosition);
          doc.setFont('times', 'normal');
          const textWidth = doc.getTextWidth(skill.category + ': ');
          const itemLines = doc.splitTextToSize(skill.items, contentWidth - textWidth);
          doc.text(itemLines, margin + textWidth, yPosition);
          yPosition += itemLines.length * 4.5;
        } else {
          doc.setFont('times', 'normal');
          const skillLines = doc.splitTextToSize(skill.items, contentWidth);
          doc.text(skillLines, margin, yPosition);
          yPosition += skillLines.length * 4.5;
        }
        yPosition += 1;
      });
      yPosition += 2;
    }

    // Certifications
    if (certifications.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('CERTIFICATIONS', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      certifications.forEach(cert => {
        checkPageBreak(15);
        
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.text(cert.name || 'Certification', margin, yPosition);
        
        if (cert.date) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.text(formatDateForDisplay(cert.date), pageWidth - margin, yPosition, { align: 'right' });
        }
        yPosition += 5;
        
        if (cert.issuer) {
          doc.setFont('times', 'italic');
          doc.text(cert.issuer, margin, yPosition);
          yPosition += 4;
        }
        
        if (cert.credentialId) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.text('Credential ID: ' + cert.credentialId, margin, yPosition);
          yPosition += 4;
        }
        
        if (cert.url) {
          doc.setTextColor(0, 102, 204);
          doc.setFont('times', 'normal');
          doc.textWithLink('View Certificate', margin, yPosition, { url: cert.url });
          doc.setTextColor(0, 0, 0);
          yPosition += 4;
        }
        yPosition += 2;
      });
      yPosition += 2;
    }

    // Languages
    if (languages.length > 0) {
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('LANGUAGES', margin, yPosition);
      yPosition += 2;
      
      const rgb = hexToRgb(accentColor);
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      const langText = languages.map(l => `${l.name}${l.proficiency ? ' (' + l.proficiency + ')' : ''}`).join(', ');
      const langLines = doc.splitTextToSize(langText, contentWidth);
      doc.text(langLines, margin, yPosition);
    }

    doc.save(`${personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`);
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      {/* Header */}
      <header className={`${cardBg} shadow-sm border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" style={{ color: accentColor }} />
              <div>
                <h1 className={`text-2xl font-bold ${textPrimary}`}>ATS Resume Builder</h1>
                <p className={`text-sm ${textSecondary}`}>Professional & ATS-Optimized</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition-all`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-lg text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Palette className="w-5 h-5" />
                </button>
                
                {showColorPicker && (
                  <div className={`${cardBg} absolute right-0 mt-2 p-4 rounded-lg shadow-xl border ${borderColor} z-50`} style={{ width: '250px' }}>
                    <h3 className={`font-bold ${textPrimary} mb-3`}>Choose Accent Color</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map(color => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setAccentColor(color.value);
                            setShowColorPicker(false);
                          }}
                          className={`w-12 h-12 rounded-lg border-2 ${accentColor === color.value ? 'border-white ring-2 ring-offset-2' : borderColor}`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className={`text-sm ${textSecondary}`}>Custom Color:</label>
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={generatePDF}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className={`${cardBg} rounded-lg shadow-md overflow-hidden`}>
              <div className="flex overflow-x-auto">
                {['personal', 'experience', 'education', 'skills', 'projects', 'other'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab
                        ? `${textPrimary}`
                        : `${textSecondary} hover:${textPrimary}`
                    }`}
                    style={activeTab === tab ? { borderColor: accentColor, color: accentColor } : { borderColor: 'transparent' }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Forms */}
            <div className={`${cardBg} rounded-lg shadow-md p-6 space-y-6 max-h-[700px] overflow-y-auto`}>
              {/* Personal Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${textPrimary} border-b ${borderColor} pb-2`}>Personal Information</h2>
                  
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                    style={{ focusRingColor: accentColor }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Professional Title"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email *"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                    />
                    
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Location (City, Province)"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                  />
                  
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                  />
                  
                  <input
                    type="url"
                    placeholder="Website/Portfolio URL"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                  />
                  
                  <div>
                    <button
                      onClick={() => setShowPhotoInput(!showPhotoInput)}
                      className="flex items-center space-x-2 font-medium"
                      style={{ color: accentColor }}
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span>{showPhotoInput ? 'Hide' : 'Add'} Professional Photo</span>
                    </button>
                    
                    {showPhotoInput && (
                      <div className="mt-3">
                        {resumeData.personalInfo.photo ? (
                          <div className="flex items-center space-x-4">
                            <img
                              src={resumeData.personalInfo.photo}
                              alt="Profile"
                              className={`w-20 h-20 rounded-lg object-cover border-2 ${borderColor}`}
                            />
                            <button
                              onClick={() => updatePersonalInfo('photo', null)}
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
                            className={`w-full px-4 py-3 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Professional Summary
                    </label>
                    <textarea
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Brief overview of your professional background, key skills, and career objectives..."
                      rows="5"
                      className={`w-full px-4 py-3 border ${borderColor} rounded-lg focus:ring-2 ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Work Experience</h2>
                    <button
                      onClick={() => addItem('experience')}
                      className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {resumeData.experience.length === 0 ? (
                    <p className={`text-center ${textSecondary} py-8`}>No experience added yet. Click "Add" to start.</p>
                  ) : (
                    resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                        <div className="flex justify-between items-start">
                          <h3 className={`font-semibold ${textPrimary}`}>Position {index + 1}</h3>
                          <button
                            onClick={() => removeItem('experience', exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Job Title *"
                          value={exp.title}
                          onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="text"
                          placeholder="Company Name *"
                          value={exp.company}
                          onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="text"
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="month"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                          
                          <input
                            type="month"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg} disabled:opacity-50`}
                          />
                        </div>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              updateItem('experience', exp.id, 'current', e.target.checked);
                              if (e.target.checked) {
                                updateItem('experience', exp.id, 'endDate', 'Present');
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className={`text-sm ${textSecondary}`}>Currently working here</span>
                        </label>
                        
                        <textarea
                          placeholder="Key responsibilities and achievements (use • or - for bullets)..."
                          value={exp.description}
                          onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                          rows="4"
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Education</h2>
                    <button
                      onClick={() => addItem('education')}
                      className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {resumeData.education.length === 0 ? (
                    <p className={`text-center ${textSecondary} py-8`}>No education added yet.</p>
                  ) : (
                    resumeData.education.map((edu, index) => (
                      <div key={edu.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                        <div className="flex justify-between items-start">
                          <h3 className={`font-semibold ${textPrimary}`}>Education {index + 1}</h3>
                          <button
                            onClick={() => removeItem('education', edu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Degree/Diploma *"
                          value={edu.degree}
                          onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="text"
                          placeholder="Institution Name *"
                          value={edu.institution}
                          onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => updateItem('education', edu.id, 'location', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                          
                          <input
                            type="month"
                            placeholder="Graduation Date"
                            value={edu.graduationDate}
                            onChange={(e) => updateItem('education', edu.id, 'graduationDate', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                        </div>
                        
                        <input
                          type="text"
                          placeholder="GPA (Optional)"
                          value={edu.gpa}
                          onChange={(e) => updateItem('education', edu.id, 'gpa', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <textarea
                          placeholder="Relevant Coursework (Optional, comma separated)"
                          value={edu.courses}
                          onChange={(e) => updateItem('education', edu.id, 'courses', e.target.value)}
                          rows="2"
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Skills</h2>
                    <button
                      onClick={() => addItem('skills')}
                      className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                  
                  {resumeData.skills.length === 0 ? (
                    <p className={`text-center ${textSecondary} py-8`}>No skills added yet.</p>
                  ) : (
                    resumeData.skills.map((skill, index) => (
                      <div key={skill.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                        <div className="flex justify-between items-start">
                          <h3 className={`font-semibold ${textPrimary}`}>Skill Category {index + 1}</h3>
                          <button
                            onClick={() => removeItem('skills', skill.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Category (e.g., Programming Languages, Tools)"
                          value={skill.category}
                          onChange={(e) => updateItem('skills', skill.id, 'category', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="text"
                          placeholder="Skills (comma separated: Python, Java, React)"
                          value={skill.items}
                          onChange={(e) => updateItem('skills', skill.id, 'items', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Personal Projects</h2>
                    <button
                      onClick={() => addItem('projects')}
                      className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {resumeData.projects.length === 0 ? (
                    <p className={`text-center ${textSecondary} py-8`}>No projects added yet.</p>
                  ) : (
                    resumeData.projects.map((proj, index) => (
                      <div key={proj.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                        <div className="flex justify-between items-start">
                          <h3 className={`font-semibold ${textPrimary}`}>Project {index + 1}</h3>
                          <button
                            onClick={() => removeItem('projects', proj.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Project Name *"
                          value={proj.name}
                          onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <textarea
                          placeholder="Project Description"
                          value={proj.description}
                          onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)}
                          rows="3"
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="text"
                          placeholder="Technologies Used (comma separated)"
                          value={proj.technologies}
                          onChange={(e) => updateItem('projects', proj.id, 'technologies', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                        
                        <input
                          type="url"
                          placeholder="Project URL (Optional)"
                          value={proj.url}
                          onChange={(e) => updateItem('projects', proj.id, 'url', e.target.value)}
                          className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Other Tab (Certifications & Languages) */}
              {activeTab === 'other' && (
                <div className="space-y-6">
                  {/* Certifications */}
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                      <h2 className={`text-xl font-bold ${textPrimary}`}>Certifications</h2>
                      <button
                        onClick={() => addItem('certifications')}
                        className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    
                    {resumeData.certifications.length === 0 ? (
                      <p className={`text-center ${textSecondary} py-4`}>No certifications added yet.</p>
                    ) : (
                      resumeData.certifications.map((cert, index) => (
                        <div key={cert.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold ${textPrimary}`}>Certification {index + 1}</h3>
                            <button
                              onClick={() => removeItem('certifications', cert.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Certification Name *"
                            value={cert.name}
                            onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Issuing Organization"
                              value={cert.issuer}
                              onChange={(e) => updateItem('certifications', cert.id, 'issuer', e.target.value)}
                              className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                            />
                            
                            <input
                              type="month"
                              placeholder="Date Obtained"
                              value={cert.date}
                              onChange={(e) => updateItem('certifications', cert.id, 'date', e.target.value)}
                              className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                            />
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Credential ID (Optional)"
                            value={cert.credentialId}
                            onChange={(e) => updateItem('certifications', cert.id, 'credentialId', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                          
                          <input
                            type="url"
                            placeholder="Certificate URL (Optional)"
                            value={cert.url}
                            onChange={(e) => updateItem('certifications', cert.id, 'url', e.target.value)}
                            className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                          />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Languages */}
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between border-b ${borderColor} pb-2`}>
                      <h2 className={`text-xl font-bold ${textPrimary}`}>Languages</h2>
                      <button
                        onClick={() => addItem('languages')}
                        className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    
                    {resumeData.languages.length === 0 ? (
                      <p className={`text-center ${textSecondary} py-4`}>No languages added yet.</p>
                    ) : (
                      resumeData.languages.map((lang, index) => (
                        <div key={lang.id} className={`p-4 border ${borderColor} rounded-lg space-y-3`}>
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold ${textPrimary}`}>Language {index + 1}</h3>
                            <button
                              onClick={() => removeItem('languages', lang.id)}
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
                              onChange={(e) => updateItem('languages', lang.id, 'name', e.target.value)}
                              className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
                            />
                            
                            <select
                              value={lang.proficiency}
                              onChange={(e) => updateItem('languages', lang.id, 'proficiency', e.target.value)}
                              className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${inputBg}`}
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
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className={`${cardBg} rounded-lg shadow-xl overflow-hidden`}>
              <div className="px-6 py-3" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}>
                <h2 className="text-white font-semibold">Live Preview - A4 Format</h2>
              </div>
              
              <div className={`p-8 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ maxHeight: '800px' }}>
                <div className="bg-white" style={{ 
                  width: '210mm', 
                  minHeight: '297mm', 
                  margin: '0 auto',
                  padding: '20mm',
                  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                  fontFamily: "'Times New Roman', serif"
                }}>
                  {/* Header */}
                  <div style={{ marginBottom: '12pt', borderBottom: `2pt solid ${accentColor}`, paddingBottom: '8pt' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '20pt', fontWeight: 'bold', margin: '0 0 4pt 0', color: '#000' }}>
                          {resumeData.personalInfo.fullName || 'Your Name'}
                        </h1>
                        {resumeData.personalInfo.title && (
                          <p style={{ fontSize: '11pt', fontStyle: 'italic', color: '#333', margin: '0 0 6pt 0' }}>
                            {resumeData.personalInfo.title}
                          </p>
                        )}
                        
                        <div style={{ fontSize: '9pt', color: '#555', lineHeight: '1.4' }}>
                          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
                          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
                          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
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
                            width: '25mm',
                            height: '25mm',
                            borderRadius: '3pt',
                            objectFit: 'cover',
                            marginLeft: '12pt',
                            border: '1pt solid #ddd'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Professional Summary
                      </h2>
                      <p style={{ fontSize: '10pt', textAlign: 'justify', lineHeight: '1.4', color: '#333', margin: 0 }}>
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Work Experience
                      </h2>
                      {resumeData.experience.map(exp => (
                        <div key={exp.id} style={{ marginBottom: '10pt' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <div style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#000' }}>
                              {exp.title || 'Job Title'}
                            </div>
                            <div style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '12pt' }}>
                              {formatDateForDisplay(exp.startDate) || 'MM/YYYY'} - {exp.current ? 'Present' : (formatDateForDisplay(exp.endDate) || 'MM/YYYY')}
                            </div>
                          </div>
                          <div style={{ fontSize: '10pt', fontStyle: 'italic', color: '#555', marginTop: '2pt' }}>
                            {exp.company || 'Company'}{exp.location ? ` | ${exp.location}` : ''}
                          </div>
                          {exp.description && (
                            <div style={{ marginTop: '4pt', fontSize: '9.5pt', lineHeight: '1.4', color: '#333' }}>
                              {exp.description.split('\n').map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) return null;
                                const startsWithBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
                                const content = startsWithBullet ? trimmed.substring(1).trim() : trimmed;
                                return (
                                  <div key={i} style={{ marginBottom: '3pt' }}>
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
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Education
                      </h2>
                      {resumeData.education.map(edu => (
                        <div key={edu.id} style={{ marginBottom: '10pt' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <div style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#000' }}>
                              {edu.degree || 'Degree'}
                            </div>
                            {edu.graduationDate && (
                              <div style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '12pt' }}>
                                {formatDateForDisplay(edu.graduationDate)}
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '10pt', fontStyle: 'italic', color: '#555', marginTop: '2pt' }}>
                            {edu.institution || 'Institution'}{edu.location ? ` | ${edu.location}` : ''}
                          </div>
                          {edu.gpa && (
                            <div style={{ fontSize: '9pt', color: '#555', marginTop: '2pt' }}>
                              GPA: {edu.gpa}
                            </div>
                          )}
                          {edu.courses && (
                            <div style={{ fontSize: '9pt', color: '#555', marginTop: '2pt' }}>
                              <span style={{ fontWeight: 'bold' }}>Relevant Coursework:</span> {edu.courses}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Projects
                      </h2>
                      {resumeData.projects.map(proj => (
                        <div key={proj.id} style={{ marginBottom: '10pt' }}>
                          <div style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#000' }}>
                            {proj.name || 'Project Name'}
                          </div>
                          {proj.description && (
                            <div style={{ fontSize: '9.5pt', color: '#333', marginTop: '2pt', lineHeight: '1.4' }}>
                              {proj.description}
                            </div>
                          )}
                          {proj.technologies && (
                            <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#555', marginTop: '2pt' }}>
                              Technologies: {proj.technologies}
                            </div>
                          )}
                          {proj.url && (
                            <div style={{ fontSize: '9pt', marginTop: '2pt' }}>
                              <a href={proj.url} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Skills
                      </h2>
                      {resumeData.skills.map(skill => (
                        <div key={skill.id} style={{ marginBottom: '4pt', fontSize: '9.5pt', color: '#333' }}>
                          {skill.category && <span style={{ fontWeight: 'bold' }}>{skill.category}: </span>}
                          <span>{skill.items}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications.length > 0 && (
                    <div style={{ marginBottom: '12pt' }}>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Certifications
                      </h2>
                      {resumeData.certifications.map(cert => (
                        <div key={cert.id} style={{ marginBottom: '6pt' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <div>
                              <span style={{ fontSize: '10pt', fontWeight: 'bold', color: '#000' }}>
                                {cert.name || 'Certification'}
                              </span>
                              {cert.issuer && (
                                <span style={{ fontSize: '9pt', fontStyle: 'italic', color: '#555' }}>
                                  {' '}- {cert.issuer}
                                </span>
                              )}
                            </div>
                            {cert.date && (
                              <div style={{ fontSize: '9pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '12pt' }}>
                                {formatDateForDisplay(cert.date)}
                              </div>
                            )}
                          </div>
                          {cert.credentialId && (
                            <div style={{ fontSize: '8.5pt', color: '#666', marginTop: '2pt' }}>
                              Credential ID: {cert.credentialId}
                            </div>
                          )}
                          {cert.url && (
                            <div style={{ fontSize: '9pt', marginTop: '2pt' }}>
                              <a href={cert.url} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                View Certificate
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Languages */}
                  {resumeData.languages.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: accentColor, margin: '0 0 6pt 0', textTransform: 'uppercase' }}>
                        Languages
                      </h2>
                      <div style={{ fontSize: '9.5pt', color: '#333' }}>
                        {resumeData.languages.map((lang, index) => (
                          <span key={lang.id} style={{ marginRight: '12pt' }}>
                            <span style={{ fontWeight: 'bold' }}>{lang.name || 'Language'}</span>
                            {lang.proficiency && ` (${lang.proficiency})`}
                            {index < resumeData.languages.length - 1 && ', '}
                          </span>
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
    </div>
  );
};

export default App;