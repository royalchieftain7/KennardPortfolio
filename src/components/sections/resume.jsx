import React from 'react'

const Resume = () => {
    return (
        <div className="resume-area" id="resume">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <div className="section-title mb-40 wow fadeInUp delay-0-2s">
                                <h2>Work Experience</h2>
                                <p>Established history of success in design and development, consistently delivering valuable insights and driving significant results.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-10">
                            <div className="resume-wrapper wow fadeInUp delay-0-2s">
                                <Card year={"2024 - Present"} title={"@ Multimedia Designer/Web Developer"} institution={"J Wayne Lowry Consulting LLC"} description={"As a multimedia designer for a digital marketing agency, I produced a wide range of graphics, including static ads, YouTube videos, reels, and posters, for use across social media platforms and websites. I also built client websites using Elementor for WordPress, as well as platforms like GoHighLevel and Brilliant Directories. By combining engaging visual content with functional, user-friendly websites, I helped clients strengthen their online presence and achieve their marketing goals."} />
                                <Card year={"2021 - 2024"} title={"@ Graphic Designer"} institution={"Affinity Express, Inc."} description={"At a marketing agency, I worked as a graphic designer responsible for creating designs for both web and print advertisements. I ensured that all materials met precise brand specifications, and I carefully checked and proofread my work to maintain accuracy and consistency. My attention to detail and commitment to brand integrity helped deliver high-quality campaigns that resonated with the target audience."} />
                                <Card year={"2018 - 2021"} title={"@ Graphic Designer"} institution={"Llemich Digital Imaging"} description={"As a senior graphic designer, I designed layouts and graphics for our company’s website and social media pages, ensuring a cohesive and engaging visual identity. I also mentored junior graphic designers, helping them adapt to our company’s high standards of creativity and technical competency. My combined design expertise and leadership skills contributed to elevating the team’s overall output and brand presence."} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resume

const Card = ({ year, description, title, institution }) => {
    return (
        <div className="resume-box">
            <span className="resume-date">{year}</span>
            <h5 className="fw-medium">{institution}</h5>
            <span>{title}</span>
            <p>{description}</p>
        </div>
    )
}