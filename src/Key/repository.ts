import { SavedKey } from "./types"

export default class KeyRepository {
  private repositoryName: string = 'com.mytiki.keys'
  private repository: any
  private repositoryStoreName: string = 'keys'


  save(
    publicKey: CryptoKey,
    privateKey: CryptoKey | null,
    name: string,
  ): Promise<SavedKey> {
    return new Promise((fulfill, reject) => {
      this.open()
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'))
      }

      window.crypto.subtle
        .exportKey('spki', publicKey)
        .then(spki => {
          const savedObject: SavedKey = {
            publicKey: publicKey,
            privateKey: privateKey!,
            name: name,
            spki: spki,
          }

          const transaction = this.repository!.transaction(
            [this.repositoryStoreName],
            'readwrite',
          )
          transaction.onerror = (evt: any) => {
            reject((evt.target as IDBTransaction).error)
          }
          transaction.onabort = (evt: any) => {
            reject((evt.target as IDBTransaction).error)
          }
          transaction.oncomplete = () => {
            fulfill(savedObject)
          }
          const objectStore = transaction.objectStore(this.repositoryStoreName)
          objectStore.add(savedObject)
          this.close()
        })
        .catch(err => {
          reject(err)
          this.close()
        })
    })
  }

  clear(): Promise<void> {
    return new Promise((fulfill, reject) => {
      this.open()
      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        'readwrite',
      )
      transaction.onerror = (evt: any) => {
        reject((evt.target as IDBTransaction).error)
        this.close()
      }
      transaction.onabort = (evt: any) => {
        reject((evt.target as IDBTransaction).error)
        this.close()
      }
      transaction.oncomplete = () => {
        fulfill()
        this.close()
      }
      const objectStore = transaction.objectStore(this.repositoryStoreName)
      objectStore.clear()
    })
  }

  list(): Promise<SavedKey[]> {
    return new Promise((fulfill, reject) => {
      this.open()
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'))
      }

      const list: any[] = []

      const transaction = this.repository!.transaction(
        [this.repositoryStoreName],
        'readonly',
      )
      transaction.onerror = (evt: Event) => {
        this.close()
        reject((evt.target as IDBTransaction).error)
      }
      transaction.onabort = (evt: Event) => {
        this.close()
        reject((evt.target as IDBTransaction).error)
      }

      const objectStore = transaction.objectStore(this.repositoryStoreName)
      const cursor = objectStore.openCursor()

      cursor.onsuccess = (evt: any) => {
        const cursorResult = (evt.target as IDBRequest).result
        if (cursorResult) {
          list.push({ id: cursorResult.key, value: cursorResult.value })
          cursorResult.continue()
        } else {
          this.close()
          fulfill(list)
        }
      }
    })
  }

  private open(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported by this browser.'))
      }

      const req = indexedDB.open(this.repositoryName, 1)
      req.onsuccess = () => {
        this.repository = req.result
        fulfill()
      }
      req.onerror = evt => {
        reject((evt.target as IDBOpenDBRequest).error)
      }
      req.onblocked = () => {
        reject(new Error('Database already open'))
      }
      req.onupgradeneeded = evt => {
        this.repository = (evt.target as IDBOpenDBRequest).result
        if (
          !this.repository?.objectStoreNames.contains(this.repositoryStoreName)
        ) {
          const objStore = this.repository.createObjectStore(
            this.repositoryStoreName,
            { autoIncrement: true },
          )
          objStore.createIndex('name', 'name', { unique: false })
          objStore.createIndex('spki', 'spki', { unique: false })
          objStore.createIndex('publicKey', 'publicKey', { unique: false })
          objStore.createIndex('privateKey', 'privateKey', { unique: false })
        }
      }
    })
  }

  private close(): Promise<void> {
    return new Promise((fulfill, reject) => {
      if (!this.repository) {
        reject(new Error('KeyStore is not open.'))
      }

      this.repository!.close()
      this.repository = null
      fulfill()
    })
  }
}
