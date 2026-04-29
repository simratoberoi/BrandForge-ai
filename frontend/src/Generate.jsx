import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Generate.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/_/backend";

const getAuthToken = () => localStorage.getItem("authToken");

const getAuthHeaders = (extra = {}) => ({
  ...extra,
  Authorization: `Bearer ${getAuthToken()}`,
});

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const parseApiResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (response.ok && data?.success) {
    return data;
  }

  const primary =
    data?.message || `Request failed with status ${response.status}`;
  const detail = data?.error;
  const message = detail ? `${primary} ${detail}` : primary;
  throw new Error(message);
};

const getDownloadExtension = (url) => {
  if (!url) return "png";
  const cleaned = url.split("?")[0].toLowerCase();
  if (cleaned.endsWith(".jpg") || cleaned.endsWith(".jpeg")) return "jpg";
  if (cleaned.endsWith(".webp")) return "webp";
  if (cleaned.endsWith(".gif")) return "gif";
  return "png";
};

const colorSchemes = [
  {
    id: "vibrant",
    name: "Vibrant",
    swatch: "linear-gradient(90deg,#22d3ee,#f43f5e,#f97316)",
  },
  {
    id: "ocean",
    name: "Ocean",
    swatch: "linear-gradient(90deg,#0ea5e9,#22d3ee,#0f766e)",
  },
  {
    id: "mint",
    name: "Mint",
    swatch: "linear-gradient(90deg,#10b981,#6ee7b7,#22c55e)",
  },
  {
    id: "orchid",
    name: "Orchid",
    swatch: "linear-gradient(90deg,#8b5cf6,#a855f7,#c084fc)",
  },
  {
    id: "mono",
    name: "Mono",
    swatch: "linear-gradient(90deg,#6b7280,#9ca3af,#d1d5db)",
  },
  {
    id: "neon",
    name: "Neon",
    swatch: "linear-gradient(90deg,#06b6d4,#e879f9,#fde047)",
  },
  {
    id: "blush",
    name: "Blush",
    swatch: "linear-gradient(90deg,#fca5a5,#fbcfe8,#fecdd3)",
  },
];

const styles = ["Bold & Graphic", "Minimal & Clean", "Cinematic", "Retro Wave"];
const ratios = ["16:9", "1:1", "9:16"];
const outputTypes = [
  "Product Marketing Mockup",
  "Lifestyle Scene",
  "Studio Ad",
  "Landing Page Hero",
  "Social Media Creative",
];
const loadingMessages = [
  "Analyzing product contours and edges...",
  "Building scene composition and depth...",
  "Applying style, lighting, and brand color mood...",
  "Finalizing export-ready creative...",
];

const Generate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [thumbnailStyle, setThumbnailStyle] = useState(styles[0]);
  const [colorScheme, setColorScheme] = useState(colorSchemes[0]);
  const [model] = useState("premium");
  const [outputType, setOutputType] = useState(outputTypes[0]);
  const [additionalPrompts, setAdditionalPrompts] = useState("");
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageName, setProductImageName] = useState("");
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState("");
  const [generatedCreative, setGeneratedCreative] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [feedback, setFeedback] = useState({ tone: "info", text: "" });
  const loadingIntervalRef = useRef(null);

  const titleCount = useMemo(() => title.length, [title]);
  const storageKey = useMemo(
    () => (id ? `brandforge_creative_${id}` : ""),
    [id],
  );

  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      if (sourcePreviewUrl) {
        URL.revokeObjectURL(sourcePreviewUrl);
      }
    };
  }, [sourcePreviewUrl]);

  useEffect(() => {
    if (!id) return;

    const token = getAuthToken();
    if (!token) {
      setFeedback({
        tone: "error",
        text: "Please login to access this creative.",
      });
      navigate("/login");
      return;
    }

    const loadCreative = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/creatives/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Creative not found");
        }

        const parsed = data.creative;
        setTitle(parsed.title || "");
        setAspectRatio(parsed.aspectRatio || "16:9");
        setThumbnailStyle(parsed.thumbnailStyle || styles[0]);
        setModel(parsed.model || "premium");
        setOutputType(parsed.outputType || outputTypes[0]);
        setAdditionalPrompts(parsed.additionalPrompts || "");
        setProductImageName(parsed.productImageName || "");
        const selectedScheme = colorSchemes.find(
          (scheme) => scheme.id === parsed.colorSchemeId,
        );
        setColorScheme(selectedScheme || colorSchemes[0]);
        setGeneratedCreative(parsed);
        setFeedback({
          tone: "info",
          text: "Loaded creative from your account.",
        });
      } catch {
        // Optional fallback for old local-only items
        if (storageKey) {
          const raw = sessionStorage.getItem(storageKey);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              setGeneratedCreative(parsed);
              return;
            } catch {}
          }
        }
        setFeedback({
          tone: "error",
          text: "Unable to load this creative.",
        });
      }
    };

    loadCreative();
  }, [id, storageKey, navigate]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProductImageFile(null);
      setProductImageName("");
      if (sourcePreviewUrl) {
        URL.revokeObjectURL(sourcePreviewUrl);
        setSourcePreviewUrl("");
      }
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setFeedback({
        tone: "error",
        text: "Please upload a valid image file.",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFeedback({
        tone: "error",
        text: "Image is too large. Please upload an image smaller than 10MB.",
      });
      return;
    }

    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setProductImageFile(file);
    setSourcePreviewUrl(objectUrl);
    setProductImageName(file.name);
    setFeedback({
      tone: "info",
      text: "Product image attached. Ready to generate.",
    });
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setFeedback({
        tone: "error",
        text: "Add a product or campaign title before generating.",
      });
      return;
    }

    if (!productImageFile) {
      setFeedback({
        tone: "error",
        text: "Upload a product image to generate creative output.",
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setFeedback({
        tone: "error",
        text: "Please login to generate creatives.",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setLoadingIndex(0);
    setFeedback({
      tone: "info",
      text: "Generation started. This usually takes a few seconds.",
    });

    loadingIntervalRef.current = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 850);

    try {
      // 1) Send source image + options to generation API
      const formData = new FormData();
      formData.append("image", productImageFile);
      formData.append("title", title);
      formData.append("outputType", outputType);
      formData.append("aspectRatio", aspectRatio);
      formData.append("thumbnailStyle", thumbnailStyle);
      formData.append("colorSchemeId", colorScheme.id);
      formData.append("model", model);
      formData.append("additionalPrompts", additionalPrompts);
      formData.append(
        "productImageName",
        productImageName || productImageFile.name,
      );

      const genRes = await fetch(`${API_BASE}/api/generations/generate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      const genData = await parseApiResponse(genRes);

      // 2) Save metadata in MongoDB
      const savePayload = {
        title,
        outputType,
        aspectRatio,
        thumbnailStyle,
        colorSchemeId: colorScheme.id,
        model,
        additionalPrompts,
        productImageName: productImageName || productImageFile.name,
        imageUrl: genData.generatedImageUrl,
        prompt: genData.prompt || "",
        sourceImageUrl: genData.sourceImageUrl || "",
        sourcePublicId: genData.sourcePublicId || "",
        generatedPublicId: genData.generatedPublicId || "",
      };

      const saveRes = await fetch(`${API_BASE}/api/creatives`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(savePayload),
      });
      const saveData = await parseApiResponse(saveRes);

      const created = saveData.creative;
      setGeneratedCreative(created);
      setFeedback({
        tone: "success",
        text: "Creative generated and saved successfully.",
      });
      navigate(`/generate/${created._id || created.id}`, { replace: true });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error.message || "Something went wrong during generation.",
      });
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedCreative?.imageUrl) return;

    try {
      const response = await fetch(generatedCreative.imageUrl);
      if (!response.ok) {
        throw new Error("Failed to download generated image");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext = getDownloadExtension(generatedCreative.imageUrl);
      link.href = downloadUrl;
      link.download = `${(generatedCreative.title || "creative").replace(/\s+/g, "-").toLowerCase()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setFeedback({
        tone: "error",
        text: "Unable to download image right now. Please try again.",
      });
    }
  };

  return (
    <div className="generate-page">
      <main className="generate-shell">
        <header className="generate-header">
          <div>
            <p className="header-kicker">AI Campaign Studio</p>
            <h1>New Product Creative</h1>
            <p>
              Build a premium-ready visual with precise output settings and
              brand mood.
            </p>
          </div>
          <div className="header-actions">
            <span className="status-pill">Status: Draft</span>
          </div>
        </header>

        <section className="generate-panel-grid">
          <aside className="generate-media-panel">
            <article className="panel-card panel-card--preview">
              <header className="panel-card-header">
                <div>
                  <h2>Creative Preview</h2>
                  <p>Live view of the generated output and details.</p>
                </div>
              </header>
              {isLoading ? (
                <div className="preview-dropzone loading-state">
                  <div className="loading-spinner" aria-hidden="true" />
                  <h3>Generating your creative</h3>
                  <p>{loadingMessages[loadingIndex]}</p>
                </div>
              ) : generatedCreative ? (
                <div className="preview-ready">
                  <div className="preview-media-wrap">
                    <img
                      src={generatedCreative.imageUrl}
                      alt="Generated marketing creative preview"
                      className="generated-preview-image"
                    />
                    <div className="preview-overlay">
                      <button
                        type="button"
                        className="download-btn"
                        onClick={handleDownload}
                      >
                        Download Creative
                      </button>
                    </div>
                  </div>
                  <div className="preview-meta">
                    <p>
                      Creative ID:{" "}
                      {generatedCreative._id || generatedCreative.id}
                    </p>
                    <p>
                      {generatedCreative.outputType} •{" "}
                      {generatedCreative.aspectRatio} •{" "}
                      {generatedCreative.thumbnailStyle}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="preview-dropzone">
                  <div className="preview-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3.5"
                        y="4.5"
                        width="17"
                        height="15"
                        rx="2.5"
                        stroke="currentColor"
                      />
                      <circle cx="9" cy="10" r="2" stroke="currentColor" />
                      <path
                        d="M20 15L15.5 11L8 18"
                        stroke="currentColor"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h3>Generate your first campaign visual</h3>
                  <p>
                    Upload a product image, choose output type, and click
                    Generate
                  </p>
                  {sourcePreviewUrl && (
                    <img
                      src={sourcePreviewUrl}
                      alt="Selected source product"
                      className="source-preview-thumb"
                    />
                  )}
                </div>
              )}
            </article>

            <article className="panel-card panel-card--assets">
              <header className="panel-card-header">
                <div>
                  <h2>Product Assets</h2>
                  <p>Upload a clean shot to anchor the generation.</p>
                </div>
                <span className="panel-chip">Required</span>
              </header>
              <div className="photo-row">
                <div className="photo-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M4 20C4.8 16.8 7.6 15 12 15C16.4 15 19.2 16.8 20 20"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="photo-meta">
                  <p>
                    Product Image <span>(required)</span>
                  </p>
                  <label className="upload-btn" htmlFor="photo-upload">
                    Upload Product
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              <div className="asset-preview-grid">
                {sourcePreviewUrl ? (
                  <img
                    src={sourcePreviewUrl}
                    alt="Selected source product"
                    className="asset-thumb"
                  />
                ) : (
                  <div className="asset-thumb asset-thumb--empty">
                    <span>Source</span>
                  </div>
                )}
                {generatedCreative?.imageUrl ? (
                  <img
                    src={generatedCreative.imageUrl}
                    alt="Generated creative thumbnail"
                    className="asset-thumb"
                  />
                ) : (
                  <div className="asset-thumb asset-thumb--empty">
                    <span>Generated</span>
                  </div>
                )}
                <div className="asset-thumb asset-thumb--add">+</div>
              </div>
              {productImageName && (
                <p className="field-hint">Attached: {productImageName}</p>
              )}
            </article>
          </aside>

          <article className="generate-details-panel">
            <div className="panel-card">
              <header className="panel-card-header">
                <div>
                  <h2>Product Details</h2>
                  <p>Key inputs that shape output quality and brand fit.</p>
                </div>
              </header>
              <div className="detail-tabs">
                <button type="button" className="detail-tab active">
                  General
                </button>
                <button type="button" className="detail-tab">
                  Advanced
                </button>
              </div>

              {feedback.text && (
                <p className={`feedback-banner ${feedback.tone}`}>
                  {feedback.text}
                </p>
              )}

              <div className="detail-grid">
                <div>
                  <label className="field-label" htmlFor="title-input">
                    Product / Campaign Title
                  </label>
                  <div className="field-with-counter">
                    <input
                      id="title-input"
                      maxLength={100}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. Revive Hydration Bottle - Summer Launch"
                    />
                    <span>{titleCount}/100</span>
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="style-select">
                    Creative Direction
                  </label>
                  <select
                    id="style-select"
                    value={thumbnailStyle}
                    onChange={(event) => setThumbnailStyle(event.target.value)}
                  >
                    {styles.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <p className="field-hint">
                    Controls composition, typography feel, and visual intensity
                  </p>
                </div>

                <div className="detail-span">
                  <p className="field-label">Output Type</p>
                  <div className="output-grid">
                    {outputTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOutputType(type)}
                        className={
                          outputType === type
                            ? "output-btn active"
                            : "output-btn"
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="field-label">Aspect Ratio</p>
                  <div className="ratio-grid">
                    {ratios.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={
                          aspectRatio === ratio
                            ? "ratio-btn active"
                            : "ratio-btn"
                        }
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="field-label">Brand Color Mood</p>
                  <div className="color-row">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        aria-label={scheme.name}
                        onClick={() => setColorScheme(scheme)}
                        className={
                          colorScheme.id === scheme.id
                            ? "color-chip active"
                            : "color-chip"
                        }
                        style={{ background: scheme.swatch }}
                      />
                    ))}
                  </div>
                  <p className="field-hint">Selected: {colorScheme.name}</p>
                </div>

                <div className="detail-span">
                  <label className="field-label" htmlFor="additional-prompts">
                    Additional Prompts <span>(optional)</span>
                  </label>
                  <textarea
                    id="additional-prompts"
                    placeholder="Describe background, lighting, prop ideas, angle, and campaign mood..."
                    value={additionalPrompts}
                    onChange={(event) =>
                      setAdditionalPrompts(event.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Marketing Creative"}
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Generate;
