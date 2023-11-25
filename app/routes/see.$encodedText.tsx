import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { type MetaFunction, useLoaderData, Link } from "@remix-run/react";
import { IconArrowRight, IconKey, IconScan } from "@tabler/icons-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { arrayBufferFromString } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Decrypt your message" },
    {
      name: "description",
      content:
        "Here you'll be able to decrypt the message you've been sent, if you have the private key associated to it.",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const encodedText = params.encodedText;

  if (!encodedText) {
    throw new Response("Not encoded text was found", { status: 404 });
  }

  return json({ encodedText });
};

export default function See() {
  const { encodedText } = useLoaderData<typeof loader>();
  const [privateKeyString, setPrivateKeyString] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState(encodedText);

  async function extractKeyFromPem(pemString: string) {
    const pemContents = pemString
      .replace(/-----BEGIN [^-]+-----/, "")
      .replace(/-----END [^-]+-----/, "");

    const base64Key = pemContents.replace(/\r?\n|\r/g, "").trim();

    const keyArrayBuffer = arrayBufferFromString(base64Key);

    return keyArrayBuffer;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (privateKeyString.length === 0) {
      toast.error(
        "You haven't provided the required key to decrypt this message.",
      );

      return;
    }

    const rawKey = await extractKeyFromPem(privateKeyString);
    const importedKey = await window.crypto.subtle.importKey(
      "pkcs8",
      rawKey,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["decrypt"],
    );

    const encryptedMessageBuffer = arrayBufferFromString(encodedText);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      importedKey,
      encryptedMessageBuffer,
    );

    const decryptedText = new TextDecoder().decode(decrypted);

    setDecryptedMessage(decryptedText);
  }

  return (
    <main className="my-auto flex h-[90vh] flex-col sm:justify-center">
      <h1 className="my-4 text-4xl font-semibold">Decrypt a message</h1>
      <h2 className="my-2 text-xl text-gray-600">
        You'll need the private key associated to this message. If you don't
        have it, ask for it to the person that shared this message with you.
      </h2>

      <form className="my-4" onSubmit={handleSubmit}>
        <label className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <IconKey />
            <p className="text-lg font-semibold">Enter the private key</p>
          </span>

          <input
            placeholder="-----BEGIN PRIVATE KEY..."
            className="flex-1 rounded-sm border border-gray-600 p-2"
            onChange={(e) => setPrivateKeyString(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="my-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 py-2 text-lg text-white"
        >
          Decrypt this message
          <IconScan />
        </button>
      </form>

      <h3 className="my-2 text-center text-xl font-semibold sm:text-start">
        Message content:
      </h3>
      <p className="mx-auto max-w-fit break-all text-lg sm:mx-0">
        {decryptedMessage}
      </p>

      {decryptedMessage.length < encodedText.length && (
        <span className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <p className="text-lg">Liked this tool?</p>
          <Link
            to="/create"
            className="flex items-center gap-2 rounded-lg border-2 border-gray-800 bg-white px-4 py-2 text-gray-800"
          >
            Create your own Cryptext
            <IconArrowRight />
          </Link>
        </span>
      )}
    </main>
  );
}
