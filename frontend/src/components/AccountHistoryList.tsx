import { List, ListItem, ListItemText, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IAccount,
  getAccounts,
  setAccount,
} from "../services/localStorageService";

function AccountHistoryList() {
  const [accountHistory, setAccountHistory] = useState<IAccount[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accounts = getAccounts();
    setAccountHistory(accounts);
    // clearAccount();
  }, []);

  const handleUsernameClick = (account: IAccount) => {
    setAccount(account);
    navigate("/seasons");
    console.log(account);
  };

  return (
    <List>
      {accountHistory.map((account, index) => (
        <ListItem
          key={index}
          button
          onClick={() => handleUsernameClick(account)}
          style={{ margin: "10px 0" }}
        >
          <Paper style={{ padding: "10px", width: "100%" }}>
            <ListItemText primary={account.username} />
          </Paper>
        </ListItem>
      ))}
    </List>
  );
}

export default AccountHistoryList;
