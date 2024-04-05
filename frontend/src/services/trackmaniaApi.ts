import {
  addAccount,
  getAccount,
  getAccounts,
  setAccount,
} from "./localStorageService";

export interface IMapData {
  id: string;
  mapId: string;
  num: number;
  authorScore: number;
  medal: number;
  name: string;
  personalBest: number;
  respawnCount: number;
  thumbnailUrl: string;
  delta: number | null;
}

export interface ISeasonData {
  num: number;
  name: string;
  maps: IMapData[];
}

export interface ISeasonInfo {
  seasonId: number;
  number: number;
  name: string;
  authorMedalCount: number;
}

export interface IMapRecord {
  personalBest: number;
  medal: number;
}

export async function getMapRecord(mapId: string) {
  const account = getAccount();
  if (!account) {
    return null;
  }

  const url = `http://localhost:4200/maps/${mapId}?id=${account.accountId}`;
  const response = await fetch(url);
  const data: IMapRecord = await response.json();
  return data;
}

export async function getAccountId(username: string) {
  // Check localstorage first
  // COnsufing name, should be localstorageService or something
  const accounts = getAccounts();
  const account = accounts.find((a) => a.username === username);
  if (account) {
    return account.accountId;
  }

  console.log("username passed to getAccountId", username);

  const url = `http://localhost:4200/getAccountId?username=${username}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data) {
    return null;
  }

  addAccount({ accountId: data, username });
  setAccount({ accountId: data, username });
  return data;
}

export async function getSeasons() {
  const account = getAccount();
  if (!account) {
    return null;
  }

  let url = "http://localhost:4200/seasons";
  url += `?id=${account.accountId}`;
  const response = await fetch(url);
  const data: ISeasonInfo[] = await response.json();

  return data;
}

export async function getSeasonRecords(num: number) {
  const account = getAccount();
  if (!account) {
    return null;
  }

  let url = `http://localhost:4200/seasons/${num}`;
  url += `?id=${account.accountId}`;
  const response = await fetch(url);
  const season: ISeasonData = await response.json();
  for (const map of season.maps) {
    // TODO: Do this on backend instead
    map.num = parseInt(map.name.split(" ")[3]);
    map.delta =
      map.personalBest === 0 ? null : map.personalBest - map.authorScore;
  }
  season.maps.sort((a, b) => a.num - b.num);
  return season;
}
