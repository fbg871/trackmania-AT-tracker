import { List, ListItemButton, ListItemText, Paper } from "@mui/material";
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
    <List
      sx={{
        width: "100%",
      }}
    >
      {accountHistory.map((account, index) => (
        <ListItemButton
          key={index}
          onClick={() => handleUsernameClick(account)}
        >
          <Paper style={{ padding: "10px", width: "100%" }}>
            <ListItemText primary={account.username} />
          </Paper>
        </ListItemButton>
      ))}
    </List>
  );
}

export default AccountHistoryList;
