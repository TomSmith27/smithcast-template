import firebase from 'firebase/compat'
import DocumentData = firebase.firestore.DocumentData
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter

export function defaultConverter<T>(extraFromMapping?: (data: DocumentData) => Partial<T>): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: T) {
      return { ...modelObject } as DocumentData
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data, ...extraFromMapping ? extraFromMapping(data) : {} } as T
    }
  }
} 