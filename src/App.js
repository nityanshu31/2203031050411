import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ShortenerForm from "./components/Shortener";
import ShortenerStats from "./components/Stats";
import Redirector from "./components/Redirect";
import {
  Container,AppBar,Toolbar,Button,Typography,Box,Paper,
} from "@mui/material";

function NotFound() {
  return (
    <Paper style={{ padding: 0, marginTop: 0 }}>
      <Typography variant="h5" color="error">Short URL Not Found</Typography>
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/">Go Home</Button>
      </Box>
    </Paper>
  );
}

function Expired() {
  return (
    <Paper style={{ padding: 0, marginTop: 0 }}>
      <Typography variant="h5" color="error">Short URL Expired</Typography>
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/">Go Home</Button>
      </Box>
    </Paper>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ backgroundColor: "#2f5d4e" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button color="inherit" component={Link} to="/" sx={{ mx: 0 }}>
            Shortener
          </Button>
          <Button color="inherit" component={Link} to="/stats" sx={{ mx: 0 }}>
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 0 }}>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<ShortenerStats />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/:code" element={<Redirector />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
