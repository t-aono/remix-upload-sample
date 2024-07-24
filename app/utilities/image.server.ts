import { unstable_composeUploadHandlers } from "@remix-run/node";
import ImageKit from "imagekit";
import { UploadOptions } from "imagekit/dist/libs/interfaces";

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const urlEndpoint = process.env.URL_ENDPOINT;

async function uploadImage({
  file,
  fileName,
}: Pick<UploadOptions, "file" | "fileName">) {
  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("Api key not found");
  }
  const imageKit = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return imageKit
    .upload({
      file,
      fileName,
      folder: "test-folder",
    })
    .then((response) => {
      return response.url;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

async function convertToBuffer(asyncIterable: AsyncIterable<Uint8Array>) {
  const chunks = [];
  for await (const chunk of asyncIterable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export const uploadHandler = unstable_composeUploadHandlers(
  async ({ name, data, filename }) => {
    if (name !== "image" || filename === undefined) {
      return undefined;
    }
    const uploadedImageUrl = await uploadImage({
      file: await convertToBuffer(data),
      fileName: filename,
    });
    return uploadedImageUrl;
  }
);
