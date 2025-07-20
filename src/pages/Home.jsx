import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Hero from '../components/Hero';

const Home = () => {
  useDocumentTitle('Home - Micro Task Platform');

  return (
    <div>
      <Hero />
    </div>
  );
};

export default Home;