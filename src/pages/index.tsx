import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { GetStaticProps } from 'next';
import React from 'react';

// export const getStaticProps: GetStaticProps = () => {

// }

const Index = () => {
  return (
    <div>
      <Header />
      <div id='intro'>
        <h1>Welkom op mijn Stageblog!</h1>
        <p>Volg mijn reis bij Brightest in test automation, waar ik werk aan het project: Mobiel event planner.</p>
      </div>
      <div id='about'>
        <h2>Over Mijn Stage</h2>
        <div>
          <p>
            Tijdens mijn stage bij Brightest duik ik in de wereld van test automation en werk ik aan een uitdagend project genaamd "Mobiel Event Planner".
            In deze blog deel ik mijn ervaringen, uitdagingen en inzichten.
          </p>
          <img src="./images/brightest.webp" alt="brightest-logo" />
        </div>
      </div>
      <div id='why'>
        <h2>Waarom deze blog?</h2>
        <ul>
          <li>Om mijn leerproces en groei te documenteren.</li>
          <li>Mentoren en begeleiders op de hoogte te houden van mijn voortgang.</li>
          <li>Interessante uitdagingen en successen te delen.</li>
        </ul>
      </div>
      <div id='blog'>
        <h2>Laatste Blogpost</h2>
        <article>
          <h3>Mijn eerste week: een nieuwe start</h3>
          <p>
            In mijn eerste week maakte ik kennis met het team en begon ik met het opzetten van de testomgeving.
            Het was uitdagend, maar ontzettend leerzaam!
          </p>
          <a href="/blog/first-week">Lees verder ➡️</a>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
