import { AppBar, Box, Toolbar } from "@mui/material";
import PageTitle from "../custom/PageTitle";

const Header: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ backgroundColor: "#778d82" }}>
        <Box
          component="img"
          src="/favicon.png"
          alt="logo"
          sx={{
            width: 36,
            height: 36,
            mr: 1,
          }}
        />

        <PageTitle
          title="AI Command Center"
          style={{ marginBottom: 0 }}
        ></PageTitle>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
