import React, { useEffect, useState } from "react";
import {
  Paper,Typography,Table,TableBody,TableCell,TableHead,TableRow,Link,Box,
} from "@mui/material";
import { Log } from "../MiddlewaleLogger/loggingMiddleware";

export default function ShortenerStats() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
    setUrls(data);
    Log("frontend", "info", "stats", "Loaded statistics page");
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shortened URLs & Stats
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {urls.map((u, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Link href={`/${u.shortcode}`} target="_blank">
                  {window.location.origin}/{u.shortcode}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={u.url} target="_blank">
                  {u.url}
                </Link>
              </TableCell>
              <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(u.expiresAt).toLocaleString()}</TableCell>
              <TableCell>
                {u.clicks.length}
                <Box sx={{ fontSize: "0.85em", mt: 1 }}>
                  {u.clicks.map((c, i) => (
                    <div key={i}>
                      {new Date(c.timestamp).toLocaleString()} — {c.source}, {c.geo}
                    </div>
                  ))}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
