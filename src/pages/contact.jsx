import React from 'react'
import PageHeading from '../components/sections/pageHeading'
import { ScrollRestoration } from 'react-router-dom'
import ContactForm from '../components/sections/contactForm'

const Contact = () => {
    return (
        <>
            <PageHeading
                heading={"Let’s Connect"}
                description={"Drop your details in the form below and let’s start the conversation. I’m eager to hear about your ideas or opportunities, and I’ll get back to you within 24 hours."}
            />
            <ContactForm />
            <ScrollRestoration />
        </>
    )
}

export default Contact