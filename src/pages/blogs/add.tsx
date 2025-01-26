import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { MongoClient } from 'mongodb';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Blog } from '../../../types';

interface AddProps {
  isLoggedIn: boolean;
}

export const getServerSideProps: GetServerSideProps<AddProps> = async (context) => {
  const { req } = context;
  const cookies = req.headers.cookie || '';
  const loggedIn = cookies.includes('loggedIn=true');

  return {
    props: {
      isLoggedIn: loggedIn,
    },
  };
}
const Add = ({ isLoggedIn }: AddProps) => {
  const [title, setTitle] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [categories, setCategories] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <div id='unauthorized'>
          <h1>401 Unauthorized</h1>
        </div>
        <Footer />
      </>
    );
  }

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (title === "" || categories === "" || description === "") {
      setError("Vul alle velden in!");
    } else {
      
      const blog: Blog = {
        title: title,
        description: description,
        image: image != "" ? image : undefined,
        category: categories.split(","),
        date: new Date().toISOString(),
      };

      const response = await fetch('/api/add-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog: blog }),
      });
  
      if (response.status === 200) {
        setError("Blog is opgeslagen!");
        setTitle("");
        setImage("");
        setCategories("");
        setDescription("");
        
      } 
    }
  };

  return (
    <div>
      <Header />
      <div id='add-blog'>
        <h1>Blog Toevoegen</h1>
        <div id='form'>
          <div>
            <div className='input'>
              <label htmlFor="title">Titel: </label>
              <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value )} id="title" />
            </div><br />
            <div className='input'>
              <label htmlFor="image">Foto: </label>
              <input type="text" name="foto" id="foto" value={image} onChange={(e) => setImage(e.target.value )}/>
            </div><br />
            <div className='input'>
              <label htmlFor="categories">Categories: </label>
              <input type="text" name="categories" value={categories} onChange={(e) => setCategories(e.target.value )} id="categories" />
            </div>
          </div>
          <div className='textareaInput'>
            <label htmlFor="bericht">Bericht: </label>
            <textarea name="bericht" id="bericht" rows={5} cols={50} onChange={(e) => setDescription(e.target.value)}>{description}</textarea>
          </div>
        </div>
        <button id='opslaanButton' onClick={clickHandler}>Opslaan</button>
        <p id='errorTekst'>{error && error}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Add