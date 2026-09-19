import { getStore } from "@netlify/blobs";

export const config = { path: "/img/:id" };

export default async (req, context) => {
  const id = context.params.id;

  if (!id) {
    return new Response("Faltou o id da imagem.", { status: 400 });
  }

  const imagens = getStore("imagens");
  const resultado = await imagens.getWithMetadata(id, { type: "arrayBuffer" });

  if (!resultado) {
    return new Response("Imagem não encontrada.", { status: 404 });
  }

  return new Response(resultado.data, {
    headers: {
      "content-type": resultado.metadata?.type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "netlify-cdn-cache-control": "public, max-age=31536000, durable, immutable",
    },
  });
};