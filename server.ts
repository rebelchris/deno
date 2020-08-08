import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 3000;
const HOST = env.HOST || "127.0.0.1";

interface Pokemon {
  name: string;
  level: number;
}

let pokemons: Array<Pokemon> = [
  {
    name: "Pikachu",
    level: 10,
  },
  {
    name: "Eevee",
    level: 50,
  },
  {
    name: "Snorlax",
    level: 20,
  },
];

export const getPokemons = ({ response }: { response: any }) => {
  response.body = pokemons;
};

export const getPokemon = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const pokemon = pokemons.filter((pokemon) => pokemon.name === params.name);
  if (pokemon.length) {
    response.status = 200;
    response.body = pokemon[0];
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find pokemon ${params.name}` };
};

export const catchPokemon = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const { name, level }: { name: string; level: number } = body.value;
  pokemons.push({
    name: name,
    level: level,
  });

  response.body = { msg: "OK" };
  response.status = 200;
};

export const levelUpPokemon = async ({
  params,
  request,
  response,
}: {
  params: {
    name: string;
  };
  request: any;
  response: any;
}) => {
  const temp = pokemons.filter((pokemon) => pokemon.name === params.name);
  const body = await request.body();
  const { level }: { level: number } = body.value;

  if (temp.length) {
    temp[0].level = level;
    response.status = 200;
    response.body = { msg: "OK" };
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find pokemon ${params.name}` };
};

export const releasePokemon = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const lengthBefore = pokemons.length;
  pokemons = pokemons.filter((pokemon) => pokemon.name !== params.name);

  if (pokemons.length === lengthBefore) {
    response.status = 400;
    response.body = { msg: `Cannot find pokemon ${params.name}` };
    return;
  }

  response.body = { msg: "OK" };
  response.status = 200;
};

const router = new Router();
router
  .get("/pokemon", getPokemons)
  .get("/pokemon/:name", getPokemon)
  .post("/pokemon", catchPokemon)
  .put("/pokemon/:name", levelUpPokemon)
  .delete("/pokemon/:name", releasePokemon);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen(`${HOST}:${PORT}`);
