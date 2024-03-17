export interface IMapData {
  num: number;
  authorScore: number;
  medal: number;
  name: string;
  personalBest: number;
  respawnCount: number;
  thumbnailUrl: string;
}

export interface ISeasonData {
  name: string;
  maps: IMapData[];
}

export async function getMyOfficialRecords() {
  // Hardcode for now
  const url = "http://localhost:4200/my-pbs";
  const response = await fetch(url);
  const data: ISeasonData[] = await response.json();
  for (const season of data) {
    for (const map of season.maps) {
      // TODO: Do this on backend instead
      map.num = parseInt(map.name.split(" ")[3]);
    }
    season.maps.sort((a, b) => a.num - b.num);
  }
  console.log(data);
  return data;
}
