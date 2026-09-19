import { getStore } from "@netlify/blobs";

const CATEGORIAS = ["character", "ilustracao", "fanart"];
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANHO_MAX = 5 * 1024 * 1024; // 5 MB por imagem

function json(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function senhaConfere(valor) {
  const esperada = process.env.SENHA_PAINEL;
  if (!esperada) return false;
  return typeof valor === "string" && valor === esperada;
}

export default async (req) => {
  const obras = getStore("obras");
  const imagens = getStore("imagens");

  async function lerLista() {
    const lista = await obras.get("lista", { type: "json" });
    return Array.isArray(lista) ? lista : [];
  }

  // ---------- listar (público) ----------
  if (req.method === "GET") {
    return json(await lerLista());
  }

  // ---------- cadastrar ----------
  if (req.method === "POST") {
        // confere a senha na entrada do painel (corpo em JSON, sem imagem)
    if ((req.headers.get("content-type") || "").includes("application/json")) {
      let dados;
      try {
        dados = await req.json();
      } catch {
        return json({ erro: "Pedido inválido." }, 400);
      }
      if (!senhaConfere(dados.senha)) {
        return json({ erro: "Senha incorreta." }, 401);
      }
      return json({ ok: true });
    }
    let form;
    try {
      form = await req.formData();
    } catch {
      return json({ erro: "Não consegui ler o formulário." }, 400);
    }

    if (!senhaConfere(form.get("senha"))) {
      return json({ erro: "Senha incorreta." }, 401);
    }

    const arquivo = form.get("imagem");
    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "").trim();
    const date = String(form.get("date") || "").trim();

    if (!arquivo || typeof arquivo === "string") {
      return json({ erro: "Escolha uma imagem." }, 400);
    }
    if (!TIPOS_OK.includes(arquivo.type)) {
      return json({ erro: "Formato aceito: JPG, PNG, WebP ou GIF." }, 400);
    }
    if (arquivo.size > TAMANHO_MAX) {
      return json({ erro: "A imagem passou de 5 MB." }, 400);
    }
    if (!title) return json({ erro: "Falta o título." }, 400);
    if (!CATEGORIAS.includes(category)) return json({ erro: "Categoria inválida." }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ erro: "Data inválida." }, 400);

    const id = crypto.randomUUID();

    await imagens.set(id, await arquivo.arrayBuffer(), {
      metadata: { type: arquivo.type },
    });

    const lista = await lerLista();
    lista.push({ id, title, category, date, criadoEm: new Date().toISOString() });
    lista.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    await obras.setJSON("lista", lista);

    return json({ ok: true, id });
  }

  // ---------- remover ----------
  if (req.method === "DELETE") {
    let corpo;
    try {
      corpo = await req.json();
    } catch {
      return json({ erro: "Pedido inválido." }, 400);
    }

    if (!senhaConfere(corpo.senha)) {
      return json({ erro: "Senha incorreta." }, 401);
    }

    const lista = await lerLista();
    const restantes = lista.filter((o) => o.id !== corpo.id);
    if (restantes.length === lista.length) {
      return json({ erro: "Obra não encontrada." }, 404);
    }

    await obras.setJSON("lista", restantes);
    await imagens.delete(corpo.id);

    return json({ ok: true });
  }

  return json({ erro: "Método não suportado." }, 405);
};
