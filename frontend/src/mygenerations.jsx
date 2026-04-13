import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mygenerations.css";

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

export default function MyGenerations() {
  const navigate = useNavigate();
  const [creatives, setCreatives] = useState([]);

  useEffect(() => {
    setCreatives(parseStoredCreatives());
  }, []);

  const countLabel = useMemo(
    () =>
      `${creatives.length} saved creative${creatives.length === 1 ? "" : "s"}`,
    [creatives.length],
  );

  const handleOpen = (id) => {
    navigate(`/generate/${id}`);
  };

  const handleDownload = (creative) => {
    const link = document.createElement("a");
    link.href = creative.imageUrl;
    link.download = `${(creative.title || "creative").replace(/\s+/g, "-").toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshList = () => {
    setCreatives(parseStoredCreatives());
  };

  return (
    <div className="my-generations-page">
      <main className="my-generations-shell">
        <header className="my-generations-header">
          <div>
            <h1>My Generations</h1>
            <p>
              All previously generated product mockups and campaign creatives
              from this browser session.
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
              <article key={creative.id} className="generation-card">
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
                      onClick={() => handleOpen(creative.id)}
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
                  <p>ID: {creative.id}</p>
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
