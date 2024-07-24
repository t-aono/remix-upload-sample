import {
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uploadHandler } from "~/utilities/image.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const imageUrl = formData.get("image");
  console.log(imageUrl);
  return null;
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="image" />
        <button className="bg-blue-500 text-white px-2 py-1">
          アップロード
        </button>
      </Form>
    </div>
  );
}
