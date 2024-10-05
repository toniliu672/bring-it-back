"use client"

import Head from 'next/head';
import { SEOProps } from '@/interfaces/componentsInterface';

const SEO: React.FC<SEOProps> = ({ title, description, canonical, ogImage }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content="Your Site Name" />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}
  </Head>
);

export default SEO;