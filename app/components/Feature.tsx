import {
  IconDatabaseOff,
  IconShieldFilled,
  IconSpy,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const features: Feature[] = [
  {
    title: "Database-less",
    description:
      "Cryptext doesn't use and doesn't need databases, because we don't store your messages, keys, or any information about you.",
    icon: <IconDatabaseOff size={48} />,
  },
  {
    title: "Secure by default",
    description:
      "Without access to a message's private key, is impossible to decrypt it.",
    icon: <IconShieldFilled size={48} />,
  },
  {
    title: "Your secrets are your secrets",
    description:
      "Your messages won't be related to you in any way, as we don't know who you are.",
    icon: <IconSpy size={48} />,
  },
];

export default function Features() {
  return (
    <section className="flex w-full flex-col">
      <h3 className="my-4 text-start text-3xl font-semibold">Features</h3>
      <h4 className="text-lg text-gray-600">
        Cryptext is a simple web application that allows people to share
        encrypted messages without storing them anywhere, making them truly
        secure.
      </h4>

      <ul className="my-6 flex flex-col gap-8">
        {features.map((feature) => (
          <Feature key={feature.title} {...feature} />
        ))}
      </ul>
    </section>
  );
}

function Feature({ title, description, icon }: Feature) {
  return (
    <div className="flex items-center gap-4">
      <span className="rounded-lg bg-gray-800 p-4 text-white">{icon}</span>

      <span className="flex flex-col gap-2">
        <p className="text-xl font-semibold">{title}</p>
        <p>{description}</p>
      </span>
    </div>
  );
}
