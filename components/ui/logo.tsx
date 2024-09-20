import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="Cruip">
      <Image src="/images/728logo.png" alt="728 Logo" width={60} height={60} />
    </Link>
  );
}
