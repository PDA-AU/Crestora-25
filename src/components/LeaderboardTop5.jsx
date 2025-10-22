import React, { useEffect, useState, useRef } from "react";

/**
 * LeaderboardNeonPaginated.jsx
 *
 * - Default: loads entire CSV (maxRows = Infinity)
 * - Pagination: pages of 10 rows (PAGE_SIZE constant) with Prev/Next controls
 * - Columns: S.no (auto), Team Name, Rank
 * - Prints the raw CSV to console for debugging
 */

/* ---------- Config: change if needed ---------- */
const PAGE_SIZE = 10; // paginate by 10 rows

/* ---------- CSV parser (robust) ---------- */
function parseCsv(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let i = 0;
  const len = text.length;
  let inQuotes = false;

  while (i < len) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = i + 1 < len ? text[i + 1] : "";
        if (next === '"') {
          cur += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        cur += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ",") {
        row.push(cur);
        cur = "";
        i++;
        continue;
      }
      if (ch === "\r") {
        if (i + 1 < len && text[i + 1] === "\n") i++;
        row.push(cur);
        cur = "";
        rows.push(row);
        row = [];
        i++;
        continue;
      }
      if (ch === "\n") {
        row.push(cur);
        cur = "";
        rows.push(row);
        row = [];
        i++;
        continue;
      }
      cur += ch;
      i++;
    }
  }

  if (inQuotes) {
    row.push(cur);
    rows.push(row);
  } else {
    if (cur !== "" || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }
  }

  return rows;
}

function normalizeHeader(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export default function LeaderboardNeonPaginated({
  url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8UekVbEgbBPmpFa-eCRgkenuFLVkMUlKedTHpaRi3c_dFJ4I2_rLNkJET7161tyRTKWVqBRkjbMOD/pub?output=csv",
  maxRows = Infinity, // load all by default
}) {
  const [allRows, setAllRows] = useState([]); // full parsed rows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchCsv() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        // print raw CSV to console
        console.log("📄 CSV Raw Data:\n", text);

        // If an HTML sign-in page was returned, error out
        if (/<html[\s>]/i.test(text) && /sign in|you need permission|login/i.test(text)) {
          throw new Error("CSV fetch returned HTML (Sheet not public). Publish to web.");
        }

        const parsed = parseCsv(text);
        if (!parsed || parsed.length === 0) throw new Error("CSV contained no rows.");

        // detect header
        const header = parsed[0].map((h) => normalizeHeader(h));
        const idxTeamName = 1; // Team Name is at index 1
        const idxPercentile = 8; // Percentile is at index 8

        const fallback = idxTeamName === -1 || idxPercentile === -1;

        // map data rows (skip header)
        const dataRows = parsed.slice(1).map((cells) => {
          const cellsNorm = Array.from(cells, (c) => (c == null ? "" : String(c).trim()));
          const teamName = !fallback && idxTeamName >= 0 ? (cellsNorm[idxTeamName] || "") : (cellsNorm[0] || "");
          const percentileRaw = !fallback && idxPercentile >= 0 ? (cellsNorm[idxPercentile] || "") : (cellsNorm[8] || "");
          const percentileNum = Number(String(percentileRaw).replace(/[^0-9.-]/g, ""));
          return {
            teamName: teamName || "",
            percentileRaw: percentileRaw || "",
            percentile: Number.isFinite(percentileNum) ? percentileNum : 0,
            rawCells: cellsNorm,
          };
        });

        // filter empty rows
        const withContent = dataRows.filter((r) => r.teamName || r.percentileRaw);

        // sort by percentile desc, then team name
        withContent.sort((a, b) => {
          // Sort by percentile descending (highest first)
          if (a.percentile !== b.percentile) return b.percentile - a.percentile;
          return String(a.teamName || "").localeCompare(String(b.teamName || ""));
        });

        // apply maxRows cap (if finite)
        const limited = Number.isFinite(maxRows) ? withContent.slice(0, maxRows) : withContent;

        if (!cancelled && mounted.current) {
          setAllRows(limited);
          setPage(1); // reset to first page on new data
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled && mounted.current) {
          console.error("Leaderboard error:", err);
          setError(String(err));
          setLoading(false);
        }
      }
    }

    fetchCsv();
    return () => {
      cancelled = true;
    };
  }, [url, maxRows]);

  // Pagination calculations
  const totalItems = allRows.length;
  const pageSize = PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize; // zero-based
  const pageRows = allRows.slice(startIndex, startIndex + pageSize);

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }
  function goPage(n) {
    setPage(() => Math.min(Math.max(1, n), totalPages));
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(920px, 95%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ textAlign: "center", marginBottom: 12, fontFamily: "Orbitron, sans-serif", color: "#7fffd4" }}>
          🏆 Leaderboard
        </h3>

        <div
          className="neon-border"
          style={{
            padding: 14,
            borderRadius: 12,
            width: "100%",
            border: "2px solid rgba(127,255,212,0.7)",
            boxShadow:
              "0 0 10px rgba(127,255,212,0.6), 0 0 20px rgba(127,255,212,0.4), inset 0 0 10px rgba(127,255,212,0.2)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
          }}
        >
          {loading && <div style={{ textAlign: "center", padding: 24, color: "#9aa0a6" }}>Loading leaderboard…</div>}

          {error && (
            <div style={{ textAlign: "center", padding: 18, color: "#ff6b6b" }}>
              Failed to load leaderboard: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <table
                role="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                  color: "#e6f7ff",
                  fontFamily: "Inter, system-ui",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>S.no</th>
                    <th style={thStyle}>Team Name</th>
                    <th style={thStyle}>Percentile</th>
                  </tr>
                </thead>

                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: 20, color: "#9aa0a6" }}>
                        No results yet.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((r, i) => {
                      const globalIndex = startIndex + i + 1; // 1-based S.no across pages
                      return (
                        <tr key={globalIndex} style={globalIndex % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                          <td style={tdCenter}>{globalIndex}</td>
                          <td style={tdLeft}>{r.teamName || "-"}</td>
                          <td style={tdCenter}>{r.percentile === 0 ? "-" : r.percentileRaw || r.percentile}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 12,
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={goPrev}
                    disabled={currentPage === 1}
                    style={btnStyle(currentPage === 1)}
                  >
                    ◀ Prev
                  </button>

                  <div style={{ color: "#cfeff3", fontSize: 14 }}>
                    Page{" "}
                    <strong style={{ color: "#fff" }}>
                      {currentPage}
                    </strong>{" "}
                    of {totalPages}
                  </div>

                  <button
                    onClick={goNext}
                    disabled={currentPage === totalPages}
                    style={btnStyle(currentPage === totalPages)}
                  >
                    Next ▶
                  </button>
                </div>

                <div style={{ color: "#a7b0b6", fontSize: 13 }}>
                  Showing {Math.min(totalItems, startIndex + 1)}–{Math.min(totalItems, startIndex + pageRows.length)} of{" "}
                  {totalItems}
                </div>
              </div>

              {/* Optional: quick jump (page numbers) */}
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    style={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 8,
                      border: p === currentPage ? "1px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.06)",
                      background: p === currentPage ? "rgba(127,255,212,0.08)" : "transparent",
                      color: "#e6f7ff",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

     
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const thStyle = { padding: "12px", color: "#7fffd4", fontSize: 16, fontWeight: 700 };
const tdCenter = { padding: "10px", textAlign: "center", fontSize: 15 };
const tdLeft = { padding: "10px", textAlign: "left", fontSize: 15 };
const rowEvenStyle = { background: "rgba(255,255,255,0.02)" };
const rowOddStyle = { background: "rgba(255,255,255,0.04)" };

function btnStyle(disabled) {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
    background: disabled ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    color: disabled ? "#6f8088" : "#e6f7ff",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
