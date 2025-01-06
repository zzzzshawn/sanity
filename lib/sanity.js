import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { env } from "./env";

export const client = createClient({
  projectId: env.SANITY_STUDIO_PROJECT_ID,
  dataset: env.SANITY_STUDIO_DATASET,
  apiVersion: "2023-05-03",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
