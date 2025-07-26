import { ClientSession, Db, MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

export const userCollectionName = "users";

export const dbCollectionNames = [userCollectionName];

// const dbName = process.env.DB_NAME;

export const MongoClientManager = (dbName:string) =>
  (function () {
    let client: MongoClient | null = null;

    async function connectToClient() {
      if (!client) {
        client = new MongoClient(connectionString);
        await client.connect();
      }
      return client;
    }

    return {
      close: async function (): Promise<void> {
        if (client) {
          await client.close();
          client = null;
        }
      },

      db: async function (): Promise<Db> {
        try {
          return (await connectToClient()).db(dbName);
        } catch (e) {
          if (e instanceof Error) {
            throw new Error(e.message);
          } else {
            throw new Error(String(e));
          }
        }
      },

      /**
       * Handles a transaction with an optional session.
       * Automatically commits or aborts the transaction.
       *
       * @template T
       * @param {(session?: ClientSession) => Promise<T>} fn - The transactional operation.- The transactional operation.
       * @returns {Promise<T| null>} Result of the transaction or null on failure.
       */
      transact: async function <T>(
        fn: (session?: ClientSession) => Promise<T>
      ): Promise<T | null> {
        const useSession = ["prod"].includes(process.env.NODE_ENV || "");
        try {
          if (useSession) {
            return (await connectToClient()).withSession(async (session) => {
              return await session.withTransaction(
                async () => await fn(session)
              );
            });
          }
          return fn();
        } catch {
          return null;
        }
      },
    };
  })();
