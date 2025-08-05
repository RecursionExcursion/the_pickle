import { Match, Player, Score } from "../../../service/types";
import { createToken } from "./jwt-auth";
import { v4 as uuidv4 } from "uuid";
import { PG_Pickle } from "./pickle-pg-driver";
import { brotliCompressor } from "./compresion-service";

const COLLECTION_KEY = "pickle";
const COLLECTION_APP_NAME = "ThePickle";

const PICKLE_USERNAME = process.env.PICKLE_USERNAME;
const PICKLE_PASSWORD = process.env.PICKLE_PASSWORD;

assertIsString(PICKLE_USERNAME);
assertIsString(PICKLE_PASSWORD);

type DB_DATA_SHAPE = {
  id: string;
  key: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  data: string;
};

type APP_DATA_SHAPE = {
  id: string;
  players: Player[];
  matches: Match[];
};

export interface Pickle_DB {
  get(appKey: string): Promise<DB_DATA_SHAPE>;
  save(data: { key: string; name: string; data: string }): Promise<boolean>;
}

class PickleResponse<T> {
  status: number = 200;
  message?: string;
  payload: T;
  constructor(props: { status?: number; payload?: T; message?: string }) {
    if (props.status) this.status = props.status;
    if (props.message) this.message = props.message;
    this.payload = props.payload ?? ({} as T);
  }
  ok = () => this.status >= 200 && this.status <= 299;
  set(status?: number, payload?: T, message?: string) {
    if (status) this.status = status;
    if (message) this.message = message;
    if (payload) this.payload = payload;
  }
}

/* To be used on the server only  */
class ThePickle {
  db: Pickle_DB = new PG_Pickle(process.env.DB_URL);

  async #getAppData() {
    const respg = await this.db.get(COLLECTION_KEY);
    const data = JSON.parse(
      brotliCompressor.decompress(respg.data)
    ) as APP_DATA_SHAPE;
    return data as APP_DATA_SHAPE;
  }

  async #updateAppData(data: APP_DATA_SHAPE) {
    const pgSuccess = await this.db.save({
      key: COLLECTION_KEY,
      name: COLLECTION_APP_NAME,
      data: brotliCompressor.compress(JSON.stringify(data)),
    });
    return new PickleResponse<void>({
      status: pgSuccess ? 200 : 404,
    });
  }

  login = {
    login: async (un: string, pw: string) => {
      if (un === PICKLE_USERNAME && pw === PICKLE_PASSWORD) {
        return new PickleResponse<string>({
          status: 200,
          payload: createToken({ sub: un }),
        });
      }
      return new PickleResponse<string>({ status: 401 });
    },
  };

  player = {
    get: async () => {
      return new PickleResponse<Player[]>({
        status: 200,
        payload: (await this.#getAppData())?.players ?? [],
      });
    },
    create: async () => {},
  };

  matches = {
    get: async () => {
      return new PickleResponse<Match[]>({
        status: 200,
        payload: (await this.#getAppData())?.matches ?? [],
      });
    },
    create: async (
      date: number,
      score: Score[]
    ): Promise<PickleResponse<void>> => {
      const res = new PickleResponse<void>({
        status: 400,
      });

      //validate params
      if (score.length !== 2) {
        res.message = "Only 2 players can be submitted per match";
        return res;
      }

      const appData = await this.#getAppData();

      if (!appData) {
        res.message = "No app data";
        return res;
      }

      //check players are in the db
      const p1Id = score[0].id;
      const p2Id = score[1].id;

      const p1 = appData.players.find((p) => p.id === p1Id);
      const p2 = appData.players.find((p) => p.id === p2Id);

      if (!p1 || !p2) {
        res.message = "Player not found";
        return res;
      }

      //create new match
      const newMatch: Match = {
        id: uuidv4(),
        date,
        score,
      };

      p1.matches.push(newMatch.id);
      p2.matches.push(newMatch.id);
      appData.matches.push(newMatch);

      this.#updateAppData(appData);
      res.set(200);
      return res;
    },
    update: async (match: Match): Promise<PickleResponse<boolean>> => {
      const appData = await this.#getAppData();
      const matchToEdit = appData.matches.find((m) => m.id === match.id);

      if (!matchToEdit) {
        return new PickleResponse({ status: 404 });
      }

      matchToEdit.score = match.score;

      this.#updateAppData(appData);
      return new PickleResponse({ status: 200 });
    },
    delete: async (matchId: string) => {
      const res = new PickleResponse<void>({
        status: 404,
      });

      const appData = await this.#getAppData();
      if (!appData) {
        return res;
      }

      //find and delete match
      const i = appData.matches.findIndex((m) => m.id === matchId);
      if (i === -1) {
        return res;
      }
      const deleted = appData.matches.splice(i, 1)[0];

      //find players and delete match
      const p1 = appData.players.find((p) => p.id === deleted.score[0].id);
      const p2 = appData.players.find((p) => p.id === deleted.score[1].id);

      if (p1) {
        p1.matches = p1.matches.filter((mId) => mId !== deleted.id);
      }
      if (p2) {
        p2.matches = p2.matches.filter((mId) => mId !== deleted.id);
      }

      this.#updateAppData(appData);
      res.set(200);
      return res;
    },
  };
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Value must be a string`);
  }
}

const thePickle = new ThePickle();
export default thePickle;
