import { Link, type MetaFunction } from "@remix-run/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconArrowRight,
  IconClipboardCopy,
  IconExternalLink,
  IconKey,
  IconShare,
} from "@tabler/icons-react";
import { Fragment, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { arrayBufferToString, formatRoute } from "~/lib/utils";
import toast from "react-hot-toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Create a new cryptext" },
    {
      name: "description",
      content: "This page will allow you to create encrypted text.",
    },
  ];
};

export default function Create() {
  const [text, setText] = useState("");
  const [calculationResult, setCalculationResult] = useState({
    encodedText: "",
    privateKey: "",
  });

  const encodedText = useMemo(() => {
    return new TextEncoder().encode(text);
  }, [text]);

  async function generateCryptoKeyPair() {
    try {
      const cryptoKeyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: "SHA-256" },
        } satisfies RsaHashedKeyGenParams,
        true,
        ["encrypt", "decrypt"],
      );

      return cryptoKeyPair;
    } catch (error) {
      throw new Error("An error ocurred while creating your keys.");
    }
  }

  async function encryptMessage(publicKey: CryptoKey) {
    try {
      const cipherText = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedText,
      );

      return cipherText;
    } catch (error) {
      throw new Error("An error ocurred while encrypting your message.");
    }
  }

  async function exportPrivateCryptoKey(privateKey: CryptoKey) {
    try {
      const exportedKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        privateKey,
      );
      const base64KeyString = arrayBufferToString(exportedKey);
      const pemExported = `-----BEGIN PRIVATE KEY-----\n${base64KeyString}\n-----END PRIVATE KEY-----`;

      return pemExported;
    } catch (error) {
      throw new Error("An error ocurred while exporting your private key.");
    }
  }

  async function calculateResult() {
    try {
      if (text.length === 0) {
        throw new Error("You must write something to share.");
      }

      const cryptoKeyPair = await generateCryptoKeyPair();
      const encryptedMessage = await encryptMessage(cryptoKeyPair.publicKey);

      if (encryptedMessage) {
        const base64EncryptedMessage = arrayBufferToString(encryptedMessage);
        const urlBase64 = encodeURIComponent(base64EncryptedMessage);
        const exportedPrivateKey = await exportPrivateCryptoKey(
          cryptoKeyPair.privateKey,
        );

        setCalculationResult({
          encodedText: urlBase64,
          privateKey: exportedPrivateKey,
        });

        setText("");
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <main className="mx-auto flex h-[90vh] max-w-md flex-col items-center justify-center gap-6">
      <span className="flex flex-col items-center">
        <h1 className="my-4 text-4xl font-semibold">Create a new cryptext</h1>
        <h2 className="text-center text-xl">
          Just write anything you want and generate your share link.
        </h2>
      </span>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="A really deep secret..."
        className="out min-h-[12em] min-w-full resize-none rounded-lg border border-gray-400 p-4 transition duration-150 focus:border-blue-500 focus:outline-none active:outline-none"
      />

      <PrivateKeyModal
        calculateResult={calculateResult}
        calculationResult={calculationResult}
      />
    </main>
  );
}

interface PrivateKeyModalProps {
  calculateResult: () => Promise<void>;
  calculationResult: {
    encodedText: string;
    privateKey: string;
  };
}

function PrivateKeyModal({
  calculationResult,
  calculateResult,
}: PrivateKeyModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleButtonClick() {
    calculateResult()
      .then(() => setIsOpen(true))
      .catch((error) => toast.error((error as Error).message));
  }

  function handleCopyPrivateKey() {
    if (calculationResult.privateKey.length > 0) {
      window.navigator.clipboard
        .writeText(calculationResult.privateKey)
        .then(() => toast.success("Key successfully copied to clipboard!"));

      return;
    }

    toast.error("You didn't generate your keys yet.");
  }

  return (
    <>
      <span className="flex w-full items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <IconArrowLeft />
          Go back
        </Link>
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white"
        >
          Generate your share link
          <IconKey />
        </button>
      </span>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-md"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <Dialog.Panel className="mx-auto flex max-w-sm flex-col gap-4 rounded-lg bg-white p-4 sm:max-w-xl">
                <div className="flex items-center gap-2">
                  <IconAlertTriangleFilled />
                  <Dialog.Title className="text-2xl font-bold">
                    This is your private key
                  </Dialog.Title>
                </div>
                <p className="text-lg text-gray-600">
                  This private key will not be stored anywhere, so it is
                  important that you do not lose it if you want to continue
                  sharing this note.
                </p>

                <div className="flex items-center justify-between rounded-md bg-gray-200 p-2">
                  <p className="max-w-[48ch] overflow-hidden truncate text-ellipsis">
                    {calculationResult.privateKey}
                  </p>
                  <button
                    id="copy-private-key-button"
                    type="button"
                    onClick={handleCopyPrivateKey}
                    className="rounded-lg bg-gray-800 p-2 text-gray-200"
                  >
                    <IconClipboardCopy />
                  </button>

                  <Tooltip anchorSelect="#copy-private-key-button">
                    Copy your private key to clipboard
                  </Tooltip>
                </div>

                <section>
                  <div className="my-4 flex items-center gap-2">
                    <IconShare />
                    <h3 className="text-xl font-semibold">
                      Share your message
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Once you copied your private key, you should share it along
                    this link to allow people decrypt it.
                  </p>

                  <div className="my-4 flex items-center justify-between rounded-lg bg-blue-50 p-2">
                    <p className="max-w-[48ch] overflow-hidden text-ellipsis">
                      {formatRoute(`see/${calculationResult.encodedText}`)}
                    </p>
                    <a
                      href={formatRoute(`see/${calculationResult.encodedText}`)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-lg bg-blue-600 p-2 text-gray-100"
                    >
                      <IconExternalLink />
                    </a>
                  </div>
                </section>

                <span className="flex items-center justify-between">
                  <p className="max-w-[36ch] text-gray-600">
                    PD: Generating the same text will NOT keep the current
                    values. Be sure to copy your information.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
                  >
                    <p>Continue</p>
                    <IconArrowRight />
                  </button>
                </span>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
