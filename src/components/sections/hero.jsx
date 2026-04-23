import React from 'react'
import profile from "../../assets/images/about/ken-lapitan-dp2.webp"
import cvFile from "../../assets/images/CV Kennard Lapitan 2026.pdf"
import { RiDownloadLine } from '@remixicon/react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <section id="home" className="main-hero-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4">
                        <div className="glitch">
                            <img src={profile} alt="About Me" />
                        </div>
                    </div>
                    <div className="col-lg-8">
                        {/* <!-- START HERO DESIGN AREA --> */}
                        <div className="hero-content wow fadeInUp delay-0-2s">
                            <h1>I’m a graphic designer, video editor, and web developer. Basically three job titles and one sleep schedule.</h1>
                            <h2>Hi, I’m Kennard Lapitan, freelance designer with 7+ years of experience creating polished app interfaces and eye-catching visuals. </h2>
                            <div className="hero-btns">
                                <a
                                    href={cvFile}
                                    className="theme-btn"
                                    download
                                >
                                    Download CV <i><RiDownloadLine size={16}/></i>
                                </a>
                            </div>
                        </div>
                        {/* <!-- / END HERO DESIGN AREA --> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
