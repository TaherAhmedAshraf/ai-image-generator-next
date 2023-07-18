import { useState } from "react";
import ReactLoading from "react-loading";
import { saveAs } from "file-saver";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");

  function _generateImage(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/generate/${prompt}`)
      .then((res) => res.json())
      .then((data) => {
        setImage(data.name);
        setLoading(false);
      });
  }

  const _download = () => {
    const url = `/generated/${image}`;
    saveAs(url, image);
  };

  return (
    <div className="min-h-[100vh] bg-gradient-to-tl from-cyan-700 to-purple-600">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center text-white pt-10 pb-8">
          <h1 className="text-3xl font-semibold">
            GENERATE IMAGE WITH THE POWER OF AI
          </h1>
          <p className="font-light">
            Enter a prompt and watch the AI generate an image based on it.
          </p>
          <form className="grid grid-cols-12 mt-4 w-1/2 rounded-md overflow-hidden mb-8">
            <input
              placeholder="Enter a prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-gray-900 text-white px-6 py-4 outline-none border-none col-span-9"
            />
            <button
              onClick={_generateImage}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-50 p-4 col-span-3"
            >
              GENERATE
            </button>
          </form>
          {loading && (
            <ReactLoading type={"bubbles"} color={"#fff"} width={50} />
          )}
          {image && !loading && (
            <>
              <img
                src={`/generated/${image}`}
                className="rounded-md shadow-md"
              />
              <button
                onClick={_download}
                className="mt-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-50 p-4 col-span-3"
              >
                DOWNLOAD
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
