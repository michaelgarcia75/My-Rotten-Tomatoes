import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NavBar({ auth, setAuth, user, setUser }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const pages = ["Movies", "Top Movies", "Upcoming", "Favourites", "Category"];
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePages = (page) => {
    handleClose();
    switch (page) {
      case "Movies":
        router.push("/");
        break;
      case "Top Movies":
        auth ? router.push("/topmovies") : router.push("/login");
        break;
      case "Upcoming":
        auth ? router.push("/upcoming") : router.push("/login");
        break;
      case "Category":
        auth ? router.push("/category") : router.push("/login");
        break;
      case "Favourites":
        auth ? router.push("/dashboard") : router.push("/login");
        break;
      default:
        router.push("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(false);
    setUser({});
    handleClose();
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handlePages(page)}
              sx={{ mx: 4, my: 2, color: "white", display: "block" }}
            >
              {page}
            </Button>
          ))}

          <Button
            sx={{ display: "block", mt: 2 }}
            onClick={handleOpen}
          ></Button>

          {user.is_admin && (
            <>
              <Button
                key=""
                onClick={() => router.push("/admin/users")}
                sx={{ mx: 4, my: 2, color: "white", display: "block" }}
              >
                UsersCrud
              </Button>
              <Button
                key=""
                onClick={() => router.push("/admin/movies")}
                sx={{ mx: 4, my: 2, color: "white", display: "block" }}
              >
                MoviesCrud
              </Button>
            </>
          )}
        </Box>

        {auth && (
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/profile");
                }}
              >
                My account
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
        {!auth && (
          <Button
            onClick={() => router.push("/login")}
            sx={{ mx: 4, my: 2, color: "white", display: "block" }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
