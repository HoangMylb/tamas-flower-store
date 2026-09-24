import {createImageUrlBuilder, type SanityImageSource} from "@sanity/image-url";
import {sanityClient} from "./client";

const builder = sanityClient && createImageUrlBuilder(sanityClient);

export function imageUrl(source: SanityImageSource | undefined) {
  return source && builder ? builder.image(source).auto("format").fit("max").url() : undefined;
}
