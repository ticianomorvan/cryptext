import { IconHeartFilled } from "@tabler/icons-react"
import packageJson from "../../package.json"

export default function Footer() {
  return (
    <footer className="w-full flex flex-wrap p-4 gap-2 items-center justify-center bg-white border-t border-t-gray-800">
      <p>Cryptext v{packageJson.version ?? 1}</p>
      <span className="hidden sm:block">{'-'}</span>
      <span className="flex gap-1 items-center">
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
  )
}