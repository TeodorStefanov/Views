import Link from "next/link";
export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/about">Go to about</Link>
          <Link href="/about">Go to about</Link>
        </li>
      </ul>
    </div>
  );
}
