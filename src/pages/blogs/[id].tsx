import { MongoClient, ObjectId } from 'mongodb';
import React from 'react'
import { Blog } from '../../../types';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Paths extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<Paths> = async () => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');
  const blogs = await collection.find({}).toArray();
  await client.close();

  const paths: { params: { id: string } }[] = blogs.map((blog) => ({
    params: { id: blog._id.toString() }
  }));
  return {
    paths: paths,
    fallback: 'blocking'  }
};

interface BlogDetailProps {
  blog: Blog;
}

export const getStaticProps: GetStaticProps<BlogDetailProps, Paths> = async (context) => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const database = client.db('portfolio');
  const collection = database.collection('blogs');
  const blog = await collection.findOne({ _id: new ObjectId(context.params?.id) });
  await client.close();

  if (!blog) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blog: {
        title: blog.title,
        description: blog.description,
        _id: blog._id.toString(),
        image: blog.image , 
        category: blog.category,
        date: blog.date,
      },
    },
  };
};

const BlogDetail = ({ blog }: BlogDetailProps) => {
  console.log(blog.image)
  return (
    <div>
      <Header />
      <div id='blog-detail'>
        <h1>{blog.title}</h1>
        <div id='blog-detail-content'>
          <div>
          <p>{blog.description}</p>
          {blog.image ? <img src={blog.image} alt={blog.title} /> : null}
          </div>
          <p className='little' id='top-margin'>
            Tags: {blog.category.map((categorie) =>
              '#' + categorie + ' '
            )}
          </p>
          <p className='little'>Geplaatst op {new Date(blog.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BlogDetail