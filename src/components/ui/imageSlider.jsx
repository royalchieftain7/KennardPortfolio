import { RiArrowLeftFill, RiArrowLeftLine, RiArrowLeftSLine, RiArrowRightSLine, RiCloseFill } from '@remixicon/react';
import React, { useState, useEffect } from 'react';

const ImageSlider = ({ images, isOpen, onClose, currentIndex }) => {
    const [currentSlide, setCurrentSlide] = useState(currentIndex);

    useEffect(() => {
        setCurrentSlide(currentIndex);
    }, [currentIndex, isOpen]);

    if (!isOpen || !images || images.length === 0) return null;

    const nextSlide = () => {
        setCurrentSlide((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="slider-overlay">
            <div className="slider-container">
                <button className="close-button" onClick={onClose}> <RiCloseFill size={25} /> </button>
                <div className="slider">
                    <button className="prev-button" onClick={prevSlide}> <RiArrowLeftSLine size={25}/> </button>
                    {images[currentSlide].isVideo ||
                    (images[currentSlide].src && images[currentSlide].src.toLowerCase().endsWith(".mp4")) ? (
                        <video
                            src={images[currentSlide].src || images[currentSlide]}
                            controls
                            className="slider-image"
                            style={{ maxHeight: "90vh", objectFit: "contain", width: "100%" }}
                        />
                    ) : (
                        <img
                            src={images[currentSlide].src || images[currentSlide]}
                            alt={images[currentSlide].alt || "Slider"}
                            className="slider-image"
                            style={{ maxHeight: "90vh", objectFit: "contain" }}
                        />
                    )}
                    <button className="next-button" onClick={nextSlide}><RiArrowRightSLine size={25}/></button>
                </div>
                <div style={{ textAlign: "center", marginTop: 8, color: "#fff" }}>
                    {currentSlide + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;
