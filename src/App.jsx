import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import './App.css'

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero />
    </div>
  );
}

function BlogAdmin() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Mode Administration</h1>
      <Hero />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 theme-sakura bg-page text-textmain font-cute transition-colors duration-500">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogAdmin />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App