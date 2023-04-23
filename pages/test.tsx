import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import styles from '@/styles/random_name_app.module.css'

function Layout({ children }) {
    return <div className={styles.container}>{children}</div>;
}

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <h1>First Post</h1>
      <h2>
        <Link href="/">← Back to home</Link>
        <p></p>
        <Link href="/random_name_app">← random_name_app</Link>
      </h2>
    </Layout>
  );
}