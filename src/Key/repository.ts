export default class KeyRepository {
  private crypto: SubtleCrypto = window.crypto.subtle;
  private repositoryName: string = 'KeyRepository';
  private repository: any;
  private repositoryStoreName: string = 'keys';

  constructor() {}

  open(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported by this browser.'));
      }

      const req = indexedDB.open(this.repositoryName, 1);
      req.onsuccess = () => {
        this.repository = req.result;
        fulfill();
      };
      req.onerror = evt => {
        reject((evt.target as IDBOpenDBRequest).error);
      };
      req.onblocked = () => {
        reject(new Error('Database already open'));
      };
      req.onupgradeneeded = evt => {
        this.repository = (evt.target as IDBOpenDBRequest).result;
        if (
          !this.repository?.objectStoreNames.contains(this.repositoryStoreName)
        ) {
          const objStore = this.repository.createObjectStore(
            this.repositoryStoreName,
            { autoIncrement: true },
          );
          objStore.createIndex('name', 'name', { unique: false });
          objStore.createIndex('spki', 'spki', { unique: false });
          objStore.createIndex('publicKey', 'publicKey', { unique: false });
          objStore.createIndex('privateKey', 'privateKey', { unique: false });
        }
      };
    });
  }

  async generateKey(): Promise<CryptoKeyPair> {
    const keypair: CryptoKeyPair = await this.crypto.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      false,
      ['sign', 'verify'],
    );
    return keypair;
  }

  saveKey(
    publicKey: CryptoKey,
    privateKey: CryptoKey | null,
    name: string,
  ): Promise<any> {
    return new Promise((fulfill, reject) => {
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'));
      }

      window.crypto.subtle
        .exportKey('spki', publicKey)
        .then(spki => {
          const savedObject = {
            publicKey: publicKey,
            privateKey: privateKey,
            name: name,
            spki: spki,
          };

          const transaction = this.repository!.transaction(
            [this.repositoryStoreName],
            'readwrite',
          );
          transaction.onerror = (evt: any) => {
            reject((evt.target as IDBTransaction).error);
          };
          transaction.onabort = (evt: any) => {
            reject((evt.target as IDBTransaction).error);
          };
          transaction.oncomplete = () => {
            fulfill(savedObject);
          };
          const objectStore = transaction.objectStore(this.repositoryStoreName);
          objectStore.add(savedObject);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  clear(): Promise<void> {
    return new Promise((fulfill, reject) => {
      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        'readwrite',
      );
      transaction.onerror = (evt: any) => {
        reject((evt.target as IDBTransaction).error);
      };
      transaction.onabort = (evt: any) => {
        reject((evt.target as IDBTransaction).error);
      };
      transaction.oncomplete = () => {
        fulfill()
      };
      const objectStore = transaction.objectStore(this.repositoryStoreName);
      objectStore.clear();
    });
  }
  close(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'));
      }

      this.repository!.close();
      this.repository = null;
      fulfill();
    });
  }

  listKeys(): Promise<any[]> {
    return new Promise((fulfill, reject) => {
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'));
      }

      const list: any[] = [];

      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        'readonly',
      );
      transaction.onerror = (evt: Event) => {
        reject((evt.target as IDBTransaction).error);
      };
      transaction.onabort = (evt: Event) => {
        reject((evt.target as IDBTransaction).error);
      };

      const objectStore = transaction.objectStore(this.repositoryStoreName);
      const cursor = objectStore.openCursor();

      cursor.onsuccess = (evt: any) => {
        const cursorResult = (evt.target as IDBRequest).result;
        if (cursorResult) {
          list.push({ id: cursorResult.key, value: cursorResult.value });
          cursorResult.continue();
        } else {
          console.log('list', list);
          fulfill(list);
        }
      };
    });
  }
}
