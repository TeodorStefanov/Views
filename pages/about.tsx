import { useRouter } from "next/router";
import Link from "next/link";
const About = () => {
  const router = useRouter();
  const page = router.query;
  console.log(page);
  return (
    <div>
      <title>about2</title>

      <h1>about</h1>
      <ul>
        <li>
          <Link href="/">Go back</Link>
        </li>
      </ul>
    </div>
  );
};
export default About;
