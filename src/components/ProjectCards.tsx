import React from 'react';
import Sphere from './../../public/Sphere.png'
import Modulus from './../../public/modulus.jpg'
interface Project {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  bgColor: string;
  link: string;
}

const ProjectCards: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Sphere - Voice AI Interface",
      date: "June 1, 2023",
      description: "Real time voice AI interface with live audio streaming, low latency responses and 3D visual feedback build for the modern web.",
      image: Sphere.src,
      bgColor: "#ffffff",
      link:'https://sphere-red.vercel.app/',
    },
    {
      id: 2,
      title: "Modulus Housing",
      date: "June 1, 2023",
      description: "Production website for a modular hosuing company, focused on performance, responsive UX and conversion ready brand presentations.",
      image: Modulus.src,
      // image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      bgColor: "from-sky-100 to-blue-50",
      link:'https://www.modulushousing.com/',
    },
    // {
    //   id: 3,
    //   title: "Blog Post Title",
    //   date: "June 1, 2023",
    //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //   image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    //   bgColor: "from-sky-100 to-blue-50"
    // }
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-16 px-2">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Projects
          </h2>
          {/* <button 
            className="text-2xl md:text-2xl font-bold text-gray-800  underline"
            style={{
            
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
            
          >
            More
          </button> */}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full py-3 sm:py-4 bg-gray-200 text-gray-700 font-semibold  text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: '36px',
                boxShadow: '8px 8px 16px #b3b3b3, -8px -8px 16px #ffffff'
              }}
            >
              {/* Image with colored background */}
              <div className={` p-6 flex items-center justify-center h-60`} style={{
                
             
              }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 ">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {project.title}
                </h3>
                {/* <p className="text-sm text-gray-500 mb-3">{project.date}</p> */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Read More Button */}
                <a 
  href={project.link}
  target="_blank" >
                <button 
                  className="underline text-black-600 font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{
                    borderRadius: '20px',
                   
                  }}
                  
                >
                  View Project
                </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCards;