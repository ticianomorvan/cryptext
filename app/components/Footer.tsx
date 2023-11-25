import { IconHeartFilled } from "@tabler/icons-react";
import packageJson from "../../package.json";

export default function Footer() {
  return (
    <footer className="flex w-full flex-wrap items-center justify-center gap-2 border-t border-t-gray-800 bg-white p-2">
      <p>Cryptext v{packageJson.version ?? 1}</p>
      <span className="hidden sm:block">{"-"}</span>
      <span className="flex items-center gap-1">
        <p>With</p>
        <IconHeartFilled className="text-red-600" />
        <p>by</p>
        <a
          href="https://ticianomorvan.com.ar"
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-600"
        >
          Ticiano Morvan
        </a>
      </span>
    </footer>
  );
}
