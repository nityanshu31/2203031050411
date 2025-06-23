import React, { useState } from "react";
import { Log } from "../MiddlewaleLogger/loggingMiddleware";
import {
  TextField,Button,Typography,Paper,Box,Link,
} from "@mui/material";

const MAX = 5;
const DEFAULT_MINUTES = 30;

const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const isCode = (s) => /^[a-zA-Z0-9]{4,16}$/.test(s);
const makeCode = () => Math.random().toString(36).slice(2, 8);

export default function ShortenerForm({ onShortened }) {
  const [fields, setFields] = useState(
    Array.from({ length: MAX }, () => ({ url: "", validity: "", code: "" }))
  );
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  const update = (i, key, val) => {
    const copy = [...fields];
    copy[i][key] = val;
    setFields(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prev = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
    const used = new Set(prev.map((r) => r.shortcode));
    const next = [], errs = [];
    let hasErr = false;

    for (let i = 0; i < MAX; i++) {
      const { url, validity, code } = fields[i];
      if (!url) continue;

      const validMin = parseInt(validity) || DEFAULT_MINUTES;
      let short = code || makeCode();

      if (!isUrl(url)) {
        errs[i] = "Invalid URL";
        await Log("frontend", "error", "validation", `Bad URL: ${url}`);
        hasErr = true;
        continue;
      }

      if (code && !isCode(code)) {
        errs[i] = "4–16 letters/numbers only";
        await Log("frontend", "error", "validation", `Invalid code: ${code}`);
        hasErr = true;
        continue;
      }

      if (used.has(short)) {
        errs[i] = "Code already used";
        await Log("frontend", "error", "validation", `Duplicate code: ${short}`);
        hasErr = true;
        continue;
      }

      used.add(short);
      const now = new Date();
      const expires = new Date(now.getTime() + validMin * 60000);

      const item = {
        url,
        shortcode: short,
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        clicks: [],
      };

      next.push(item);
      await Log("frontend", "info", "shortener", `Shortened ${url} -> ${short}`);
    }

    setErrors(errs);
    if (!hasErr && next.length) {
      const all = [...prev, ...next];
      localStorage.setItem("shortenedUrls", JSON.stringify(all));
      setResults(next);
      onShortened?.(next);
    } else {
      setResults([]);
    }
  };

  return (
    <Paper
      style={{
        padding: 28,
        marginBottom: 30,
        borderRadius: 12,
        background: "#f5f7fa",
        maxWidth: 700,
        marginInline: "auto",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Shorten up to 5 URLs
      </Typography>

      <form onSubmit={handleSubmit}>
        {fields.map((f, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              background: "#fff",
              boxShadow: "0 1px 3px #e0e0e0",
            }}
          >
            <TextField
              label="URL"
              value={f.url}
              onChange={(e) => update(i, "url", e.target.value)}
              fullWidth
              error={!!errors[i]}
              helperText={errors[i]}
              size="small"
              sx={{ background: "#f9f9f9", flex: 2 }}
            />
            <TextField
              label="Valid Time"
              value={f.validity}
              onChange={(e) => update(i, "validity", e.target.value)}
              size="small"
              sx={{ background: "#f9f9f9", width: 100 }}
            />
            <TextField
              label="Shortcode"
              value={f.code}
              onChange={(e) => update(i, "code", e.target.value)}
              size="small"
              sx={{ background: "#f9f9f9", width: 140 }}
            />
          </Box>
        ))}

        <Box textAlign="right">
          <Button type="submit" variant="contained" sx={{ mt: 1, px: 4 }}>
            Shorten URLs
          </Button>
        </Box>
      </form>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" mb={1}>
            Shortened URLs
          </Typography>
          {results.map((r, i) => (
            <Box
              key={i}
              sx={{
                mb: 2,
                p: 2,
                background: "#f8fafc",
                borderLeft: "4px solid #1976d2",
                borderRadius: 1,
              }}
            >
              <div>
                <strong>Original:</strong>{" "}
                <Link href={r.url} target="_blank" rel="noopener">
                  {r.url}
                </Link>
              </div>
              <div>
                <strong>Short:</strong>{" "}
                <Link href={`/${r.shortcode}`} target="_blank" rel="noopener">
                  {window.location.origin}/{r.shortcode}
                </Link>
              </div>
              <div>
                <strong>Expires:</strong>{" "}
                {new Date(r.expiresAt).toLocaleString()}
              </div>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
