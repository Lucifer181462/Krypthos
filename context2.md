# 📄 context.md

## 🧠 Project Context

**OpenIssue** is an AI-powered GitHub issue triage assistant designed to reduce the manual effort maintainers spend sorting, labeling, and identifying duplicate issues.

In real-world open source projects, issue trackers become noisy:
- Duplicate issues flood in
- Poorly written bug reports lack clarity
- Maintainers waste time labeling and prioritizing

This tool aims to **automate early-stage triaging** using embeddings + lightweight heuristics.

---

## ⚡ Hackathon Strategy (IMPORTANT)

This is a **24-hour hackathon**, so:
- Focus ONLY on **MVP features**
- Prefer **working demo > perfect system**
- Use **prebuilt tools/APIs wherever possible**
- Avoid infra-heavy setups (no overkill microservices)

👉 Goal: **Impress judges with clarity + usefulness, not complexity**

---

## 🎯 Core Problem

Maintainers currently:
- Manually read every issue
- Identify duplicates by memory/search
- Assign labels and priorities manually

This leads to:
- Time waste
- Delayed responses
- Poor issue hygiene

---

## 💡 Proposed Solution

A simple pipeline:

1. User submits issue
2. System analyzes text using embeddings
3. Performs:
   - Classification (bug/feature/etc.)
   - Similarity search (duplicate detection)
   - Priority scoring
4. Returns:
   - Suggested labels
   - Possible duplicates
   - Priority level

---

## 🧩 MVP Scope (DO THIS ONLY)

### ✅ Must Have
- Issue input (text box / JSON)
- Embedding generation
- Similarity search (basic cosine similarity)
- Label suggestion (rule-based or simple model)
- Display results (labels + duplicates)

### ❌ Skip for now
- Full GitHub integration (unless time left)
- Complex ML models
- Authentication systems
- Perfect accuracy

---

## 🏗️ System Design (Simplified)

Frontend (basic UI or CLI)  
→ API (Node/Python)  
→ Embedding Service (OpenAI or similar)  
→ Vector Store (in-memory / simple DB)

---

## 🔥 Vibecoding Principles

- Hardcode where needed (it’s fine)
- Use mock data initially
- Don’t over-structure folders
- If stuck → simplify, don’t debug forever
- Ship fast, then polish

---

## ⚙️ Suggested Stack

- **Frontend:** Simple HTML / React (optional)
- **Backend:** Node.js / Python (FastAPI preferred for speed)
- **Embeddings:** OpenAI / any free alternative
- **Storage:** 
  - JSON / SQLite (fastest)
  - Or in-memory array

---

## 🧪 Key Challenges (Keep It Practical)

- Getting meaningful similarity results
- Avoiding false duplicates
- Keeping response time fast

👉 Solution: Start simple → improve only if time allows

---

## 📊 Judging Focus

Maximize:
- Working demo
- Clear problem → solution mapping
- Smooth UX (even if simple)
- Smart use of AI (not forced)

---

## 🚀 Final Goal

A **demo-ready tool** where:
- You paste an issue
- It instantly:
  - Suggests labels
  - Shows similar issues
  - Gives priority

Even if it's 70% accurate — **that’s a win in 24h**
