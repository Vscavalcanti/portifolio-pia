import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");

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
      // navegador guarda por 1 ano
      "cache-control": "public, max-age=31536000, immutable",
      // CDN do Netlify guarda também, pra não chamar a função a cada visita
      "netlify-cdn-cache-control": "public, max-age=31536000, durable, immutable",
    },
  });
};
