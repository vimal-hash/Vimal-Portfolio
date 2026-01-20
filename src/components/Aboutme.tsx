import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
interface Project {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  bgColor: string;
}

const aboutme: React.FC = () => {
 

    // State to hold the animation data
    const [animationData, setAnimationData] = useState<any>(null);
  
    // Fetch the JSON file from the public folder when component loads
    useEffect(() => {
      fetch('/watch_sample2.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => setAnimationData(data))
        .catch((error) => console.error('Error loading animation:', error));
    }, []);
  
    // Prevent horizontal scroll on mount
    useEffect(() => {
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      
      return () => {
        document.body.style.overflowX = '';
        document.documentElement.style.overflowX = '';
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
     

      {/* About Me Section */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">About Me</h2>
          
          <div 
          
            className="flex items-center justify-center w-full py-3 sm:py-4 bg-gray-200 text-gray-700 font-semibold  text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed  p-8 md:p-12"
              style={{
                borderRadius: '36px',
                boxShadow: '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff'
              }}
          >

             {/* animation */}
            <div className='w-[30%]'>
                      {animationData ? (
                        <div className="flex items-center justify-center max-w-full">
                          <Lottie 
                            animationData={animationData} 
                            loop={true} 
                            autoplay={true}
                            style={{ 
                              width: '100%', 
                              maxWidth: '300px',
                              height: 'auto',
                              maxHeight: '300px'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 animate-pulse">
                          Loading Animation...
                        </div>
                      )}
                    </div>

            {/* para */}
            <div  className='w-[70%]'>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <span className="font-semibold text-gray-800">Hey HI!</span>
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              I have been working as a Front-end Developer for over three years, gaining experience in  frontend  frameworks. While I particularly enjoy crafting intuitive frontend UIs, I am also comfortable handling the website animation part, creating animation using After effects. I have good knowledge in after effects and premier pro. Sometimes I'll do 3d models for websites using blender.  My journey in development is a continuous learning process, and I strive to expand my skills every day.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The JavaScript ecosystem is evolving at an incredible pace, with new frameworks and tools emerging constantly to address various challenges. With the support of its mature developer community, I believe I can make meaningful contributions. I am always eager to build projects using JavaScript/TypeScript and explore new technologies.
            </p>
            </div>
           
            
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default aboutme;