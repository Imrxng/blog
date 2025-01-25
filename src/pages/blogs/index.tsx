import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import { Blog } from '../../../types';
import { MongoClient } from 'mongodb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BlogProps {
  blogs: Blog[];
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');
  const blogs = await collection.find({}).toArray();
  await client.close();

  const transformedBlogs: Blog[] = blogs.map((blog) => ({
    _id: blog._id?.toString(),
    title: blog.title,
    description: blog.description,
    image: blog.image,
    category: blog.category,
    date: new Date(blog.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })
  }));
  return (
    {
      props: {
        blogs: transformedBlogs
      }
    }
  )
};
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Index = ({ blogs }: BlogProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const submitHandler: React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
    if (event.key === 'Enter') {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password:password }),
      });
  
      const data = await response.json();
      if (response.status === 200) {
        setLoggedIn(true);
        setPassword("");
      } 
    }
  };

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (loggedIn) {
      router.push('/add-blog');
    }
  };

  return (
    <>
      <Header />
      <div id="blogPage">
        <button onClick={clickHandler} style={{cursor: loggedIn ? 'pointer' : 'not-allowed'}} id='blogAdd'>Toevoegen <span>+</span></button>
        <input type="password"  id="password" value={password} onChange={ (e) => setPassword(e.target.value) } onKeyDown={submitHandler}/>
        <h1>Mijn Blogs</h1>
        <div id="blogs">
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              return (
                <div className="blogCard" key={blog._id}>
                  <h2>{blog.title}</h2>
                  <p>{truncateText(blog.description, 50)}</p>
                  <Link href={`/blog/${blog._id}`}>Lees meer</Link>
                  <p id='tags'><span>Tags:</span> {blog.category.join(', ')}</p>
                  <p id='date'>Geplaats op {blog.date.toString()}</p>
                </div>
              );
            })
          ) : (
            <p>No blogs found</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;