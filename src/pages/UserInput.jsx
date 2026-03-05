import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserInput.css";

const KEY = "dietify_user_inputs_v1";
const SKIPPED = "__skipped__";

const QUESTIONS = [
  { id: "goal", title: "What’s your primary goal?", type: "choice", required: true, options: ["Lose fat", "Maintain", "Gain muscle"] },
  { id: "dietType", title: "Diet preference", type: "choice", required: false, options: ["No preference", "Vegetarian", "Vegan", "Eggetarian", "Pescatarian"] },
  { id: "allergies", title: "Any allergies? (optional)", type: "multi", required: false, options: ["None", "Peanuts", "Tree nuts", "Milk", "Egg", "Wheat/Gluten", "Soy", "Fish", "Shellfish"] },
  { id: "mealsPerDay", title: "Meals per day", type: "choice", required: false, options: ["2", "3", "4", "5+"] },
  { id: "cookingTime", title: "Max cooking time per meal", type: "choice", required: false, options: ["10 min", "20 min", "30 min", "45+ min"] },
  { id: "budget", title: "Food budget preference", type: "choice", required: false, options: ["Budget", "Balanced", "Premium"] },
  { id: "spice", title: "Spice tolerance", type: "choice", required: false, options: ["Mild", "Medium", "Spicy"] },

  { id: "age", title: "Age (optional)", type: "number", required: false, min: 10, max: 90, placeholder: "e.g., 22" },
  { id: "heightCm", title: "Height in cm (optional)", type: "number", required: false, min: 120, max: 230, placeholder: "e.g., 165" },
  { id: "weightKg", title: "Weight in kg (optional)", type: "number", required: false, min: 30, max: 250, placeholder: "e.g., 60" },

  { id: "activity", title: "Daily activity level", type: "choice", required: false, options: ["Sedentary", "Lightly active", "Moderately active", "Very active"] },

  {
    id: "conditions",
    title: "Do you have any health conditions we should consider? (optional)",
    type: "multi",
    required: false,
    options: [
      "None",
      "Diabetes (Type 1)",
      "Diabetes (Type 2)",
      "Thyroid disorder",
      "PCOS",
      "Hypertension (high blood pressure)",
      "High cholesterol",
      "Acid reflux (GERD)",
      "Lactose intolerance",
      "Celiac disease (gluten intolerance)",
    ],
  },

  { id: "workout", title: "Workout frequency per week", type: "choice", required: false, options: ["0", "1–2", "3–4", "5+"] },
  { id: "steps", title: "Average steps/day (optional)", type: "number", required: false, min: 0, max: 50000, placeholder: "e.g., 8000" },
  { id: "sleep", title: "Average sleep per night", type: "choice", required: false, options: ["< 6h", "6–7h", "7–8h", "8h+"] },
  { id: "water", title: "Water per day (approx.)", type: "choice", required: false, options: ["< 1L", "1–2L", "2–3L", "3L+"] },
  { id: "motivation", title: "What motivates you most? (optional)", type: "choice", required: false, options: ["Health", "Appearance", "Performance", "Energy", "Doctor advice"] },
];

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

function saveDraft(data) {
  localStorage.setItem(KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
}

function isEmpty(v) {
  return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
}

function isSkipped(v) {
  return v === SKIPPED;
}

function formatValue(q, v) {
  if (isSkipped(v)) return "Skipped";
  if (isEmpty(v)) return "Not answered";

  if (q.type === "multi") {
    const arr = Array.isArray(v) ? v : [String(v)];
    return arr.join(", ");
  }
  if (q.id === "heightCm") return `${v} cm`;
  if (q.id === "weightKg") return `${v} kg`;
  if (q.id === "steps") return `${v} steps/day`;
  return String(v);
}

export default function UserInput() {
  const navigate = useNavigate();

  const initial = useMemo(() => loadSaved()?.answers || {}, []);
  const [answers, setAnswers] = useState(initial);

  const [stage, setStage] = useState("intro"); // intro | wizard | result
  const [index, setIndex] = useState(0);

  // ✅ inline edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editQ, setEditQ] = useState(null);
  const [editValue, setEditValue] = useState("");

  const q = QUESTIONS[index];
  const total = QUESTIONS.length;
  const progress = Math.round(((index + 1) / total) * 100);

  const setAnswer = (id, value) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    saveDraft({ answers: next });
  };

  // ----- Wizard flow -----
  const canGoNext = () => (!q?.required ? true : !isEmpty(answers[q.id]) && !isSkipped(answers[q.id]));

  const next = () => {
    if (!canGoNext()) return;
    if (index >= total - 1) return setStage("result");
    setIndex((i) => i + 1);
  };

  const back = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
  };

  const skip = () => {
    if (q.required) return;
    if (isEmpty(answers[q.id])) setAnswer(q.id, SKIPPED);
    next();
  };

  // ----- Result summary -----
  const summaryRows = useMemo(() => {
    return QUESTIONS.map((qq) => ({
      ...qq,
      value: answers[qq.id],
      display: formatValue(qq, answers[qq.id]),
      skipped: isSkipped(answers[qq.id]),
      unanswered: isEmpty(answers[qq.id]),
    }));
  }, [answers]);

  const skippedCount = useMemo(() => summaryRows.filter((r) => r.skipped).length, [summaryRows]);
  const firstSkipped = useMemo(() => summaryRows.find((r) => r.skipped), [summaryRows]);

  // ✅ open edit modal for a specific question
  const openEdit = (qq) => {
    setEditQ(qq);

    const current = answers[qq.id];
    if (qq.type === "multi") {
      setEditValue(Array.isArray(current) ? current : (isSkipped(current) || isEmpty(current) ? [] : [String(current)]));
    } else {
      setEditValue(isSkipped(current) ? "" : (current ?? ""));
    }

    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditQ(null);
    setEditValue("");
  };

  const saveEdit = () => {
    if (!editQ) return;

    // Required validation
    if (editQ.required && (isEmpty(editValue) || isSkipped(editValue))) {
      return;
    }

    // Multi: ensure "None" logic
    if (editQ.type === "multi") {
      const arr = Array.isArray(editValue) ? editValue : [];
      if (arr.includes("None") && arr.length > 1) {
        setAnswer(editQ.id, ["None"]);
      } else {
        setAnswer(editQ.id, arr);
      }
      closeEdit();
      return;
    }

    // Number: save as number, allow empty => Not answered
    if (editQ.type === "number") {
      if (editValue === "" || editValue === null || editValue === undefined) {
        setAnswer(editQ.id, "");
        closeEdit();
        return;
      }
      const n = Number(editValue);
      if (Number.isNaN(n)) return;
      if (typeof editQ.min === "number" && n < editQ.min) return;
      if (typeof editQ.max === "number" && n > editQ.max) return;

      setAnswer(editQ.id, n);
      closeEdit();
      return;
    }

    // Choice: just set string
    setAnswer(editQ.id, editValue);
    closeEdit();
  };

  const markSkipped = () => {
    if (!editQ || editQ.required) return;
    setAnswer(editQ.id, SKIPPED);
    closeEdit();
  };

  const clearAnswer = () => {
    if (!editQ || editQ.required) return;
    setAnswer(editQ.id, "");
    closeEdit();
  };

  const answerSkippedNow = () => {
    if (!firstSkipped) return;
    openEdit(firstSkipped);
  };

  const confirmAndContinue = () => {
    // Next page later: dashboard/plan
    navigate("/home");
  };

  return (
    <div className="ui-hero" data-cy="userinput-page">
      <div className="ui-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <header className="ui-topbar">
        <button className="ui-brand" type="button" onClick={() => navigate("/home")} aria-label="Go to home">
          <div className="ui-logo" aria-hidden="true">🥗</div>
          <div>
            <div className="ui-name">Dietify</div>
            <div className="ui-tag">{stage === "result" ? "Result" : "Setup"}</div>
          </div>
        </button>

        <div className="ui-top-actions">
          <button className="ui-toplink" type="button" onClick={() => navigate("/home")}>
            Exit
          </button>
        </div>
      </header>

      <div className="ui-shell">
        {/* INTRO */}
        {stage === "intro" && (
          <div className="ui-card">
            <div className="ui-badge">Help us know you better</div>
            <h1 className="ui-title">Personalize Dietify in a few minutes</h1>
            <p className="ui-sub">
              Answer a few quick questions (one at a time) so Dietify can personalize your meal suggestions,
              planning, and tracking. You can skip optional questions.
            </p>

            <div className="ui-mini">
              <div className="ui-mini-item">✅ One question at a time</div>
              <div className="ui-mini-item">✅ Skip optional questions</div>
              <div className="ui-mini-item">✅ You can update later</div>
            </div>

            <div className="ui-actions">
              <button className="ui-secondary" type="button" onClick={() => navigate("/home")}>
                Not now
              </button>
              <button className="ui-primary" type="button" onClick={() => setStage("wizard")} data-cy="start-userinput">
                Start
              </button>
            </div>

            <p className="ui-footnote">This setup typically takes 2–3 minutes.</p>
          </div>
        )}

        {/* WIZARD */}
        {stage === "wizard" && (
          <div className="ui-card">
            <div className="ui-progress-row">
              <div className="ui-progress-left">
                <div className="ui-progress-label">Question {index + 1} of {total}</div>
                <div className="ui-progress-sub">{progress}% completed</div>
              </div>

              <div className="ui-progress-bar" aria-label="Progress">
                <div className="ui-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h2 className="ui-qtitle">
              {q.title} {q.required && <span className="ui-required">Required</span>}
            </h2>

            {q.type === "choice" && (
              <div className="ui-choices" role="group" aria-label={q.title}>
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`ui-choice ${selected ? "active" : ""}`}
                      onClick={() => setAnswer(q.id, opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "number" && (
              <div className="ui-field">
                <input
                  className="ui-input"
                  type="number"
                  min={q.min}
                  max={q.max}
                  value={answers[q.id] === SKIPPED ? "" : (answers[q.id] ?? "")}
                  placeholder={q.placeholder || ""}
                  onChange={(e) => setAnswer(q.id, e.target.value === "" ? "" : Number(e.target.value))}
                />
                <div className="ui-hint">Tip: you can skip if you’re not sure.</div>
              </div>
            )}

            {q.type === "multi" && (
              <div className="ui-multi" role="group" aria-label={q.title}>
                {q.options.map((opt) => {
                  const arr = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                  const selected = arr.includes(opt);

                  const toggle = () => {
                    if (opt === "None") return setAnswer(q.id, ["None"]);
                    const filtered = arr.filter((x) => x !== "None");
                    const nextArr = selected ? filtered.filter((x) => x !== opt) : [...filtered, opt];
                    setAnswer(q.id, nextArr);
                  };

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`ui-choice ${selected ? "active" : ""}`}
                      onClick={toggle}
                    >
                      {opt}
                    </button>
                  );
                })}
                <div className="ui-hint">Select all that apply.</div>
              </div>
            )}

            <div className="ui-nav">
              <button className="ui-secondary" type="button" onClick={back} disabled={index === 0}>
                Back
              </button>

              <div className="ui-nav-right">
                <button className="ui-ghost" type="button" onClick={skip} disabled={q.required}>
                  Skip
                </button>
                <button className="ui-primary" type="button" onClick={next} disabled={!canGoNext()}>
                  {index === total - 1 ? "Review" : "Next"}
                </button>
              </div>
            </div>

            <div className="ui-save-note">Saved automatically.</div>
          </div>
        )}

        {/* RESULT */}
        {stage === "result" && (
          <div className="ui-card">
            <div className="ui-badge">Result</div>

            <h1 className="ui-title">Review & confirm</h1>
            <p className="ui-sub">
              Tap any item to edit it instantly. You can also answer skipped questions now — or continue and update later.
            </p>

            <div className="ui-result-meta">
              <div className="ui-chip">✅ Answered: {summaryRows.filter((r) => !r.unanswered && !r.skipped).length}</div>
              <div className="ui-chip">⏭ Skipped: {skippedCount}</div>
            </div>

            {skippedCount > 0 && (
              <div className="ui-result-banner">
                <div className="ui-result-banner-title">You skipped {skippedCount} question(s).</div>
                <div className="ui-result-banner-sub">Want to answer them now? It takes a moment.</div>
                <div className="ui-result-banner-actions">
                  <button className="ui-secondary" type="button" onClick={answerSkippedNow}>
                    Answer skipped now
                  </button>
                </div>
              </div>
            )}

            <div className="ui-result-list" role="list" aria-label="Answers summary">
              {summaryRows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  className="ui-result-item"
                  onClick={() => openEdit(row)}
                  role="listitem"
                  aria-label={`Edit: ${row.title}`}
                >
                  <div className="ui-result-left">
                    <div className="ui-result-q">{row.title}</div>
                    <div className={`ui-result-a ${row.skipped ? "skipped" : ""} ${row.unanswered ? "unanswered" : ""}`}>
                      {row.display}
                    </div>
                  </div>

                  <div className="ui-result-right">
                    {row.skipped && <span className="ui-pill warn">Skipped</span>}
                    {row.unanswered && !row.skipped && <span className="ui-pill">Not answered</span>}
                    {!row.unanswered && !row.skipped && <span className="ui-pill ok">Saved</span>}
                    <span className="ui-chevron" aria-hidden="true">›</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="ui-actions ui-result-actions">
              <button className="ui-secondary" type="button" onClick={() => { setStage("wizard"); setIndex(0); }}>
                Add more details
              </button>

              <button className="ui-primary" type="button" onClick={confirmAndContinue} data-cy="confirm-and-continue">
                Confirm & continue
              </button>
            </div>

            <p className="ui-footnote">You can update your profile anytime.</p>
          </div>
        )}
      </div>

      {/* ===== Inline Edit Modal ===== */}
      {editOpen && editQ && (
        <div className="ui-modalOverlay" role="dialog" aria-modal="true" aria-label="Edit answer">
          <div className="ui-modal">
            <div className="ui-modalTop">
              <div className="ui-modalTitle">Edit</div>
              <button className="ui-modalClose" type="button" onClick={closeEdit} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="ui-modalQ">{editQ.title}</div>

            {/* Choice editor */}
            {editQ.type === "choice" && (
              <div className="ui-choices">
                {editQ.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`ui-choice ${editValue === opt ? "active" : ""}`}
                    onClick={() => setEditValue(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Number editor */}
            {editQ.type === "number" && (
              <div className="ui-field">
                <input
                  className="ui-input"
                  type="number"
                  min={editQ.min}
                  max={editQ.max}
                  value={editValue}
                  placeholder={editQ.placeholder || ""}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <div className="ui-hint">You can leave it empty if you prefer.</div>
              </div>
            )}

            {/* Multi editor */}
            {editQ.type === "multi" && (
              <div className="ui-multi">
                {editQ.options.map((opt) => {
                  const arr = Array.isArray(editValue) ? editValue : [];
                  const selected = arr.includes(opt);

                  const toggle = () => {
                    if (opt === "None") return setEditValue(["None"]);
                    const filtered = arr.filter((x) => x !== "None");
                    const nextArr = selected ? filtered.filter((x) => x !== opt) : [...filtered, opt];
                    setEditValue(nextArr);
                  };

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`ui-choice ${selected ? "active" : ""}`}
                      onClick={toggle}
                    >
                      {opt}
                    </button>
                  );
                })}
                <div className="ui-hint">Select all that apply.</div>
              </div>
            )}

            <div className="ui-modalActions">
              <div className="ui-modalLeft">
                {!editQ.required && (
                  <>
                    <button className="ui-ghost" type="button" onClick={clearAnswer}>
                      Clear
                    </button>
                    <button className="ui-ghost" type="button" onClick={markSkipped}>
                      Skip
                    </button>
                  </>
                )}
              </div>

              <div className="ui-modalRight">
                <button className="ui-secondary" type="button" onClick={closeEdit}>
                  Cancel
                </button>
                <button className="ui-primary" type="button" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>

            {editQ.required && (
              <div className="ui-footnote" style={{ marginTop: 10 }}>
                This question is required.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}