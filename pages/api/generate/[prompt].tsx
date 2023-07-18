// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
import fs from "fs";
import { File } from "@web-std/file";

const hf = new HfInference(process.env.HF_API_KEY);

// auto delete old files
function deleteOldFiles() {
  fs.readdir("public/generated", (err, files) => {
    files.forEach((file) => {
      // file created 1 hour ago
      fs.stat(`public/generated/${file}`, (err, stats) => {
        if (stats.birthtimeMs < Date.now() - 1000 * 60 * 2) {
          fs.unlink(`public/generated/${file}`, (err) => {
            if (err) throw err;
            console.log(`deleted ${file}`);
          });
        }
      });
    });
  });
}

async function generateImage(prompt: string) {
  deleteOldFiles();
  const result = await hf.textToImage({
    model: "runwayml/stable-diffusion-v1-5",
    inputs: prompt + " realistic 3d image",
    parameters: {
      negative_prompt:
        "blurry, low quality, low resolution, pixelated, unclear",
      num_inference_steps: 100,
    },
  });

  // save the image to a file
  const file = new File([result], "image.jpg", { type: "image/jpeg" });
  const buffer = await file.arrayBuffer();
  const name =
    Math.random().toString(36).substring(7) +
    Math.random().toString(36).substring(7);
  fs.writeFileSync(`public/generated/${name}.jpg`, Buffer.from(buffer));
  return name + ".jpg";
}

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = req.query.prompt;
  const file = await generateImage(prompt as string);
  res.status(200).json({ name: file });
}
