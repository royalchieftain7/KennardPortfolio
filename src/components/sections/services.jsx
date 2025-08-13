import { RiGlobalFill, RiQuillPenLine, RiMovie2Fill } from '@remixicon/react'
import React from 'react'

const Services = () => {
    return (
        <section id="services" className="services-area">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <div className="section-title mb-40 wow fadeInUp delay-0-2s">
                                <h2>Services</h2>
                                <p>My services deliver outstanding experiences, where dedication and excellence shape every interaction."</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Card description={"Crafts the visual and strategic elements that make your brand instantly recognizable and unforgettable."} icon={<RiQuillPenLine size={55} />} title={"Brand Identity Design"} />
                        <Card description={"Builds functional, responsive, and beautiful websites that bring your vision to life online."} icon={<RiGlobalFill size={55}/>} title={"Web Development"} />
                        <Card description={"Transforms raw footage into captivating stories that engage, inspire, and leave a lasting impact."} icon={<RiMovie2Fill size={55}/>} title={"Video Editing"} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services

const Card = ({ title, description, icon }) => {
    return (
        <div className="col-lg-4 col-md-4">
            <div className="service-item wow fadeInUp delay-0-2s">
                <div className="content">
                    <i>{icon}</i>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}