"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    LucideIcon,
    Briefcase,
    Users,
    MessageSquare,
    Target,
    BookOpen,
    Rocket,
    Trophy,
    UserCheck,
    X,
    Search,
} from 'lucide-react';

// --- Core Data Interface ---
export interface FeatureItem {
    id: string | number;
    name: string;
    icon: LucideIcon;
    details?: string;
}

// --- Internal Animated Type ---
type AnimatedFeatureItem = FeatureItem & {
    distanceFromCenter: number;
    originalIndex: number;
};

// --- Component Props Interfaces ---

interface CarouselItemProps {
    feature: AnimatedFeatureItem;
    side: 'left' | 'right';
}

interface FeatureCarouselProps {
    items: FeatureItem[];
    scrollSpeedMs?: number;
    visibleItemCount?: number;
    className?: string;
    onFeatureSelect?: (featureId: FeatureItem['id'], featureName: string) => void;
}

// --- Helper Components ---

const CarouselItemCard: React.FC<CarouselItemProps> = ({ feature, side }) => {
    const { distanceFromCenter, id, name, details, icon: Icon } = feature;
    const distance = Math.abs(distanceFromCenter);
    const opacity = 1 - distance / 4;
    const scale = 1 - distance * 0.1;

    // Tighter offsets on small screens to avoid clipping
    const isClient = typeof window !== 'undefined';
    const vw = isClient ? window.innerWidth : 1024;
    const xFactor = vw < 640 ? 28 : vw < 1024 ? 40 : 50;
    const yFactor = vw < 640 ? 70 : 90;
    const yOffset = distanceFromCenter * yFactor;
    const xOffset = (side === 'left' ? -1 : 1) * distance * xFactor;

    return (
        <motion.div
            key={id}
            className={`absolute flex max-w-[86vw] items-center gap-3 px-4 py-2 sm:max-w-none sm:gap-4 sm:px-6 sm:py-3 
                ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}
            animate={{
                opacity,
                scale,
                y: yOffset,
                x: xOffset,
            }}
            transition={{ 
                duration: 0.5, 
                ease: 'easeInOut',
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 }
            }}
        >
            <motion.div 
                className="rounded-full border border-blue-500/40 p-2 bg-blue-500/10 backdrop-blur-sm"
                animate={{
                    borderColor: distance === 0 ? ["rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.4)"] : "rgba(59, 130, 246, 0.4)",
                    backgroundColor: distance === 0 ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"] : "rgba(59, 130, 246, 0.1)",
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Icon className="size-8 text-blue-400" />
            </motion.div>

            <div className={`mx-3 flex max-w-[70vw] flex-col sm:mx-4 sm:max-w-xs ${side === 'left' ? 'text-right' : 'text-left'}`}>
                <span className="truncate text-sm font-semibold text-white sm:text-base lg:text-lg">{name}</span>
                <span className="text-[11px] leading-snug text-neutral-400 sm:text-xs lg:text-sm">{details}</span>
            </div>
        </motion.div>
    );
};

// --- Main Component ---

const FeatureCarousel: React.FC<FeatureCarouselProps> = ({
    items,
    scrollSpeedMs = 1500,
    visibleItemCount = 9,
    className = '',
    onFeatureSelect,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const rightSectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rightSectionRef, { margin: '-100px 0px -100px 0px' });
    const totalItems = items.length;

    // Auto-scroll effect
    useEffect(() => {
        if (isPaused || totalItems === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, scrollSpeedMs);

        return () => clearInterval(interval);
    }, [isPaused, totalItems, scrollSpeedMs]);

    // Pause on scroll
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleScroll = () => {
            setIsPaused(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsPaused(false);
            }, 500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    const getVisibleItems = useCallback((): AnimatedFeatureItem[] => {
        const visibleItems: AnimatedFeatureItem[] = [];
        if (totalItems === 0) return [];

        const itemsToShow = visibleItemCount % 2 === 0 ? visibleItemCount + 1 : visibleItemCount;
        const half = Math.floor(itemsToShow / 2);

        for (let i = -half; i <= half; i++) {
            let index = currentIndex + i;
            if (index < 0) index += totalItems;
            if (index >= totalItems) index -= totalItems;

            visibleItems.push({
                ...items[index],
                originalIndex: index,
                distanceFromCenter: i,
            });
        }
        return visibleItems;
    }, [currentIndex, items, totalItems, visibleItemCount]);

    const filteredItems = useMemo(() => {
        return items.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const handleSelectFeature = (id: FeatureItem['id'], name: string) => {
        const index = items.findIndex((f) => f.id === id);
        if (index !== -1) {
            setCurrentIndex(index);
            setIsPaused(true);
            if (onFeatureSelect) {
                onFeatureSelect(id, name);
            }
        }
        setSearchTerm(name);
        setShowDropdown(false);
    };

    const currentItem = items[currentIndex];

    return (
        <div className={`space-y-12 sm:space-y-16 md:space-y-20 ${className}`}>
            <div className='flex flex-col xl:flex-row max-w-7xl mx-auto px-4 sm:px-6 md:px-8 gap-8 sm:gap-10 md:gap-12 justify-center items-center'>
                
                {/* Left Section - Feature Carousel (Hidden on mobile) */}
                <motion.div
                    className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center hidden xl:flex xl:-left-14"
                    onMouseEnter={() => !searchTerm && setIsPaused(true)}
                    onMouseLeave={() => !searchTerm && setIsPaused(false)}
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }}
                >
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-black to-transparent"></div>
                        <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-black to-transparent"></div>
                    </div>

                    {getVisibleItems().map((feature) => (
                        <CarouselItemCard
                            key={feature.id}
                            feature={feature}
                            side="left"
                        />
                    ))}
                </motion.div>

                {/* Middle Section - Current Feature Display */}
                <div className="flex flex-col text-center gap-3 w-full max-w-md sm:gap-4">
                    {currentItem && (
                        <div className="flex flex-col items-center justify-center gap-0 mt-2 sm:mt-4">
                            <motion.div 
                                className='p-2.5 bg-blue-500/20 border border-blue-500/40 rounded-full backdrop-blur-sm sm:p-3'
                                animate={{
                                    y: [0, -10, 0],
                                    borderColor: ["rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.4)"],
                                    boxShadow: [
                                        "0 0 20px rgba(59, 130, 246, 0.2)",
                                        "0 0 40px rgba(59, 130, 246, 0.4)",
                                        "0 0 20px rgba(59, 130, 246, 0.2)"
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <currentItem.icon className="size-10 text-blue-400 sm:size-12" />
                            </motion.div>
                            <motion.h3 
                                className="text-lg font-bold text-white mt-3 sm:text-xl sm:mt-4 xl:text-2xl"
                                key={currentItem.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentItem.name}
                            </motion.h3>
                            <motion.p 
                                className="text-xs text-neutral-400 mt-2 max-w-sm px-2 leading-relaxed sm:text-sm sm:px-0 xl:text-base"
                                key={`${currentItem.id}-desc`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                {currentItem.details || 'Explore this feature'}
                            </motion.p>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="mt-4 relative w-full mx-auto sm:mt-6 xl:mx-0">
                        <div className="px-2 flex items-center relative sm:px-3">
                            <input
                                type="text"
                                value={searchTerm}
                                placeholder="Search Features..."
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchTerm(val);
                                    setShowDropdown(val.length > 0);
                                    if (val === '') setIsPaused(false);
                                }}
                                onFocus={() => {
                                    if (searchTerm.length > 0) setShowDropdown(true);
                                    setIsPaused(true);
                                }}
                                onBlur={() => {
                                    setTimeout(() => setShowDropdown(false), 200);
                                }}
                                className="flex-grow outline-none text-white bg-white/5 px-4 placeholder-neutral-500 text-sm rounded-full border-neutral-700 pr-10 pl-9 py-2.5 cursor-pointer border backdrop-blur-sm focus:border-blue-500/50 transition-colors sm:text-base sm:py-3 sm:pl-10"
                            />
                            <Search className="absolute text-neutral-400 w-4 h-4 left-5 pointer-events-none sm:w-5 sm:h-5 sm:left-6" />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowDropdown(false);
                                        setIsPaused(false);
                                    }}
                                    className="absolute right-5 text-neutral-400 hover:text-white transition-colors sm:right-6"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown for search results */}
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute left-2 right-2 mt-2 bg-neutral-900/95 backdrop-blur-lg rounded-lg border border-neutral-800 z-20 max-h-60 overflow-y-auto shadow-xl sm:left-3 sm:right-3">
                                {filteredItems.slice(0, 10).map((feature) => (
                                    <div
                                        key={feature.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelectFeature(feature.id, feature.name);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-blue-500/10 transition-colors duration-150 rounded-lg m-1.5 sm:gap-3 sm:px-4 sm:py-3 sm:m-2"
                                    >
                                        <feature.icon size={18} className="text-blue-400 flex-shrink-0 sm:size-5" />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-sm text-white font-medium truncate sm:text-base">{feature.name}</span>
                                            <span className="text-xs text-neutral-500 truncate sm:text-sm">{feature.details}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Feature Carousel */}
                <motion.div
                    ref={rightSectionRef}
                    className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center xl:-right-14"
                    onMouseEnter={() => !searchTerm && setIsPaused(true)}
                    onMouseLeave={() => !searchTerm && setIsPaused(false)}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }}
                >
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-black to-transparent"></div>
                        <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-black to-transparent"></div>
                    </div>

                    {getVisibleItems().map((feature) => (
                        <CarouselItemCard
                            key={feature.id}
                            feature={feature}
                            side="right"
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FeatureCarousel;
