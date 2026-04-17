import { Grid } from "@mui/material";
import Header from "./components/nav/Header";
import Sidebar from "./components/nav/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Grid container spacing={2} sx={{ mt: 10 }}>
        <Grid size={3} sx={{ borderRight: "1px solid #ccc;" }}>
          <Sidebar />
        </Grid>
        <Grid size={9}>{children}</Grid>
      </Grid>
    </>
  );
};

export default Layout;
