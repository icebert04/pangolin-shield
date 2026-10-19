"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function chooseImage(file?: File) {
    setError("");
    setAnalysis("");
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSelectedFile(null);
      setPreview(null);
      setFilename("");
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setSelectedFile(null);
      setPreview(null);
      setFilename("");
      setError("This image is over 8 MB. Choose a smaller file to continue.");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setFilename(file.name);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseImage(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseImage(event.dataTransfer.files[0]);
  }

  async function assessImage() {
    const file = selectedFile;
    if (!file) {
      setError("Choose a coffee leaf photo before starting the assessment.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        analysis?: string;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error ?? "The assessment could not be completed.");
      }
      if (!result.analysis) {
        throw new Error("The assessment service returned no results.");
      }
      setAnalysis(result.analysis);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        🫘 🍃 B2B Coffee Pathology &amp; Early-Warning Infrastructure
        <span className="announcement-arrow">↗</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Beringei Shield home">
          <span className="brand-mark" aria-hidden="true">
            🦍
          </span>
          <span>Beringei Shield</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#approach">System Architecture</a>
          <a href="#beringei-shield">Live Engine Demo</a>
        </nav>
        {/* <a className="header-cta" href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer">
          Launch WhatsApp Bot <span aria-hidden="true">↗</span>
        </a> */}
        <a className="header-cta" href="#beringei-shield">
          Try the demo <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> ☕ A new perspective on coffee health</p>
          <h1>
            Get a Glimpse of your <em>coffee&apos;s</em> health in seconds.
          </h1>
          <p className="hero-description">
            Sub-second AI diagnostic screening for Twig Borer, Phoma, and Cercospora.<br/>
            Engineered specifically for agricultural cooperatives, exporters, and field agronomists.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a className="primary-link" href="#beringei-shield" style={{ background: "#294B37", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600 }}>
              Take a look <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-footnote" style={{ marginTop: "2rem" }}>
            <span className="footnote-line" />
            <span>Zero-latency infrastructure built for the people who know the land best.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Illustration of a coffee plant">
          <div className="art-circle art-circle-one" />
          <div className="art-circle art-circle-two" />
          <div className="art-sun" />
          <div className="art-label"><span /> Vision Telemetry</div>
          <svg className="coffee-plant" viewBox="0 0 520 590" fill="none" role="img" aria-label="Coffee branch and leaves">
            <path d="M256 570C261 471 250 381 280 283c14-46 44-92 86-135" stroke="#294B37" strokeWidth="9" strokeLinecap="round" />
            <path d="M258 460c-48-73-91-111-151-138M265 384c48-77 100-111 166-137M276 309c-27-68-31-121-20-184" stroke="#294B37" strokeWidth="7" strokeLinecap="round" />
            <path d="M107 321C42 316 25 264 35 225c64-13 110 22 112 78-11 12-24 18-40 18Z" fill="#537A4F" />
            <path d="M71 248c26 19 48 41 69 72M424 251c53-12 76-61 65-103-57-5-103 28-106 78 10 13 24 21 41 25Z" fill="#75945F" />
            <path d="M452 175c-24 23-45 47-67 74M250 126c-42-47-29-101 1-126 51 28 68 78 39 120-16 5-29 5-40 6Z" fill="#4A7045" />
            <path d="M250 24c12 33 19 64 24 97M194 427c-53-34-109-13-130 25 37 48 92 58 129 20 4-17 4-31 1-45Z" fill="#8AA06A" />
            <path d="M313 348c57-25 108 3 123 49-44 41-100 42-131 0 0-17 2-33 8-49Z" fill="#658452" />
            <path d="M419 378c-34-2-66 3-98 15M241 125c5 58 6 116 5 174M259 399c-36-35-78-69-126-101M279 309c39-39 82-71 132-96" stroke="#C1CBA8" strokeWidth="2" strokeLinecap="round" />
            <g fill="#9B593A">
              <circle cx="135" cy="290" r="9" /><circle cx="151" cy="304" r="8" /><circle cx="165" cy="318" r="7" />
              <circle cx="389" cy="247" r="8" /><circle cx="373" cy="258" r="7" />
            </g>
          </svg>
          <div className="art-caption">
            <span className="caption-number">01</span>
            <span>Zero Hallucination<br />Guardrail Core.</span>
          </div>
          <div className="art-stamp">INSTITUTIONAL<br />GRADE</div>
        </div>
      </section>

      <section className="ticker" aria-label="What Beringei Shield looks for">
        <span>TWIG BORER</span><i>✳</i>
        <span>PHOMA BLIGHT</span><i>✳</i>
        <span>CERCOSPORA</span><i>✳</i>
        <span>AUTOMATED FIELD TRIAGE</span>
      </section>

      <section className="approach section-shell" id="approach">
        <div className="approach-intro">
          <p className="eyebrow"><span /> Architectural Rigor</p>
          <h2>Built for the <em>realities</em> of commercial coffee supply chains.</h2>
        </div>
        <p className="approach-copy">
          Generic AI chat wrappers hallucinate on agricultural data.<br/> Beringei Shield is an early look at how a simple photo might help teams spot patterns, and hyperfocused AI to instantly isolate crop pathology in the field.
        </p>
        <div className="steps">
          <article className="step">
            <span className="step-index">01 / INGESTION</span>
            <span className="step-icon icon-camera" aria-hidden="true">⌕</span>
            <h3>Start with a photo</h3>
            <p>Capture a clear image of a coffee leaf, right where the question begins.</p>
          </article>
          <article className="step">
            <span className="step-index">02 / GUARDRAIL</span>
            <span className="step-icon icon-spark" aria-hidden="true">✳</span>
            <h3>Get a useful read</h3>
            <p>AI validates images and invalid data instantly before diagnostic processing.</p>
          </article>
          <article className="step">
            <span className="step-index">03 / ACTION</span>
            <span className="step-icon icon-path" aria-hidden="true">↗</span>
            <h3>Know what to do</h3>
            <p>Precise pathology identification and immediate steps delivered back to the field in seconds.</p>
          </article>
        </div>
      </section>

      <section className="demo-section" id="beringei-shield">
        <div className="demo-heading">
          <p className="eyebrow"><span /> Production Engine Sandbox</p>
          <h2>Test the <em>Diagnostic</em> Pipeline.</h2>
          <p>Upload a coffee leaf sample to evaluate response speed and disease classification precision.</p>
        </div>
        <div className="demo-card">
          <div
            className={`upload-panel${dragging ? " is-dragging" : ""}${preview ? " has-preview" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={inputRef}
              className="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              aria-label="Choose a coffee leaf image"
            />
            {preview ? (
              <div className="preview-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="preview-image" src={preview} alt="Selected coffee leaf for assessment" />
                <div className="preview-overlay">
                  <span>READY FOR PIPELINE EVALUATION</span>
                  <strong>{filename}</strong>
                </div>
                <button
                  className="change-image"
                  type="button"
                  onClick={() => inputRef.current?.click()}
                >
                  Change image
                </button>
              </div>
            ) : (
              <button
                className="upload-target"
                type="button"
                onClick={() => inputRef.current?.click()}
              >
                <span className="upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 21V7m0 0-5 5m5-5 5 5M6 19v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <strong>Drop a coffee leaf sample here 🍃</strong>
                <span>or <u>browse files</u> from your system</span>
                <small>JPEG, PNG, or WebP · up to 8 MB</small>
              </button>
            )}
          </div>
          <div className="result-panel">
            <div className="result-topline">
              <span><i /> Beringei Shield / GEMINI FLASH ENGINE</span>
              <span>TESTNET</span>
            </div>
            <div className={`result-body${analysis ? " has-analysis" : ""}`}>
              {loading ? (
                <div className="loading-state" role="status">
                  <span className="loader" />
                  <h3>Executing Pathology Triage… ☕</h3>
                  <p>Passing byte payload through guardrails &amp; vision model.</p>
                </div>
              ) : analysis ? (
                <div className="analysis-result" aria-live="polite">
                  <span className="result-kicker">DIAGNOSTIC OUTPUT</span>
                  <h3>Pathology Assessment</h3>
                  <p>{analysis}</p>
                  <div className="result-disclaimer">Production pipeline test result.<br/> Verified for cooperative use.</div>
                </div>
              ) : (
                <div className="empty-result">
                  <span className="result-leaf" aria-hidden="true">✳</span>
                  <h3>Awaiting leaf payload 🫘</h3>
                  <p>Upload a clear photo to test backend diagnostic accuracy.</p>
                </div>
              )}
            </div>
            <div className="result-bottom">
              <span className="privacy-note"><span aria-hidden="true">⌑</span> Images processed securely for real-time analysis.</span>
              <button
                className="analyze-button"
                onClick={assessImage}
                type="button"
                disabled={loading || !preview}
              >
                {loading ? "Processing…" : "Run Diagnostics"} <span aria-hidden="true">↗</span>
              </button>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
          </div>
        </div>
        <p className="demo-note">
          This is an early proof of concept.<br/>
           AI results can be incomplete or incorrect.
        </p>
      </section>

      <section className="closing">
        <span className="closing-mark" aria-hidden="true">✳</span>
        <p>☕ Good coffee starts with healthy leaves. 🍃</p>
        <a href="#beringei-shield">Test a Leaf <span aria-hidden="true">↑</span></a></section>
      <footer className="site-footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>Beringei Shield</span>
        </a>
        <span>B2B Coffee Pathology Intelligence.</span>
        <span>© 2026 Beringei Shield</span>
      </footer>
    </main>
  );
}