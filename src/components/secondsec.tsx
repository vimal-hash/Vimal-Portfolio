'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from "gsap";

// TypeScript interfaces
interface Skill {
    name: string;
    percentage: number;
}

interface TriangleConfig {
    id: number;
    techList: string[];
    title: string;
    skills: Skill[];
}

interface CircularSkillProps {
    skill: string;
    percentage: number;
    delay?: number;
}

interface GlowingTriangleProps {
    techList: string[];
    triangleId: number;
    onClick: (triangleId: number) => void;
    isSelected: boolean;
}

const triangleConfigs: TriangleConfig[] = [
    {
        id: 1,
        techList: ['MongoDB', 'ex', 'React', 'Node.js'],
        title: "Full Stack Development",
        skills: [
            { name: "MongoDB", percentage: 85 },
            { name: "Express", percentage: 80 },
            { name: "React", percentage: 95 },
            { name: "Node.js", percentage: 88 }
        ]
    },
    {
        id: 2,
        techList: ['next', 'Tailwind', 'TypeScript'],
        title: "Frontend Technologies",
        skills: [
            { name: "Next.js", percentage: 90 },
            { name: "Tailwind", percentage: 92 },
            { name: "TypeScript", percentage: 87 }
        ]
    },
    {
        id: 3,
        techList: ['gitt', 'verc', 'framer-motion'],
        title: "Development Tools",
        skills: [
            { name: "Git", percentage: 93 },
            { name: "Vercel", percentage: 85 },
            { name: "Framer Motion", percentage: 78 }
        ]
    }
];

// Circular Skill Component
const CircularSkill: React.FC<CircularSkillProps> = ({ skill, percentage, delay = 0 }) => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    // Calculate color based on percentage (grey to white)
    const greyValue = Math.round(128 + (percentage / 100) * 127); // 128 (grey) to 255 (white)
    const progressColor = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
    const glowColor = `rgba(${greyValue}, ${greyValue}, ${greyValue}, 0.6)`;
    
    return (
        <motion.div 
            className="flex flex-col items-center space-y-3"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ 
                
                duration: 0.8,
                type: "spring",
                stiffness: 100
            }}
        >
            {/* Circular Progress */}
            <div className="relative w-32 h-32">
                <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="-20 -20 140 140"
                    style={{
                        filter: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor})`
                    }}
                >
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={progressColor}
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 2, ease: "easeOut", delay: delay + 0.2 }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${glowColor})`
                        }}
                    />
                </svg>
                {/* Percentage text in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                        className="text-sm font-bold"
                        style={{ 
                            color: progressColor,
                            textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 1, duration: 0.5 }}
                    >
                        {percentage}%
                    </motion.span>
                </div>
            </div>
            
            {/* Skill name below the graph */}
            <motion.h4 
                className="text-lg font-semibold text-center"
                style={{
                    color: progressColor,
                    textShadow: `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.5, duration: 0.5 }}
            >
                {skill}
            </motion.h4>
        </motion.div>
    );
};

// Reusable Triangle Component with Enhanced Glow
const GlowingTriangle: React.FC<GlowingTriangleProps> = ({ techList, triangleId, onClick, isSelected }) => {
    return (
        <div>
        <div onClick={() => onClick(triangleId)} className="cursor-pointer">
            {/* triangle */}
            <svg 
                className="w-[120%] h-[50%]" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                zoomAndPan="magnify" 
                viewBox="500 200 450 400" 
                preserveAspectRatio="xMidYMid meet" 
                version="1.2"
            >
                <defs>
                    <filter id={`glow-${triangleId}`} x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur3" />
                        <feMerge>
                            <feMergeNode in="blur1" />
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur3" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="white" floodOpacity="1" />
                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="white" floodOpacity="1" />
                    </filter>

                    <filter id={`textGlow-${triangleId}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur2" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g id={`triangle-${triangleId}`} filter={`url(#glow-${triangleId})`}>
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M -0.000708479 2.001085 L 383.999311 2.001085 " transform="matrix(0.75,0,0,0.75,573.719281,265.628092)" />
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M -0.00154566 1.99883 L 388.13609 1.998221 " transform="matrix(-0.318034,-0.678964,0.678964,-0.318034,685.0955,547.31824)" />
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M -0.00222975 2.000584 L 391.003879 1.997822 " transform="matrix(-0.328564,0.6742,-0.6742,-0.328564,879.301186,283.729136)" />
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M 0.00231261 1.998387 L 84.033566 1.998387 " transform="matrix(0.749721,0.000000000000000507,-0.000000000000000507,0.749721,686.459204,545.185361)" />
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M 1.227284 8.622054 C 12.579112 -0.204997 23.932038 -0.205075 35.286062 8.62182 " transform="matrix(0.550171,0.524717,-0.508099,0.532748,863.260331,261.817332)" />
                    <path style={{ fill: "none", strokeWidth: 4, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: "#ffffff", strokeOpacity: 1, strokeMiterlimit: 4 }} d="M 1.388417 8.620887 C 10.559178 -0.20539 19.736964 -0.203944 28.911812 8.618976 " transform="matrix(0.386363,-0.634235,0.634235,0.386363,556.921682,282.280259)" />
                </g>
                
                {techList.map((tech: string, index: number) => {
                    const iconSize = 40;
                    const spacing = 60;
                    const totalIcons = techList.length;
                    
                    // Center icons based on total count
                    let x: number, y: number;
                    
                    if (totalIcons <= 2) {
                        // For 1-2 icons: single row, centered
                        const startX = 700 - ((totalIcons - 1) * spacing) / 2;
                        x = startX + index * spacing;
                        y = 350;
                    } else if (totalIcons === 3) {
                        // For 3 icons: 2 on top, 1 centered below
                        if (index < 2) {
                            x = 670 + index * spacing;
                            y = 330;
                        } else {
                            x = 700; // centered
                            y = 390;
                        }
                    } else if (totalIcons === 4) {
                        // For 4 icons: 2x2 grid
                        const row = Math.floor(index / 2);
                        const col = index % 2;
                        x = 670 + col * spacing;
                        y = 330 + row * spacing;
                    } else {
                        // For 5+ icons: flexible grid
                        const cols = Math.ceil(Math.sqrt(totalIcons));
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const itemsInRow = Math.min(cols, totalIcons - row * cols);
                        const startX = 700 - ((itemsInRow - 1) * spacing) / 2;
                        x = startX + col * spacing;
                        y = 330 + row * spacing;
                    }

                    return (
                        <image
                            key={index}
                            href={`/sec/${tech}.png`}
                            x={x}
                            y={y}
                            height={iconSize}
                            width={iconSize}
                            filter={`url(#textGlow-${triangleId})`}
                        />
                    );
                })}
            </svg>
        </div>
 

        </div>
    );
};

const SecondSec: React.FC = () => {
    const [selectedTriangle, setSelectedTriangle] = useState<number>(1); // Default to first triangle
    const triangleRefs = useRef<(HTMLDivElement | null)[]>([]);
      const centcir = useRef<(SVGSVGElement | null)[]>([]);
    const handleTriangleClick = (triangleId: number): void => {
        setSelectedTriangle(triangleId);
    };
        const [isInView, setIsInView] = useState<boolean>(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    const currentTriangle = triangleConfigs.find(config => config.id === selectedTriangle);
const triangleWrapperRef = useRef<HTMLDivElement | null>(null);
const intriangleWrapperRef = useRef<HTMLDivElement | null>(null);
   // Viewport detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isInView) {
                    setIsInView(true);
                }
            },
            {
                threshold: 0.3,
                rootMargin: '-50px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [isInView]);

    useEffect(() => {
        if (!isInView) return;

        // Create a GSAP timeline
        const tl = gsap.timeline();
        
        const positions = [
            { x: 200, y: 80, rotate: 0, scale: 1 },     // Triangle 1
            { x: 395, y: 340, rotate: 125, scale: 1 }, // Triangle 2  
            { x: 90, y: 385, rotate: -125, scale: 1 }  // Triangle 3
        ];
        
        const initTrianglePositions = [
            { x: 210, y: 150, rotate: 0, scale: 1 },
            { x: 333, y: 305, rotate: 125, scale: 1 },
            { x: 150, y: 340, rotate: -125, scale: 1 }
        ];
        
        // Set initial positions for all triangles
        triangleRefs.current.forEach((ref, index) => {
            if (ref) {
                const ipos = initTrianglePositions[index];
                gsap.set(ref, {
                    x: ipos.x,
                    y: ipos.y,
                    rotation: ipos.rotate,
                    scale: ipos.scale,
                    opacity: 0,
                });
            }
        });
        

// inner tri
        tl.to(intriangleWrapperRef.current, {
    x:77,
    y:25,
 
  transformOrigin: "center center", // ✅ Critical line

});

// inner tri
        // Triangle 1 animation
        tl.to(
            triangleRefs.current[0],
            {
                x: 206,
                y: 170,
                // rotation: positions[0].rotate,
                scale: 0.7,
                opacity: 1,
                duration: 1.5,
                ease: "back.out(1.7)",
            },
            0 // Start at timeline position 0
        );
        
        // Triangle 2 animation
        tl.to(
            triangleRefs.current[1],
            {
                x: 314,
                y: 307,
                // rotation: positions[1].rotate,
                scale: 0.7,
                opacity: 1,
                duration: 1.5,
                ease: "back.out(1.7)",
            },
            0.3 // Start at timeline position 0.3 seconds
        );
        
        // Triangle 3 animation
        tl.to(
            triangleRefs.current[2],
            {
                x: 150,
                y: 335,
                // rotation: positions[2].rotate,
                scale: 0.7,
                opacity: 1,
                duration: 1.5,
                ease: "back.out(1.7)",
            },
            0.6 // Start at timeline position 0.6 seconds
        );
        // 2nd set triangle
// Triangle 1 animation
        tl.to(
            triangleRefs.current[0],
            {
                x: 206,
                y: 100,
                // rotation: positions[0].rotate,
                scale: 0.9,
                opacity: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
            },
            3 // Start at timeline position 0
        );

        tl.to(
            triangleRefs.current[0],
            {
                x: 200,
                y: 80,
                // rotation: positions[0].rotate,
                scale: 1,
                opacity: 1,
                duration: 0.3, delay:1.2,
                ease: "back.out(1.7)",
            },
            3.3 // Start at timeline position 0
        );
        
        // Triangle 2 animation
        tl.to(
            triangleRefs.current[1],
            {
                x: 345,
                y: 307,
                // rotation: positions[1].rotate,
                scale: 0.9,
                opacity: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
            },
            3 // Start at timeline position 0.3 seconds
        );


        tl.to(
            triangleRefs.current[1],
            {
                x: 395,
                y: 340,
                // rotation: positions[1].rotate,
                scale: 1,
                opacity: 1,
                duration: 0.3, delay:1.2,
                ease: "back.out(1.7)",
            },
            3.3 // Start at timeline position 0.3 seconds
        );


        
        // Triangle 3 animation
        tl.to(
            triangleRefs.current[2],
            {
                x: 135,
                y: 343,
                // rotation: positions[2].rotate,
                scale: 0.9,
                opacity: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
            },
            3 // Start at timeline position 0.6 seconds
        );

        tl.to(
            triangleRefs.current[2],
            {
                x: 90,
                y: 385,
                // rotation: positions[2].rotate,
                scale: 1,
                opacity: 1,
                duration: 0.3, delay:1.2,
                ease: "back.out(1.7)",
            },
            3.3 // Start at timeline position 0.6 seconds
        );


        // 2nd set triangle
        // rotate
tl.to(triangleWrapperRef.current, {
    x:5,
    y:5,
    
  rotation: 360 * 1,
  scale: 1,
  duration: 0.3,
  delay: 0.5,
  transformOrigin: "center center", // ✅ Critical line

}, 3.1);


        // rotate
        // Center circle setup and animation
        gsap.set(centcir.current, {
            x: 320, y: 360, scale: 5, opacity: 0
        });

        tl.to(
            centcir.current,
            {
                x: 400, y: 386, scale: 5, opacity: 1,
                 
                ease: "power2.inOut",
            },
            1 // Start at 1 second on the timeline
        );

        tl.to(
            centcir.current,
            {
                x: 401, y: 365, scale: 3, opacity: 1,
                duration: 0.3, 
                ease: "power2.inOut",
            },
            3 // Start at 1 second on the timeline
        );

        tl.to(
            centcir.current,
            {
                x: 396, y: 380, scale: 1, opacity: 1,
                duration: 0.3, delay:1.2,
                ease: "power2.inOut",
            },
            3.3 // Start at 1 second on the timeline
        );
        
    }, [isInView]);
    
    return (
        <div  ref={sectionRef} className="bg-black text-white h-screen w-screen relative flex">
            {/* Left section with triangles */}
            <div className="flex-1 relative transform-gpu origin-center"  ref={triangleWrapperRef}>
                <div ref={intriangleWrapperRef}>
                {triangleConfigs.map((config: TriangleConfig, index: number) => (
                    <div
                        key={config.id}
                        ref={(el: HTMLDivElement | null) => (triangleRefs.current[index] = el)}
                        className="absolute opacity-0"
                    >
                        <GlowingTriangle
                            techList={config.techList}
                            triangleId={config.id}
                            onClick={handleTriangleClick}
                            isSelected={selectedTriangle === config.id}
                        />
                    </div>
                ))}
                </div>
                {/* Single Central White Circle */}
               {/* <motion.div 
    className="absolute"
    initial={{ x: 620, y: 400, scale: 5, opacity: 1 }}
    // whileInView={{ x: 620, y: 400, scale: 5, opacity: 1 }}
    whileInView={{ x: 328, y: 350, scale: 1, opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
        duration: 100,
        type: "spring",
        stiffness: 100,
        delay: 0.8
    }}
> */}
<svg 
                    ref={centcir}
                        width="120" 
                        height="120" 
                        viewBox="5 -25 100 150" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            filter: "drop-shadow(0 0 15px rgba(255,255,255,0.8)) drop-shadow(0 0 30px rgba(255,255,255,0.4))"
                        }}
                        className='opacity-0'
                    >
                        <defs>
                            <filter id="circle-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur1" />
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
                                <feMerge>
                                    <feMergeNode in="blur1" />
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Outer circle (stroke) */}
                        <circle 
                            cx="52.125" 
                            cy="52.125" 
                            r="50.675" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="2.9" 
                            filter="url(#circle-glow)"
                        />
                        
                        {/* Inner circle (fill) */}
                        {/* <circle 
                            cx="52.125" 
                            cy="52.125" 
                            r="47.775" 
                            fill="#ffffff" 
                            fillOpacity="0.1"
                            filter="url(#circle-glow)"
                        /> */}
                    </svg>
                    
                {/* </motion.div> */}
            </div>
            
            {/* Right section */}
            <div className="flex-1 p-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-2xl">
                    {/* Dynamic Title */}
                    <motion.div 
                        className="text-center mb-12"
                        key={selectedTriangle}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ 
                            opacity: isInView ? 1 : 0, 
                            y: isInView ? 0 : -30 
                        }}
                        transition={{ 
                            duration: 0.6,
                            // delay: isInView ? 0.2 : 0
                        }}
                    >
                        <h2 className="text-4xl font-bold mb-2" style={{
                            textShadow: "0 0 20px rgba(255,255,255,0.5)"
                        }}>
                            Vimal
                        </h2>
                        <h3 className="text-2xl font-semibold" style={{
                            textShadow: "0 0 15px rgba(255,255,255,0.3)"
                        }}>
                            {currentTriangle?.title}
                        </h3>
                    </motion.div>
                    
                    {/* Dynamic Circular Skills Graph */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedTriangle}
                            className="grid grid-cols-2 gap-8 justify-items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isInView ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                duration: 0.3,
                                
                            }}
                        >
                            {currentTriangle?.skills.map((skill: Skill, index: number) => (
                                <CircularSkill 
                                    key={`${selectedTriangle}-${skill.name}`}
                                    skill={skill.name} 
                                    percentage={skill.percentage}
                                    delay={index * 0.2}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default SecondSec;