import Footer from "../footer";
import Header from "../header";
import styles from "./index.module.css";
const Layout = (props: any) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{props.children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
