export interface IAccount {
  accountId: string;
  username: string;
}

export function setAccount(account: IAccount): void {
  localStorage.setItem("currentAccount", JSON.stringify(account));
}

export function clearAccount(): void {
  localStorage.removeItem("currentAccount");
}

export function getAccount(): IAccount | null {
  const accountStr = localStorage.getItem("currentAccount");
  if (!accountStr) {
    return null;
  }
  return JSON.parse(accountStr);
}

export function getAccounts(): IAccount[] {
  const accountIdsStr = localStorage.getItem("accountIds");
  if (!accountIdsStr) {
    return [];
  }
  return JSON.parse(accountIdsStr);
}

export function addAccount(account: IAccount): void {
  const accountIds = getAccounts();
  if (accountIds.find((a) => a.accountId === account.accountId)) return;

  accountIds.push(account);
  localStorage.setItem("accountIds", JSON.stringify(accountIds));
}

export function getFavorites(): string[] {
  const favoritesStr = localStorage.getItem("favorites");
  if (!favoritesStr) {
    return [];
  }
  console.log("favoritesStr", favoritesStr);
  return JSON.parse(favoritesStr);
}

export function addOrRemoveFavorite(mapName: string): void {
  const favorites = getFavorites();
  const index = favorites.indexOf(mapName);
  if (index === -1) {
    favorites.push(mapName);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
