import { FirestoreDataConverter } from "@firebase/firestore";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import { Dayjs } from "dayjs";

export interface League {
  id: string,
  name: string,
  players: [];
}

export interface Player {
  id: string
  firstName: string
  lastName: string
  nickName: string
  photoUrl: string
}

export interface TeamHalf {
  players: string[],
  score: number,
}

export interface Half {
  bibs: TeamHalf
  shirts: TeamHalf
}

export interface Game {
  id: string
  date: Date,
  firstHalf: Half,
  secondHalf: Half,
  playerOfMatch: string
}

export function defaultConverter<T>(extraFromMapping? : (data : DocumentData) => Partial<T>): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: T) {
      return { ...modelObject } as DocumentData
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data, ...extraFromMapping ? extraFromMapping(data) : {}} as T
    }
  }
} 