import styles from "./styles.module.css";

// https://github.com/facebook/docusaurus/discussions/4633
export default function Figure({ src, alt, caption }) {
  return (
    <div>
      <figure>
        <img src={src} alt={alt} />
        <figcaption className={styles.figcaption}>{caption}</figcaption>
        {/* <figcaption className={styles.figcaption}>Test</figcaption> */}
      </figure>
    </div>
  );
}
