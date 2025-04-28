import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Search, 
  MessageSquare, 
  // Calendar, 
  // CreditCard, 
  Settings, 
  Menu, 
  X, 
  Send, 
  ChevronRight, 
  ExternalLink,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

// Sample covenant documents
const covenantDocuments = [
  { id: 1, title: "Architectural Guidelines", category: "property", pages: 12 },
  { id: 2, title: "Pet Policies", category: "lifestyle", pages: 5 },
  { id: 3, title: "Noise Restrictions", category: "lifestyle", pages: 3 },
  { id: 4, title: "Landscaping Requirements", category: "property", pages: 8 },
  { id: 5, title: "Parking Regulations", category: "property", pages: 6 },
  { id: 6, title: "Common Area Usage", category: "amenities", pages: 9 },
  { id: 7, title: "Rental Policies", category: "administrative", pages: 7 },
];

// Sample chat messages with AI responses
const sampleMessages = [
  {
    id: 1, 
    role: "system", 
    content: "Welcome to Oakridge Estates Covenant Hub! I can help answer questions about our community rules and regulations. What would you like to know?"
  }
];

// Common resident questions
const commonQuestions = [
  "What are the rules about fence height?",
  "Can I have a pet in my unit?",
  "What are the quiet hours in our community?",
  "Do I need approval to paint my house?",
  "Where can guests park overnight?"
];

const ResidentPortal = () => {
  // State for chat interface
  const [messages, setMessages] = useState(sampleMessages);
  const [inputValue, setInputValue] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeCitation, setActiveCitation] = useState(null);
  const [documentView, setDocumentView] = useState(null);
  const messagesEndRef = useRef(null);
  
  // State for main interface
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    // If no input and not a suggested question, return
    if (!inputValue.trim() && !e.currentTarget.dataset.question) return;
    
    // Use suggested question or input value
    const messageText = e.currentTarget.dataset.question || inputValue;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: messageText
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setShowSuggestions(false);

    // Simulate AI response for demo purposes
    setTimeout(() => {
      let responseContent = "";
      let citations = [];
      
      // Generate responses based on query content
      if (messageText.toLowerCase().includes("fence")) {
        responseContent = "According to our Architectural Guidelines, fence height is limited to 6 feet for backyard fences and 4 feet for side yard fences. All fence designs must be approved by the Architectural Committee before installation, and materials are limited to wood, vinyl, or wrought iron. Chain link fences are not permitted.";
        citations = [
          { documentId: 1, title: "Architectural Guidelines", page: 4, text: "Fence height is limited to 6 feet for backyard fences and 4 feet for side yard fences." },
          { documentId: 1, title: "Architectural Guidelines", page: 5, text: "All fence designs must be approved by the Architectural Committee before installation." }
        ];
      } else if (messageText.toLowerCase().includes("pet")) {
        responseContent = "According to our Pet Policies, residents may have up to 2 domestic pets (cats or dogs) per household. Dogs must be leashed when in common areas, and owners must clean up after their pets. Exotic animals require special permission from the board. There is a 35-pound weight limit for dogs in multi-family buildings.";
        citations = [
          { documentId: 2, title: "Pet Policies", page: 1, text: "Residents may have up to 2 domestic pets (cats or dogs) per household." },
          { documentId: 2, title: "Pet Policies", page: 2, text: "Dogs must be leashed when in common areas, and owners must clean up after their pets." }
        ];
      } else if (messageText.toLowerCase().includes("quiet") || messageText.toLowerCase().includes("noise")) {
        responseContent = "According to our Noise Restrictions, quiet hours are from 10:00 PM to 7:00 AM on weekdays and 11:00 PM to 8:00 AM on weekends and holidays. During these hours, residents should avoid loud music, power tools, and other noise that could disturb neighbors. Persistent noise violations may result in fines after a warning.";
        citations = [
          { documentId: 3, title: "Noise Restrictions", page: 1, text: "Quiet hours are from 10:00 PM to 7:00 AM on weekdays and 11:00 PM to 8:00 AM on weekends and holidays." },
          { documentId: 3, title: "Noise Restrictions", page: 2, text: "Persistent noise violations may result in fines after a warning." }
        ];
      } else if (messageText.toLowerCase().includes("paint")) {
        responseContent = "Yes, according to our Architectural Guidelines, any changes to the exterior color of your home require prior approval from the Architectural Committee. You must submit an Architectural Change Request form along with color samples. The community has an approved color palette, which you can view on the Resident Portal or request from the HOA office.";
        citations = [
          { documentId: 1, title: "Architectural Guidelines", page: 3, text: "Any changes to the exterior color of your home require prior approval from the Architectural Committee." },
          { documentId: 1, title: "Architectural Guidelines", page: 3, text: "The community has an approved color palette, which you can view on the Resident Portal." }
        ];
      } else if (messageText.toLowerCase().includes("park") || messageText.toLowerCase().includes("guest")) {
        responseContent = "According to our Parking Regulations, guests may park in designated visitor spaces for up to 48 hours without a permit. For longer stays, residents must request a temporary parking permit from the management office. Overnight parking on streets is prohibited between 2:00 AM and 6:00 AM. Each unit is allocated 2 resident parking spaces.";
        citations = [
          { documentId: 5, title: "Parking Regulations", page: 2, text: "Guests may park in designated visitor spaces for up to 48 hours without a permit." },
          { documentId: 5, title: "Parking Regulations", page: 3, text: "Overnight parking on streets is prohibited between 2:00 AM and 6:00 AM." }
        ];
      } else {
        responseContent = "I don't have specific information about that in our covenant documents. You might want to browse the complete documents or contact the HOA office for more information.";
      }

      // Add AI response
      const newSystemMessage = {
        id: messages.length + 2,
        role: "system",
        content: responseContent,
        citations: citations
      };
      
      setMessages(prevMessages => [...prevMessages, newSystemMessage]);
    }, 1000);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question) => {
    handleSendMessage({
      preventDefault: () => {},
      currentTarget: {
        dataset: {
          question: question
        }
      }
    });
  };

  // Render citations with source references
  const renderCitations = (citations) => {
    if (!citations || citations.length === 0) return null;
    
    return (
      <div className="mt-3 text-xs">
        <p className="font-medium mb-1 text-gray-500">Sources:</p>
        <div className="flex flex-wrap gap-1">
          {citations.map((citation, index) => (
            <button
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCitation === index 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCitation(activeCitation === index ? null : index)}
              aria-label={`View citation from ${citation.title}, page ${citation.page}`}
            >
              {citation.title}, p.{citation.page}
            </button>
          ))}
        </div>
        {activeCitation !== null && citations[activeCitation] && (
          <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-200 text-sm text-indigo-800">
            <p className="italic">
              "{citations[activeCitation].text}"
            </p>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-indigo-200 text-xs">
              <span>
                Source: {citations[activeCitation].title}, Page {citations[activeCitation].page}
              </span>
              <button 
                className="flex items-center text-indigo-700 hover:text-indigo-900"
                onClick={() => setDocumentView(citations[activeCitation].documentId)}
              >
                <span className="mr-1">View Document</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render main dashboard content
  const renderDashboardContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Welcome back, Alex!</h2>
          <p className="text-indigo-100 mb-4">You have 2 community announcements and 1 upcoming event.</p>
          <div className="flex items-center mt-4">
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50">
              View Announcements
            </button>
            <button className="ml-3 text-white border border-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Calendar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">Next HOA Meeting</h3>
                <p className="text-sm text-gray-500 mt-1">May 15th, 7:00 PM</p>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Upcoming</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Location: Community Clubhouse</p>
              <p className="text-sm text-gray-600 mt-1">Agenda: Budget Review, Summer Events, Pool Maintenance</p>
            </div>
            <button className="mt-4 text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
              <span>Add to Calendar</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">HOA Fees Status</h3>
                <p className="text-sm text-gray-500 mt-1">For April 2025</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Paid</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Last payment: April 2, 2025</p>
              <p className="text-sm text-gray-600 mt-1">Next due: May 1, 2025</p>
            </div>
            <button className="mt-4 text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
              <span>Payment History</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">Recent Announcements</h3>
                <p className="text-sm text-gray-500 mt-1">2 new updates</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="border-l-2 border-orange-500 pl-3">
                <p className="text-sm font-medium text-gray-800">Pool Closure for Maintenance</p>
                <p className="text-xs text-gray-600">Apr 25, 2025</p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3">
                <p className="text-sm font-medium text-gray-800">Summer BBQ Event</p>
                <p className="text-xs text-gray-600">Apr 18, 2025</p>
              </div>
            </div>
            <button className="mt-4 text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
              <span>View All Updates</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Commonly Referenced Rules</h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
              onClick={() => handleSuggestedQuestion("What are the rules about fence height?")}
            >
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FileText size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Fence Requirements</p>
                <p className="text-sm text-gray-600 mt-1">Height restrictions, materials, and approval process</p>
              </div>
            </button>
            
            <button 
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
              onClick={() => handleSuggestedQuestion("Can I have a pet in my unit?")}
            >
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FileText size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Pet Policies</p>
                <p className="text-sm text-gray-600 mt-1">Pet types, quantity limits, and common area rules</p>
              </div>
            </button>
            
            <button 
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
              onClick={() => handleSuggestedQuestion("What are the quiet hours in our community?")}
            >
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FileText size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Noise Restrictions</p>
                <p className="text-sm text-gray-600 mt-1">Quiet hours, noise limitations, and enforcement</p>
              </div>
            </button>
            
            <button 
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
              onClick={() => handleSuggestedQuestion("Where can guests park overnight?")}
            >
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FileText size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Parking Regulations</p>
                <p className="text-sm text-gray-600 mt-1">Visitor parking, permits, and street parking rules</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render documents view content
  const renderDocumentsContent = () => {
    // Filter documents based on search query if one exists
    const filteredDocuments = searchQuery
      ? covenantDocuments.filter(doc => 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : covenantDocuments;
      
    // Group documents by category
    const documentsByCategory = filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {});
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Covenant Documents</h2>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          {/* Render documents by category */}
          {Object.keys(documentsByCategory).length > 0 ? (
            Object.keys(documentsByCategory).map(category => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">{category} Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentsByCategory[category].map(doc => (
                    <button
                      key={doc.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm bg-white text-left transition-all"
                      onClick={() => setDocumentView(doc.id)}
                    >
                      <div className="flex items-start">
                        <div className="p-2 bg-indigo-100 rounded-md mr-3">
                          <FileText size={24} className="text-indigo-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{doc.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{doc.pages} pages · Last updated: Apr 12, 2025</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No documents match your search criteria.</p>
              <button 
                className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render document view when a specific document is selected
  const renderDocumentView = () => {
    const document = covenantDocuments.find(doc => doc.id === documentView);
    
    if (!document) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center">
            <button 
              className="mr-3 p-2 rounded-md hover:bg-gray-100 text-gray-500"
              onClick={() => setDocumentView(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">{document.title}</h2>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{document.pages} pages</span>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="bg-gray-50 rounded-md p-3 flex items-start mb-6">
            <Info size={18} className="text-indigo-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Have a question about this document?</p>
              <p className="text-xs text-gray-600">Use the AI assistant to get quick answers about specific rules or policies.</p>
              <button 
                className="mt-2 text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800"
                onClick={() => {
                  setChatOpen(true);
                  setInputValue(`Can you explain the ${document.title} rules?`);
                }}
              >
                <MessageSquare size={14} className="mr-1" />
                <span>Ask the AI Assistant</span>
              </button>
            </div>
          </div>
          
          {/* Simulated document content */}
          <div className="prose max-w-none">
            <h2>I. Purpose and Scope</h2>
            <p>This document outlines the policies and regulations regarding {document.title.toLowerCase()} for the Oakridge Estates Homeowners Association, as approved by the Board of Directors.</p>
            
            <h3>1.1 Applicability</h3>
            <p>These guidelines apply to all homeowners, residents, and their guests within the Oakridge Estates community. Compliance is mandatory per section 4.3 of the CC&Rs.</p>
            
            <h3>1.2 Enforcement</h3>
            <p>The HOA Board and management company are responsible for enforcing these guidelines. Violations may result in warnings, fines, or other actions as permitted by the CC&Rs.</p>
            
            <h2>II. Specific Regulations</h2>
            
            {document.id === 1 && (
              <>
                <h3>2.1 Fence Requirements</h3>
                <p><strong>Height Limitations:</strong> Fence height is limited to 6 feet for backyard fences and 4 feet for side yard fences.</p>
                <p><strong>Approval Process:</strong> All fence designs must be approved by the Architectural Committee before installation.</p>
                <p><strong>Materials:</strong> Approved materials include wood, vinyl, and wrought iron. Chain link fences are not permitted.</p>
                
                <h3>2.2 Exterior Paint Colors</h3>
                <p><strong>Approval Requirement:</strong> Any changes to the exterior color of your home require prior approval from the Architectural Committee.</p>
                <p><strong>Color Palette:</strong> The community has an approved color palette, which you can view on the Resident Portal.</p>
                <p><strong>Application Process:</strong> Submit an Architectural Change Request form along with color samples for review.</p>
              </>
            )}
            
            {document.id === 2 && (
              <>
                <h3>2.1 Pet Ownership</h3>
                <p><strong>Quantity Limits:</strong> Residents may have up to 2 domestic pets (cats or dogs) per household.</p>
                <p><strong>Weight Restrictions:</strong> There is a 35-pound weight limit for dogs in multi-family buildings.</p>
                <p><strong>Exotic Animals:</strong> Exotic animals require special permission from the board.</p>
                
                <h3>2.2 Pet Behavior and Control</h3>
                <p><strong>Leash Requirement:</strong> Dogs must be leashed when in common areas, and owners must clean up after their pets.</p>
                <p><strong>Noise Control:</strong> Excessive barking or pet noise that disturbs neighbors is prohibited.</p>
                <p><strong>Damage Liability:</strong> Pet owners are responsible for any damage caused by their pets to common areas or others' property.</p>
              </>
            )}
            
            {document.id === 3 && (
              <>
                <h3>2.1 Quiet Hours</h3>
                <p><strong>Weekday Hours:</strong> Quiet hours are from 10:00 PM to 7:00 AM on weekdays.</p>
                <p><strong>Weekend Hours:</strong> Quiet hours are from 11:00 PM to 8:00 AM on weekends and holidays.</p>
                <p><strong>Prohibited Activities:</strong> During these hours, residents should avoid loud music, power tools, and other noise that could disturb neighbors.</p>
                
                <h3>2.2 Enforcement</h3>
                <p><strong>Reporting:</strong> Noise disturbances can be reported to the HOA management company or security.</p>
                <p><strong>Warnings:</strong> First-time violations typically receive a warning.</p>
                <p><strong>Fines:</strong> Persistent noise violations may result in fines after a warning.</p>
              </>
            )}
            
            {document.id === 5 && (
              <>
                <h3>2.1 Resident Parking</h3>
                <p><strong>Allocation:</strong> Each unit is allocated 2 resident parking spaces.</p>
                <p><strong>Registration:</strong> All vehicles must be registered with the HOA office.</p>
                <p><strong>Street Parking:</strong> Overnight parking on streets is prohibited between 2:00 AM and 6:00 AM.</p>
                
                <h3>2.2 Visitor Parking</h3>
                <p><strong>Duration:</strong> Guests may park in designated visitor spaces for up to 48 hours without a permit.</p>
                <p><strong>Extended Stays:</strong> For longer stays, residents must request a temporary parking permit from the management office.</p>
                <p><strong>Enforcement:</strong> Vehicles parked in violation may be towed at the owner's expense.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white mr-3">
                  <Home size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-800">Oakridge Estates</h1>
                  <p className="text-xs text-gray-500">Covenant Hub</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'dashboard' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'documents' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documents
              </button>
              <button 
                onClick={() => setActiveTab('payments')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'payments' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Payments
              </button>
              <button 
                onClick={() => setActiveTab('support')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'support' 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Support
              </button>
            </nav>
            
            <div className="flex items-center">
              <button className="ml-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Settings size={20} />
              </button>
              <button 
                className="ml-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-3 space-y-1">
            <button 
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
                activeTab === 'dashboard' 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => {
                setActiveTab('documents');
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
                activeTab === 'documents' 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
            <button 
              onClick={() => {
                setActiveTab('payments');
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
                activeTab === 'payments' 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Payments
            </button>
            <button 
              onClick={() => {
                setActiveTab('support');
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
                activeTab === 'support' 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Support
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {documentView ? (
          renderDocumentView()
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboardContent()}
            {activeTab === 'documents' && renderDocumentsContent()}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payments</h2>
                <p className="text-gray-600">View and manage your HOA payments here.</p>
              </div>
            )}
            {activeTab === 'support' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Support</h2>
                <p className="text-gray-600">Need help? Contact our support team or search our knowledge base.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* AI Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-10">
        {!chatOpen ? (
          <button 
            className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center"
            onClick={() => setChatOpen(true)}
            aria-label="Open AI Assistant"
          >
            <MessageSquare size={24} />
          </button>
        ) : (
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col" style={{ height: '500px' }}>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare size={20} className="mr-2" />
                <h2 className="font-medium">Covenant AI Assistant</h2>
              </div>
              <button 
                className="p-1.5 rounded-md text-white hover:bg-indigo-700 transition-colors"
                onClick={() => setChatOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : ''}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white shadow-sm border border-gray-200'
                    }`}
                  >
                    <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {message.content}
                    </div>
                    {message.citations && renderCitations(message.citations)}
                  </div>
                </div>
              ))}
              
              {/* Suggested questions */}
              {showSuggestions && messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Here are some questions you can ask:</p>
                  <div className="space-y-2">
                    {commonQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 bg-white text-sm transition-colors"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage}>
                <div className="flex">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about community rules..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                  <div className="flex items-center">
                    <HelpCircle size={12} className="text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">AI answers from your HOA documents</span>
                  </div>
                  <div className="flex space-x-2">
                    <button type="button" className="text-gray-400 hover:text-indigo-600">
                      <ThumbsUp size={14} />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-indigo-600">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentPortal;
                