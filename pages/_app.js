import './styles.css'; // Import global styles
import './styles.module.css'; // Import component-level styles

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
