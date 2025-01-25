import Link from 'next/link';

const Nav = () => {

    

    return (
        <nav>
            <Link href="/" className='linkNav'>Home</Link>
            <a href="https://imrxng.github.io/portfolio/" className='linkNav'>Over me</a>
            <Link href="/blogs" className='linkNav'>Blogs</Link>
        </nav>
    );
};

export default Nav;
