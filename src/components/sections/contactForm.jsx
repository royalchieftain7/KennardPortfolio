import React, { useState } from 'react'
import { RiMailLine, RiMailOpenLine } from '@remixicon/react'
import emailjs from "emailjs-com";

const SERVICE_ID = "service_ly4egvl";
const TEMPLATE_ID = "template_5azl2el";
const USER_ID = "p8PvgIAF2Xo_x13As";

const ContactForm = () => {
    const [form, setForm] = useState({ fullName: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    message: form.message,
                    email: form.email,
                    fullName: form.fullName,
                },
                USER_ID
            );
            setSuccess("Message sent successfully!");
            setForm({ fullName: "", email: "", message: "" });
        } catch (err) {
            setError("Failed to send message. Please try again.");
        }
        setLoading(false);
    };

    return (
        <section id="contact" className="contact-area">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        {/* <!-- START CONTACT FORM DESIGN AREA --> */}
                        <div className="col-lg-12">
                            <ul className="extra-skills wow fadeInUp delay-0-2s pb-30" style={{ display: "flex", flexDirection: "row", gap: "2rem", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                                <li style={{ display: "inline-flex", alignItems: "center", listStyle: "none" }}>
                                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 24, width: 24 }}>
                                    <svg className="feather feather-phone" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                  </span>
                                  <span style={{ marginLeft: 8, display: "inline" }}>Number: +639569662480</span>
                                </li>
                                <li style={{ display: "inline-flex", alignItems: "center", listStyle: "none" }}><i><RiMailOpenLine size={16} /></i>Email: kennardodavinci@gmail.com</li>
                            </ul>
                            <div className="contact-form contact-form-area wow fadeInUp delay-0-4s">
                                <form id="contactForm" className="contactForm" name="contactForm" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Full Name</label>
                                                <input type="text" id="name" name="fullName" className="form-control" value={form.fullName} onChange={handleChange} placeholder="Steve Milner" required data-error="Please enter your Name" />
                                                <label htmlFor="name" className="for-icon"><i className="far fa-user"></i></label>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input type="email" id="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="hello@websitename.com" required data-error="Please enter your Email" />
                                                <label htmlFor="email" className="for-icon"><i className="far fa-envelope"></i></label>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="message">Your Message</label>
                                                <textarea name="message" id="message" className="form-control" rows="4" value={form.message} onChange={handleChange} placeholder="Write Your message" required data-error="Please Write your Message"></textarea>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group mb-0">
                                                <button type="submit" className="theme-btn" disabled={loading}>
                                                    {loading ? "Sending..." : "Send Me Message"} <i><RiMailLine size={16} /></i>
                                                </button>
                                                {success && <div style={{ color: "limegreen", marginTop: 8 }}>{success}</div>}
                                                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* <!-- / END CONTACT FORM DESIGN AREA --> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactForm