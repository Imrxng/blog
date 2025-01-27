import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

const NotFound = () => {
  return (
    <div>
        <Header />
        <div id='unauthorized'>
            <h1>404 - Page Not Found</h1>
        </div>
        <Footer />  
    </div>
  )
}

export default NotFound