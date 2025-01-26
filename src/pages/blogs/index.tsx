import { GetServerSideProps } from 'next'
import React, {  useState } from 'react'
import { Blog } from '../../../types';
import { MongoClient } from 'mongodb';
import { FaCaretLeft, FaCaretRight, FaLock, FaLockOpen } from "react-icons/fa";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BlogProps {
  blogs: Blog[];
  loggedIn2: boolean;
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async (context) => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');
  const blogs = await collection.find({}).toArray();
  await client.close();
  const { req } = context;

  const cookies = req.headers.cookie || '';
  const loggedIn = cookies.includes('loggedIn=true');

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
        blogs: transformedBlogs,
        loggedIn2: loggedIn
      }
    }
  )
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Index = ({ blogs, loggedIn2 }: BlogProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false); 
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
  
      if (response.status === 200) {
        setLoggedIn(true);
        document.cookie = "loggedIn=true; path=/; max-age=86400; secure; samesite=strict";
        setPassword("");
      } 
    }
  };


  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (loggedIn || loggedIn2) { 
      router.push('/blogs/add');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <Header />
      <div id="blogPage">
        <button onClick={clickHandler} style={{cursor: loggedIn || loggedIn2 ? 'pointer' : 'not-allowed'}} id='blogAdd'>Toevoegen <span>+</span></button>
        {loggedIn || loggedIn2 ? <FaLockOpen className="lock" /> : <FaLock className="lock" />}  
        <input type="password"  id="password" value={password} onChange={ (e) => setPassword(e.target.value) } onKeyDown={submitHandler}/>
        <h1>Mijn Blogs</h1>
        <div id="blogs">
        {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <div className="blogCard" key={blog._id?.toString()}>
                <h2>{blog.title}</h2>
                <p>{truncateText(blog.description, 50)}</p>
                <a href={`/blogs/${blog._id}`}>Lees meer</a>
                <p id="tags">
                  <span>Tags:</span> {blog.category.join(', ')}
                </p>
                <p id="date">Geplaatst op {blog.date}</p>
              </div>
            ))
          ) : (
            <p>No blogs found</p>
          )}
        
      </div>
      <div id="pagination">
          <p>
            {currentPage} - {totalPages}
          </p><button onClick={handlePrevPage} disabled={currentPage === 1}>
            <FaCaretLeft style={{ color: currentPage === 1 ? "#dcf763b8" : "#dcf763",  paddingTop: 1 }} />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <FaCaretRight style={{ color: currentPage === totalPages ? "#dcf763b8" : "#dcf763", paddingTop: 1 }} />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;