import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Log } from "../MiddlewaleLogger/loggingMiddleware";

export default function Redirector() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
    const match = urls.find(u => u.shortcode === code);

    if (!match) {
      Log("frontend", "error", "redirect", `Shortcode not found: ${code}`);
      navigate("/notfound");
      return;
    }

    if (new Date() > new Date(match.expiresAt)) {
      Log("frontend", "warn", "redirect", `Shortcode expired: ${code}`);
      navigate("/expired");
      return;
    }

    match.clicks.push({
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      geo: "unknown",
    });

    const updated = urls.map(u => (u.shortcode === code ? match : u));
    localStorage.setItem("shortenedUrls", JSON.stringify(updated));

    Log("frontend", "info", "redirect", `Redirected: ${code}`);
    window.location.href = match.url;
  }, [code, navigate]);

  return <div>Redirecting...</div>;
}
