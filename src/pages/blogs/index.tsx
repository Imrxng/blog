import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Blog } from '../../../types';
import { MongoClient } from 'mongodb';
import { FaCaretLeft, FaCaretRight, FaLock, FaLockOpen } from "react-icons/fa";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

interface BlogProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  loggedIn2: boolean;
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async (context) => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');

  const blogsPerPage = 8;
  const currentPage = parseInt((context.query.page as string) || '1');
  const totalBlogs = await collection.countDocuments();
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const blogs = await collection
    .find({})
    .skip((currentPage - 1) * blogsPerPage)
    .limit(blogsPerPage)
    .toArray();
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
    date: new Date(blog.date).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));

  return {
    props: {
      blogs: transformedBlogs,
      currentPage,
      totalPages,
      loggedIn2: loggedIn,
    },
  };
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Index = ({ blogs, currentPage, totalPages, loggedIn2 }: BlogProps) => {
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
        body: JSON.stringify({ password: password }),
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
      window.location.href = '/blogs/add';
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      window.location.href = `/blogs/?page=${currentPage + 1}`;
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      window.location.href = `/blogs/?page=${currentPage - 1}`;
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div id="blogPage">
        <button
          onClick={clickHandler}
          style={{ cursor: loggedIn || loggedIn2 ? 'pointer' : 'not-allowed' }}
          id="blogAdd"
        >
          Toevoegen <span>+</span>
        </button>
        {loggedIn || loggedIn2 ? (
          <FaLockOpen className="lock" />
        ) : (
          <FaLock className="lock" />
        )}
        {
          !loggedIn && !loggedIn2 && (<input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={submitHandler}
          />)
        }
        <h1>Mijn Blogs</h1>
        <div id="blogs">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
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
        <div id="pagination" style={{paddingTop: blogs.length <= 4 ? "10rem" : 0}}>
          <p>
            {currentPage} - {totalPages}
          </p>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <FaCaretLeft
                key="prevIcon"
              style={{
                color: currentPage === 1 ? '#dcf763b8' : '#dcf763',
                paddingTop: 1,
              }}
            />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <FaCaretRight
                key="nextIcon"
              style={{
                color: currentPage === totalPages ? '#dcf763b8' : '#dcf763',
                paddingTop: 1,
              }}
            />
          </button>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Index;
