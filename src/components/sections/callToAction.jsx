import { RiDownloadLine } from '@remixicon/react'
import React from 'react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
    return (
        <section className="call-to-action-area">
            <div className="container">
                <div className="row">
                    {/* <!-- START ABOUT TEXT DESIGN AREA --> */}
                    <div className="col-lg-12">
                        <div className="call-to-action-part wow fadeInUp delay-0-2s text-center">
                            <h2>Ready to bring your project to life?</h2>
                            <p>Let’s connect and make it a reality ✨. I’m also open to full-time or part-time roles where I can push creative boundaries and deliver outstanding results.</p>
                            <div className="hero-btns">
                                <Link to="/contact" className="theme-btn call-to-action-button">Let's Talk <i><RiDownloadLine size={16}/></i></Link>
                            </div>
                        </div>
                    </div>
                    {/* <!-- / END ABOUT TEXT DESIGN AREA --> */}
                </div>
            </div>
        </section>
    )
}

export default CallToAction