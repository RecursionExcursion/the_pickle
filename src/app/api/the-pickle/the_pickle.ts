import { Match, Player, Score } from "../../../service/types";
import { createToken } from "./jwtAuth";
import { MongoClientManager } from "./MongoConnection";
import { v4 as uuidv4 } from "uuid";

const COLLECTION_NAME = "data";

const DB_NAME = process.env.DB_NAME_PICKLE;
const PICKLE_USERNAME = process.env.PICKLE_USERNAME;
const PICKLE_PASSWORD = process.env.PICKLE_PASSWORD;

assertIsString(DB_NAME);
assertIsString(PICKLE_USERNAME);
assertIsString(PICKLE_PASSWORD);

type DB_DATA_SHAPE = {
  id: string;
  players: Player[];
  matches: Match[];
};

type PickleHttpResponse<T> = {
  status: number;
  message?: string;
  data?: T;
};

/* To be used on the server only  */
class ThePickle {
  dbClient = MongoClientManager(DB_NAME as string);

  async #getAppData() {
    const res = await this.dbClient.transact(async (session) =>
      (await this.dbClient.db())
        .collection(COLLECTION_NAME)
        .findOne({ session })
    );

    if (!res) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...data } = res;
    return data as DB_DATA_SHAPE;
  }

  async #updateAppData(data: DB_DATA_SHAPE) {
    const res = await this.dbClient.transact(async (session) =>
      (await this.dbClient.db())
        .collection(COLLECTION_NAME)
        .updateOne({ id: data.id }, { $set: data }, { session })
    );

    const success = !!res && res.acknowledged && res.modifiedCount === 1;
    return {
      status: success ? 200 : 404,
      data: success,
    } as PickleHttpResponse<boolean>;
  }

  login = {
    login: async (un: string, pw: string) => {
      const res = { status: 401 } as PickleHttpResponse<string>;
      if (un === PICKLE_USERNAME && pw === PICKLE_PASSWORD) {
        res.status = 200;
        res.data = createToken({ sub: un });
      }
      return res;
    },
  };

  player = {
    get: async () => {
      return {
        status: 200,
        data: (await this.#getAppData())?.players ?? [],
      } as PickleHttpResponse<Player[]>;
    },
    create: async () => {},
  };

  matches = {
    get: async () => {
      return {
        status: 200,
        data: (await this.#getAppData())?.matches ?? [],
      } as PickleHttpResponse<Match[]>;
    },
    create: async (
      date: number,
      score: Score[]
    ): Promise<PickleHttpResponse<boolean>> => {
      const res = {
        status: 400,
      } as PickleHttpResponse<boolean>;

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

      console.log({ p1, p2 });

      p1.matches.push(newMatch.id);
      p2.matches.push(newMatch.id);
      appData.matches.push(newMatch);

      this.#updateAppData(appData);
      res.data = true;
      res.status = 200;
      return res;
    },
    delete: async (matchId: string) => {
      const res = {
        status: 404,
      } as PickleHttpResponse<void>;

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
      res.status = 200;
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
