import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mygenerations.css";

const API_BASE = "http://localhost:5000";
const STORAGE_PREFIX = "brandforge_creative_";

const parseStoredCreatives = () => {
  const creatives = [];

  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;

    const raw = sessionStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.imageUrl) {
        creatives.push(parsed);
      }
    } catch {
      // Ignore malformed entries and keep rendering valid creatives.
    }
  }

  return creatives.sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime(),
  );
};

const formatDate = (isoDate) => {
  if (!isoDate) return "Unknown date";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
};

const getDownloadExtension = (url) => {
  if (!url) return "png";
  const cleaned = url.split("?")[0].toLowerCase();
  if (cleaned.endsWith(".jpg") || cleaned.endsWith(".jpeg")) return "jpg";
  if (cleaned.endsWith(".webp")) return "webp";
  if (cleaned.endsWith(".gif")) return "gif";
  return "png";
};

export default function MyGenerations() {
  const navigate = useNavigate();
  const [creatives, setCreatives] = useState([]);

  const fetchCreatives = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/creatives`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setCreatives(data.creatives || []);
      } else {
        setCreatives(parseStoredCreatives());
      }
    } catch {
      setCreatives(parseStoredCreatives());
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, []);

  const countLabel = useMemo(
    () =>
      `${creatives.length} saved creative${creatives.length === 1 ? "" : "s"}`,
    [creatives.length],
  );

  const handleOpen = (id) => {
    navigate(`/generate/${id}`);
  };

  const handleDownload = async (creative) => {
    try {
      const response = await fetch(creative.imageUrl);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext = getDownloadExtension(creative.imageUrl);
      link.href = downloadUrl;
      link.download = `${(creative.title || "creative").replace(/\s+/g, "-").toLowerCase()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      // Keep this silent to avoid disrupting browse flow if browser blocks cross-origin fetch.
      window.open(creative.imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  const refreshList = () => {
    fetchCreatives();
  };

  return (
    <div className="my-generations-page">
      <main className="my-generations-shell">
        <header className="my-generations-header">
          <div>
            <h1>My Generations</h1>
            <p>
              All previously generated product mockups and campaign creatives
              from your account.
            </p>
          </div>
          <div className="my-generations-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/generate")}
            >
              New Generation
            </button>
            <button type="button" className="accent-btn" onClick={refreshList}>
              Refresh
            </button>
          </div>
        </header>

        <p className="my-generations-count">{countLabel}</p>

        {creatives.length === 0 ? (
          <section className="empty-state">
            <h2>No creatives yet</h2>
            <p>
              Generate a product mockup first, then it will appear here
              automatically.
            </p>
            <button
              type="button"
              className="accent-btn"
              onClick={() => navigate("/generate")}
            >
              Create First Creative
            </button>
          </section>
        ) : (
          <section className="generations-grid">
            {creatives.map((creative) => (
              <article
                key={creative._id || creative.id}
                className="generation-card"
              >
                <div className="generation-media-wrap">
                  <img
                    src={creative.imageUrl}
                    alt={`${creative.title || "Generated"} creative`}
                    className="generation-image"
                  />
                  <div className="generation-overlay">
                    <button
                      type="button"
                      className="overlay-btn"
                      onClick={() => handleOpen(creative._id || creative.id)}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="overlay-btn"
                      onClick={() => handleDownload(creative)}
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div className="generation-content">
                  <h3>{creative.title || "Untitled Creative"}</h3>
                  <p>{creative.outputType || "Product Marketing Mockup"}</p>
                  <p>
                    {creative.aspectRatio || "16:9"} •{" "}
                    {creative.thumbnailStyle || "Bold & Graphic"}
                  </p>
                  <p>ID: {creative._id || creative.id}</p>
                  <p>Created: {formatDate(creative.createdAt)}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
