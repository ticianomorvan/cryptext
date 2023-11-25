import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { IconPencil, IconMessageCircle2Filled } from "@tabler/icons-react";
import Features from "~/components/Feature";

export const meta: MetaFunction = () => {
  return [
    { title: "Cryptext, free encrypted messages for everyone." },
    {
      name: "description",
      content:
        "Cryptext allows you to share encrypted messages to every one you want, but only the people with the key could see them.",
    },
  ];
};

export default function Index() {
  return (
    <main className="flex h-[95vh] flex-col items-center gap-4 sm:justify-center">
      <section className="flex flex-col items-center">
        <span className="flex items-center gap-1">
          <h1 className="my-2 text-6xl font-bold">Cryptext</h1>
          <IconMessageCircle2Filled className="relative -top-4" />
        </span>
        <h2 className="my-4 text-2xl text-gray-600">
          Share encrypted messages free.
        </h2>
      </section>

      <Features />

      <span className="flex items-center gap-4">
        <p className="text-center text-xl sm:text-start sm:text-2xl">
          Are you ready?
        </p>

        <Link
          to="/create"
          className="my-6 flex items-center gap-4 rounded-lg bg-gray-800 px-4 py-2 text-lg text-white sm:text-xl"
        >
          Create a new Cryptext
          <IconPencil className="hidden sm:block" />
        </Link>
      </span>
    </main>
  );
}
