import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {sanityEnv} from "./env";
import {schemaTypes} from "./schemaTypes";

export const sanityConfig = defineConfig({
  basePath: "/admin",
  projectId: sanityEnv.projectId ?? "missing-project-id",
  dataset: sanityEnv.dataset ?? "missing-dataset",
  schema: {types: schemaTypes},
  plugins: [structureTool({
    structure: S => S.list()
      .title("Nội dung Tamas")
      .items([
        S.listItem().title("Trang chủ").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
        S.divider(),
        ...S.documentTypeListItems().filter(item => item.getId() !== "homePage"),
      ]),
  })],
});
