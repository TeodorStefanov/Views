import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const page = router.query;
  console.log(page);
  return <div>asd</div>;
};
export default Page;
