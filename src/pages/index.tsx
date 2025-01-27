import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { GetStaticProps } from 'next';
import React from 'react';
import { Blog } from '../../types';
import { MongoClient } from 'mongodb';

interface BlogProps {
  blogs: Blog[];
}

export const getStaticProps: GetStaticProps = async () => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');
  const blogs = await collection.find({}).sort({ date: -1 }).limit(4).toArray();
  await client.close();

  return {
    props: {
      blogs: JSON.parse(JSON.stringify(blogs))
    }
  };
}

const Index = ({ blogs }: BlogProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div>
      <Header />
      <div id='intro'>
        <h1>Welkom op mijn Stageblog!</h1>
        <p>Volg mijn reis bij Brightest in test automation, waar ik werk aan het project: Mobiel event planner.</p>
      </div>
      <div id='about'>
    <h2>Over Mijn Stage</h2>
    <div className="content-section">
        <p>
            Tijdens mijn stage bij Brightest duik ik in de wereld van test automation en werk ik aan een uitdagend project genaamd "Mobiel Event Planner".
            In deze blog deel ik mijn ervaringen, uitdagingen en inzichten.
        </p>
        <img src="./images/brightest.webp" alt="brightest-logo" />
    </div>
    <h3>Over Brightest</h3>
    <div className='overBrightestCenter'>
      <p id='overBrightest'>
          Brightest is een innovatief technologiebedrijf gevestigd in Kontich. Ze richten zich op test automation en bieden krachtige oplossingen voor bedrijven
          die streven naar efficiëntie en kwaliteit in hun processen. Tijdens mijn stage krijg ik de kans om met hun geavanceerde tools en technologieën te werken
          om de kwaliteit van mobiele applicaties te verbeteren.
      </p>
    </div>
    <h3>Mijn Rol bij Brightest</h3>
    <div className='overBrightestCenter'>
    <p id='overBrightest'>
        Als stagiair test automation werk ik aan het project 'Mobiel Event Planner'. Mijn verantwoordelijkheden omvatten het automatiseren van tests,
        het schrijven van scripts en het zorgen voor de betrouwbaarheid van de applicatie. Ik ben betrokken bij verschillende fasen van het project,
        van planning tot uitvoering.
    </p>
    </div>
    <h3>Over Mij</h3>
    <div className="content-section">
        <p>
            Ik ben een gepassioneerde student programmeren met een focus op softwareontwikkeling en automatisering. Tijdens mijn opleiding aan de AP Hogeschool
            heb ik diepgaande kennis opgedaan van verschillende programmeertalen en technologieën. Buiten mijn studie ben ik actief op LinkedIn, waar ik
            mijn netwerk uitbreid en mijn professionele groei deel.
        </p>
        
        <img src="./images/ik.jpg" alt="foto van mij" />
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
        <h2>Recente blogs</h2>
        <div id='blogList'>
          {blogs.length > 0 ? blogs.map((blog) => (
            <div key={blog._id} className='blogCard'>
              <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{blog.title}</h2>
              <article>
                <p>{truncateText(blog.description, 70)}</p>
                <a href={`/blogs/${blog._id}`}>Lees verder ➡️</a>
              </article>
            </div>
          )) : <p>Geen blogs gevonden.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
