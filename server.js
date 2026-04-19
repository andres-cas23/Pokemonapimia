const express    = require("express");
const cors       = require("cors");
const Database   = require("better-sqlite3");
const path       = require("path");
const swaggerUi  = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// ─── Setup ────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── Swagger ──────────────────────────────────────────────────────────────────
const RAILWAY_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokémon DB API",
      version: "2.0.0",
      description: "API REST para gestionar una base de datos de Pokémon"
    },
    servers: [{ url: RAILWAY_URL }],
    components: {
      schemas: {
        Pokemon: {
          type: "object",
          properties: {
            id:               { type: "integer",  example: 6  },
            nombre:           { type: "string",   example: "Charizard" },
            imagen_frontal:   { type: "string",   example: "https://..." },
            imagen_posterior: { type: "string",   example: "https://..." },
            imagen_shiny:     { type: "string",   example: "https://..." },
            altura:           { type: "number",   example: 1.7 },
            peso:             { type: "number",   example: 90.5 },
            tipo1:            { type: "string",   example: "Fuego" },
            tipo2:            { type: "string",   example: "Volador", nullable: true }
          }
        },
        PokemonInput: {
          type: "object",
          required: ["id","nombre","imagen_frontal","imagen_posterior","imagen_shiny","altura","peso","tipo1"],
          properties: {
            id:               { type: "integer" },
            nombre:           { type: "string"  },
            imagen_frontal:   { type: "string"  },
            imagen_posterior: { type: "string"  },
            imagen_shiny:     { type: "string"  },
            altura:           { type: "number"  },
            peso:             { type: "number"  },
            tipo1:            { type: "string"  },
            tipo2:            { type: "string", nullable: true }
          }
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Database ─────────────────────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "pokemon.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// ─── Schema ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS pokemon (
    id               INTEGER PRIMARY KEY,
    nombre           TEXT    NOT NULL UNIQUE,
    imagen_frontal   TEXT    NOT NULL,
    imagen_posterior TEXT    NOT NULL,
    imagen_shiny     TEXT    NOT NULL,
    altura           REAL    NOT NULL,
    peso             REAL    NOT NULL,
    tipo1            TEXT    NOT NULL,
    tipo2            TEXT
  );
`);

// ─── Seed ─────────────────────────────────────────────────────────────────────
function seedDatabase() {
  const count = db.prepare("SELECT COUNT(*) as n FROM pokemon").get().n;
  if (count > 0) return console.log("✅ Base de datos ya tiene datos.");

  console.log("🌱 Insertando 10 Pokémon...");

  const base  = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  const img   = (id) => `${base}/${id}.png`;
  const back  = (id) => `${base}/back/${id}.png`;
  const shiny = (id) => `${base}/shiny/${id}.png`;

  const pokemons = [
    {
      id: 6,
      nombre:           "Charizard",
      imagen_frontal:   img(6),
      imagen_posterior: back(6),
      imagen_shiny:     shiny(6),
      altura:           1.7,
      peso:             90.5,
      tipo1:            "Fuego",
      tipo2:            "Volador"
    },
    {
      id: 9,
      nombre:           "Blastoise",
      imagen_frontal:   img(9),
      imagen_posterior: back(9),
      imagen_shiny:     shiny(9),
      altura:           1.6,
      peso:             85.5,
      tipo1:            "Agua",
      tipo2:            null
    },
    {
      id: 31,
      nombre:           "Nidoqueen",
      imagen_frontal:   img(31),
      imagen_posterior: back(31),
      imagen_shiny:     shiny(31),
      altura:           1.3,
      peso:             60.0,
      tipo1:            "Veneno",
      tipo2:            "Tierra"
    },
    {
      id: 59,
      nombre:           "Arcanine",
      imagen_frontal:   img(59),
      imagen_posterior: back(59),
      imagen_shiny:     shiny(59),
      altura:           1.9,
      peso:             155.0,
      tipo1:            "Fuego",
      tipo2:            null
    },
    {
      id: 65,
      nombre:           "Alakazam",
      imagen_frontal:   img(65),
      imagen_posterior: back(65),
      imagen_shiny:     shiny(65),
      altura:           1.5,
      peso:             48.0,
      tipo1:            "Psíquico",
      tipo2:            null
    },
    {
      id: 76,
      nombre:           "Golem",
      imagen_frontal:   img(76),
      imagen_posterior: back(76),
      imagen_shiny:     shiny(76),
      altura:           1.4,
      peso:             300.0,
      tipo1:            "Roca",
      tipo2:            "Tierra"
    },
    {
      id: 130,
      nombre:           "Gyarados",
      imagen_frontal:   img(130),
      imagen_posterior: back(130),
      imagen_shiny:     shiny(130),
      altura:           6.5,
      peso:             235.0,
      tipo1:            "Agua",
      tipo2:            "Volador"
    },
    {
      id: 135,
      nombre:           "Jolteon",
      imagen_frontal:   img(135),
      imagen_posterior: back(135),
      imagen_shiny:     shiny(135),
      altura:           0.8,
      peso:             24.5,
      tipo1:            "Eléctrico",
      tipo2:            null
    },
    {
      id: 149,
      nombre:           "Dragonite",
      imagen_frontal:   img(149),
      imagen_posterior: back(149),
      imagen_shiny:     shiny(149),
      altura:           2.2,
      peso:             210.0,
      tipo1:            "Dragón",
      tipo2:            "Volador"
    },
    {
      id: 150,
      nombre:           "Mewtwo",
      imagen_frontal:   img(150),
      imagen_posterior: back(150),
      imagen_shiny:     shiny(150),
      altura:           2.0,
      peso:             122.0,
      tipo1:            "Psíquico",
      tipo2:            null
    },
  ];

  const insert = db.prepare(`
    INSERT INTO pokemon
      (id, nombre, imagen_frontal, imagen_posterior, imagen_shiny, altura, peso, tipo1, tipo2)
    VALUES
      (@id, @nombre, @imagen_frontal, @imagen_posterior, @imagen_shiny, @altura, @peso, @tipo1, @tipo2)
  `);

  const seedAll = db.transaction(() => {
    for (const p of pokemons) insert.run(p);
  });
  seedAll();

  console.log(`✅ 10 Pokémon insertados correctamente.`);
}

seedDatabase();

// ─── RUTAS ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /:
 *   get:
 *     summary: Info general de la API
 *     responses:
 *       200:
 *         description: Información de la API y lista de endpoints
 */
app.get("/", (_, res) => {
  res.json({
    api: "Pokémon DB API",
    version: "2.0.0",
    docs: `http://localhost:${PORT}/api-docs`,
    total_pokemon: db.prepare("SELECT COUNT(*) as n FROM pokemon").get().n,
    endpoints: {
      "GET /pokemon":                  "Lista todos los Pokémon",
      "GET /pokemon/:id":              "Busca por ID",
      "GET /pokemon/nombre/:nombre":   "Busca por nombre",
      "GET /pokemon/tipo/:tipo":       "Filtra por tipo",
      "POST /pokemon":                 "Crea un nuevo Pokémon",
      "PUT /pokemon/:id":              "Actualiza un Pokémon",
      "DELETE /pokemon/:id":           "Elimina un Pokémon",
    }
  });
});

/**
 * @swagger
 * /pokemon:
 *   get:
 *     summary: Lista todos los Pokémon
 *     responses:
 *       200:
 *         description: Array con todos los Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 */
app.get("/pokemon", (_, res) => {
  const rows = db.prepare("SELECT * FROM pokemon ORDER BY id").all();
  res.json({ total: rows.length, data: rows });
});

/**
 * @swagger
 * /pokemon/nombre/{nombre}:
 *   get:
 *     summary: Busca un Pokémon por nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         example: Charizard
 *     responses:
 *       200:
 *         description: Pokémon encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon no encontrado
 */
app.get("/pokemon/nombre/:nombre", (req, res) => {
  const row = db.prepare(
    "SELECT * FROM pokemon WHERE LOWER(nombre) = LOWER(?)"
  ).get(req.params.nombre);
  if (!row) return res.status(404).json({ error: `Pokémon '${req.params.nombre}' no encontrado` });
  res.json(row);
});

/**
 * @swagger
 * /pokemon/tipo/{tipo}:
 *   get:
 *     summary: Filtra Pokémon por tipo
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         example: Fuego
 *     responses:
 *       200:
 *         description: Lista de Pokémon del tipo solicitado
 *       404:
 *         description: No hay Pokémon de ese tipo
 */
app.get("/pokemon/tipo/:tipo", (req, res) => {
  const tipo = req.params.tipo;
  const rows = db.prepare(
    "SELECT * FROM pokemon WHERE LOWER(tipo1) = LOWER(?) OR LOWER(tipo2) = LOWER(?)"
  ).all(tipo, tipo);
  if (!rows.length) return res.status(404).json({ error: `No hay Pokémon de tipo '${tipo}'` });
  res.json({ tipo, total: rows.length, data: rows });
});

/**
 * @swagger
 * /pokemon/{id}:
 *   get:
 *     summary: Busca un Pokémon por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: Pokémon encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pokémon no encontrado
 */
app.get("/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID debe ser un número" });
  const row = db.prepare("SELECT * FROM pokemon WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: `Pokémon #${id} no encontrado` });
  res.json(row);
});

/**
 * @swagger
 * /pokemon:
 *   post:
 *     summary: Crea un nuevo Pokémon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PokemonInput'
 *     responses:
 *       201:
 *         description: Pokémon creado exitosamente
 *       400:
 *         description: Campos requeridos faltantes
 *       409:
 *         description: Ya existe un Pokémon con ese ID o nombre
 */
app.post("/pokemon", (req, res) => {
  const { id, nombre, imagen_frontal, imagen_posterior, imagen_shiny, altura, peso, tipo1, tipo2 } = req.body;
  const requeridos = { id, nombre, imagen_frontal, imagen_posterior, imagen_shiny, altura, peso, tipo1 };
  const faltantes  = Object.entries(requeridos)
    .filter(([, v]) => v === undefined || v === null || v === "")
    .map(([k]) => k);
  if (faltantes.length)
    return res.status(400).json({ error: `Campos requeridos faltantes: ${faltantes.join(", ")}` });

  try {
    db.prepare(`
      INSERT INTO pokemon (id, nombre, imagen_frontal, imagen_posterior, imagen_shiny, altura, peso, tipo1, tipo2)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nombre, imagen_frontal, imagen_posterior, imagen_shiny, altura, peso, tipo1, tipo2 || null);
    res.status(201).json({ mensaje: "Pokémon creado exitosamente", id });
  } catch (e) {
    if (e.message.includes("UNIQUE"))
      return res.status(409).json({ error: "Ya existe un Pokémon con ese ID o nombre" });
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /pokemon/{id}:
 *   put:
 *     summary: Actualiza un Pokémon existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PokemonInput'
 *     responses:
 *       200:
 *         description: Pokémon actualizado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pokémon no encontrado
 */
app.put("/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  const actual = db.prepare("SELECT * FROM pokemon WHERE id = ?").get(id);
  if (!actual) return res.status(404).json({ error: `Pokémon #${id} no encontrado` });

  const actualizado = { ...actual, ...req.body, id };
  db.prepare(`
    UPDATE pokemon SET
      nombre           = @nombre,
      imagen_frontal   = @imagen_frontal,
      imagen_posterior = @imagen_posterior,
      imagen_shiny     = @imagen_shiny,
      altura = @altura,
      peso   = @peso,
      tipo1  = @tipo1,
      tipo2  = @tipo2
    WHERE id = @id
  `).run(actualizado);

  res.json({
    mensaje: "Pokémon actualizado",
    data: db.prepare("SELECT * FROM pokemon WHERE id = ?").get(id)
  });
});

/**
 * @swagger
 * /pokemon/{id}:
 *   delete:
 *     summary: Elimina un Pokémon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: Pokémon eliminado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pokémon no encontrado
 */
app.delete("/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  const info = db.prepare("DELETE FROM pokemon WHERE id = ?").run(id);
  if (!info.changes) return res.status(404).json({ error: `Pokémon #${id} no encontrado` });
  res.json({ mensaje: `Pokémon #${id} eliminado correctamente` });
});

// 404
app.use((_, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Pokémon API corriendo en puerto ${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = app;