import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import AIAssistant from './views/AIAssistant';
import SkillAssessment from './views/SkillAssessment';
import Roadmap from './views/Roadmap';
import { UserProfile, RoadmapStep, ViewParams, Skill } from './types';
import { generateRoadmap } from './services/geminiService';
import { getPythonExpertRoadmap } from './services/expertEngine';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewParams>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initial State
  const [user, setUser] = useState<UserProfile>({
    name: "",
    targetRole: "",
    experienceLevel: "Junior",
    skills: [],
    bio: ""
  });

  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleAnalysisComplete = async (analyzedSkills: Skill[], role: string) => {
    setLoadingRoadmap(true);
    setCurrentView('roadmap');
    
    try {
      // 1. Try Python Expert Engine First (NO AI/API)
      const expertPath = await getPythonExpertRoadmap(role);
      
      if (expertPath) {
        console.log("Using Python Expert Engine for:", role);
        setRoadmap(expertPath);
      } else {
        // 2. Fallback to Gemini AI if not a predefined role
        console.log("Falling back to Gemini AI for:", role);
        const generatedRoadmap = await generateRoadmap(analyzedSkills, role);
        if (generatedRoadmap && generatedRoadmap.length > 0) {
          setRoadmap(generatedRoadmap);
        } else {
          console.error("AI returned an empty roadmap.");
          alert("We couldn't generate a roadmap. Please try the assessment again with more details.");
        }
      }
    } catch (error) {
      console.error("Failed to generate roadmap", error);
      alert("Error generating path. Please try again.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {currentView === 'home' && (
        <Home 
          userName={user.name}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'ai-assistant' && (
        <AIAssistant />
      )}
      
      {currentView === 'assessment' && (
        <SkillAssessment 
          user={user} 
          onUpdateUser={handleUserUpdate}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      
      {currentView === 'roadmap' && (
        <>
          {loadingRoadmap ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="w-24 h-24 border-[6px] border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-10 bg-primary-600 rounded-xl animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Constructing your path...</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">
                  Initializing the Expert Logic Engine to build your professional 6-phase strategy.
                </p>
              </div>
            </div>
          ) : (
             <Roadmap roadmap={roadmap} user={user} />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
