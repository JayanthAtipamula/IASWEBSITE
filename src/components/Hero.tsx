import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners, Banner } from '../services/bannerService';
import LoadingScreen from './LoadingScreen';
import { getProxiedImageUrl } from '../utils/imageUtils';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback banners in case Firebase data is not available
  const fallbackBanners = [
    {
      id: '1',
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2070",
      link: "/study-materials",
      title: "",
      order: 0,
      active: true,
      createdAt: Date.now()
    },
    {
      id: '2',
      imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=2070",
      link: "/mock-tests",
      title: "",
      order: 1,
      active: true,
      createdAt: Date.now()
    }
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const fetchedBanners = await getActiveBanners();
        
        if (fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        } else {
          console.log('No active banners found, using fallback banners');
          setBanners(fallbackBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners(fallbackBanners);
      } finally {
        // Add a small delay to show loading animation
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[50vh] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No banners available</div>
      </section>
    );
  }

  return (
    <section className="relative h-[50vh]">
      {/* Banner Images */}
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <a href={banner.link} className="block h-full">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
              style={{ backgroundImage: `url(${getProxiedImageUrl(banner.imageUrl)})` }}
            />
          </a>
        </motion.div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((banner, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;