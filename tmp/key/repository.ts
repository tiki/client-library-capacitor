import { SavedKey } from "./types";

export default class KeyRepository {
  private repositoryName: string = "com.mytiki.keys";
  private repository: any;
  private repositoryStoreName: string = "keys";

  /**
   * Uses the IndexedDB API to save a key pair.
   * @param {string} publicKey - The public key to be saved.
   * @param {string} privateKey - The private key to be saved.
   * @param {string} name - The name used to identify the object, should be the user ID.
   * @returns {void}
   */
  save(
    publicKey: CryptoKey,
    privateKey: CryptoKey | null,
    name: string
  ): Promise<void> {
    return new Promise(async (fulfill, reject) => {
      await this.open();
      if (!this.repository) {
        reject(new Error("KeyStore is not open."));
      }

      window.crypto.subtle
        .exportKey("spki", publicKey)
        .then(async (spki) => {
          const savedObject = {
            publicKey: publicKey,
            privateKey: privateKey!,
            name: name,
            spki: spki,
          };

          const transaction = this.repository!.transaction(
            [this.repositoryStoreName],
            "readwrite"
          );
          transaction.onerror = (evt: any) => {
            reject((evt.target as IDBTransaction).error);
          };
          transaction.onabort = (evt: any) => {
            reject((evt.target as IDBTransaction).error);
          };
          transaction.oncomplete = () => {
            fulfill();
          };
          const objectStore = transaction.objectStore(this.repositoryStoreName);
          objectStore.add(savedObject);
          await this.close();
        })
        .catch(async (err) => {
          reject(err);
          await this.close();
        });
    });
  }

  /**
   * Uses the IndexedDB API to clean all records
   * @returns {void}
   */
  clear(): Promise<void> {
    return new Promise(async (fulfill, reject) => {
      await this.open();
      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        "readwrite"
      );
      transaction.onerror = async (evt: any) => {
        reject((evt.target as IDBTransaction).error);
        await this.close();
      };
      transaction.onabort = async (evt: any) => {
        reject((evt.target as IDBTransaction).error);
        await this.close();
      };
      transaction.oncomplete = async () => {
        fulfill();
        await this.close();
      };
      const objectStore = transaction.objectStore(this.repositoryStoreName);
      objectStore.clear();
    });
  }

  /**
   * Uses the IndexedDB API to list all records.
   * @returns {Promise<SavedKeyp[]>} A promise containing a list of saved objects with key pairs.
   */
  list(): Promise<SavedKey[]> {
    return new Promise(async (fulfill, reject) => {
      await this.open();
      if (!this.repository) {
        reject(new Error("KeyStore is not open."));
      }

      const list: any[] = [];

      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        "readonly"
      );
      transaction.onerror = async (evt: Event) => {
        await this.close();
        reject((evt.target as IDBTransaction).error);
      };
      transaction.onabort = async (evt: Event) => {
        await this.close();
        reject((evt.target as IDBTransaction).error);
      };

      const objectStore = transaction.objectStore(this.repositoryStoreName);
      const cursor = objectStore.openCursor();

      cursor.onsuccess = async (evt: any) => {
        const cursorResult = (evt.target as IDBRequest).result;
        if (cursorResult) {
          list.push({ id: cursorResult.key, value: cursorResult.value });
          cursorResult.continue();
        } else {
          await this.close();
          fulfill(list);
        }
      };
    });
  }

  private open(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is not supported by this browser."));
      }

      const req = indexedDB.open(this.repositoryName, 1);
      req.onsuccess = () => {
        this.repository = req.result;
        fulfill();
      };
      req.onerror = (evt) => {
        reject((evt.target as IDBOpenDBRequest).error);
      };
      req.onblocked = () => {
        reject(new Error("Database already open"));
      };
      req.onupgradeneeded = (evt) => {
        this.repository = (evt.target as IDBOpenDBRequest).result;
        if (
          !this.repository?.objectStoreNames.contains(this.repositoryStoreName)
        ) {
          const objStore = this.repository.createObjectStore(
            this.repositoryStoreName,
            { autoIncrement: true }
          );
          objStore.createIndex("name", "name", { unique: false });
          objStore.createIndex("spki", "spki", { unique: false });
          objStore.createIndex("publicKey", "publicKey", { unique: false });
          objStore.createIndex("privateKey", "privateKey", { unique: false });
        }
      };
    });
  }

  private close(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!this.repository) {
        reject(new Error("KeyStore is not open."));
      }

      this.repository!.close();
      this.repository = null;
      fulfill();
    });
  }
}
