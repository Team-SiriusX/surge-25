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
    const yOffset = distanceFromCenter * 90;
    const xOffset = side === 'left' ? -distance * 50 : distance * 50;

    return (
        <motion.div
            key={id}
            className={`absolute flex items-center gap-4 px-6 py-3 
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

            <div className={`flex flex-col mx-4 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                <span className="text-md lg:text-lg font-semibold text-white whitespace-nowrap">{name}</span>
                <span className="text-xs lg:text-sm text-neutral-400">{details}</span>
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
        <div className={`space-y-20 ${className}`}>
            <div className='flex flex-col xl:flex-row max-w-7xl mx-auto px-4 md:px-8 gap-12 justify-center items-center'>
                
                {/* Left Section - Feature Carousel (Hidden on mobile) */}
                <motion.div
                    className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center hidden xl:flex -left-14"
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
                <div className="flex flex-col text-center gap-4 max-w-md">
                    {currentItem && (
                        <div className="flex flex-col items-center justify-center gap-0 mt-4">
                            <motion.div 
                                className='p-3 bg-blue-500/20 border border-blue-500/40 rounded-full backdrop-blur-sm'
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
                                <currentItem.icon className="size-12 text-blue-400" />
                            </motion.div>
                            <motion.h3 
                                className="text-xl xl:text-2xl font-bold text-white mt-4"
                                key={currentItem.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentItem.name}
                            </motion.h3>
                            <motion.p 
                                className="text-sm xl:text-base text-neutral-400 mt-2 max-w-sm"
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
                    <div className="mt-6 relative max-w-lg mx-auto xl:mx-0">
                        <div className="px-3 flex items-center relative">
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
                                className="flex-grow outline-none text-white bg-white/5 px-4 placeholder-neutral-500 text-lg rounded-full border-neutral-700 pr-10 pl-10 py-3 cursor-pointer border backdrop-blur-sm focus:border-blue-500/50 transition-colors"
                            />
                            <Search className="absolute text-neutral-400 w-5 h-5 left-6 pointer-events-none" />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowDropdown(false);
                                        setIsPaused(false);
                                    }}
                                    className="absolute right-6 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown for search results */}
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-lg rounded-lg border border-neutral-800 z-20 max-h-60 overflow-y-auto shadow-xl">
                                {filteredItems.slice(0, 10).map((feature) => (
                                    <div
                                        key={feature.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelectFeature(feature.id, feature.name);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-500/10 transition-colors duration-150 rounded-lg m-2"
                                    >
                                        <feature.icon size={20} className="text-blue-400" />
                                        <span className="text-white font-medium">{feature.name}</span>
                                        <span className="ml-auto text-sm text-neutral-500">{feature.details}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Feature Carousel */}
                <motion.div
                    ref={rightSectionRef}
                    className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center -right-14"
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
