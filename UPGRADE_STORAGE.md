# Storage Version Upgrade Skill

## Overview

This skill documents how to upgrade the storage version (e.g., `habitio_v10` → `habitio_v11`) when the data schema or app structure changes significantly.

**Key principle:** Use a **single-source-of-truth constant** (`STORAGE_VERSION` in `test-helpers.js`) to make upgrades trivial and error-free.

## Architecture

### Current Setup

- **App storage key:** `localStorage.setItem("habitio_v10", ...)`  
  Location: [app.js](app.js#L623)
  
- **Service worker cache:** `const CACHE = "habitio_v10"`  
  Location: [sw.js](sw.js#L1)
  
- **Test constant:** `const STORAGE_VERSION = "habitio_v10"`  
  Location: [tests/test-helpers.js](tests/test-helpers.js#L7)

**Why separate?** The SW cache busts based on version—when `habitio_v9` data is loaded, the app auto-saves to `habitio_v10` AND deletes old caches. This ensures stale assets don't linger.

### Data Migration Pattern

When loading, [app.js:load()](app.js#L629-L660):
1. ✅ Tries `habitio_v10` first
2. ✅ Falls back to `habitio_v9`, `v8`, ... `v2`
3. ✅ Migrates data (adds missing fields, transforms shape)
4. ✅ Saves under new key
5. ✅ Deletes old keys

**Result:** Users never lose data on any upgrade.

---

## How to Upgrade: Step-by-Step

### Step 1: Update App Storage Key

Edit [app.js](app.js):

```javascript
// OLD
function save() {
  localStorage.setItem("habitio_v10", JSON.stringify(state));
}

// NEW
function save() {
  localStorage.setItem("habitio_v11", JSON.stringify(state));
}
```

Also update migration fallback in `load()`:
```javascript
const raw =
  localStorage.getItem("habitio_v11") ||
  localStorage.getItem("habitio_v10") ||  // Add old version here
  localStorage.getItem("habitio_v9") ||
  // ... rest of fallback chain
```

### Step 2: Update Service Worker Cache

Edit [sw.js](sw.js#L1):

```javascript
// OLD
const CACHE = "habitio_v10";

// NEW
const CACHE = "habitio_v11";
```

### Step 3: Update Test Constant

Edit [tests/test-helpers.js](tests/test-helpers.js#L7):

```javascript
// OLD
const STORAGE_VERSION = "habitio_v10";

// NEW
const STORAGE_VERSION = "habitio_v11";
```

**That's it!** Tests automatically use the new version—no hardcoded strings to update across 20+ test files.

### Step 4: Add Migration Logic (If Needed)

If the **data schema changed** (e.g., new field `aiCoach`, habit structure), update [app.js:load()](app.js#L629-L660):

```javascript
function load() {
  try {
    const raw = localStorage.getItem("habitio_v11") || localStorage.getItem("habitio_v10") || ...;
    const d = JSON.parse(raw);
    
    if (d?.habits) {
      // NEW: Add this if you added a new field to habits
      d.habits = (d.habits || []).map((h) => ({
        cadence: { type: "daily" },
        ...h,
        newField: h.newField || "default-value", // <- Add here
      }));
      
      // Ensure all new state fields exist
      if (!d.diary) d.diary = {};
      if (!d.profile) d.profile = { name: "", age: "", sex: "male" };
      if (!d.aiCoach) d.aiCoach = defaultCoachState();
      
      state = d;
      localStorage.setItem("habitio_v11", JSON.stringify(state));
      localStorage.removeItem("habitio_v10");
      localStorage.removeItem("habitio_v9");
      // ... remove old versions
      return;
    }
  } catch (e) {
    console.warn("[habitio] Failed to load saved state:", e);
  }
  // Default new state...
}
```

### Step 5: Update Version Display (Optional)

If displaying version to users, update [app.js](app.js) `APP_VERSION`:

```javascript
const APP_VERSION = "v2.11"; // Matches storage schema 11
```

Format: `v2.<schema-number>` (major.minor where minor = storage schema)

---

## Testing the Upgrade

### Run All Tests

```bash
yarn test
```

All tests automatically use `STORAGE_VERSION`, so if there are failures:
- Check migration logic in `load()`
- Verify all state fields are initialized
- Look for console errors in test videos

### Test Old Data Import

Create a manual test in [tests/import-export.spec.js](tests/import-export.spec.js):

```javascript
test("migration: v10 data loads and upgrades to v11", async ({ page }) => {
  await openClearedApp(page);
  
  // Simulate old v10 data
  const oldData = {
    habits: [{ id: "h1", name: "Read", cadence: { type: "daily" }, createdAt: "2024-01-01" }],
    checks: { "2024-01-15": { h1: true } },
    diary: {},
    profile: { name: "Test", age: "30", sex: "male" },
    lang: "en",
    kitsDismissed: {},
    consentAnalytics: null,
  };
  
  // Store under OLD key
  await page.evaluate((data) => {
    localStorage.setItem("habitio_v10", JSON.stringify(data));
  }, oldData);
  
  await page.reload({ waitUntil: "domcontentloaded" });
  
  // Verify data migrated to v11
  const saved = await page.evaluate(({ version }) => {
    const raw = localStorage.getItem(version);
    return raw ? JSON.parse(raw) : null;
  }, { version: STORAGE_VERSION });
  
  expect(saved?.habits).toHaveLength(1);
  expect(saved?.habits[0].name).toBe("Read");
  expect(localStorage.getItem("habitio_v10")).toBeNull(); // Old key deleted
});
```

---

## Checklist Before Pushing

- [ ] Updated app.js `save()` → `habitio_v11`
- [ ] Updated app.js `load()` fallback chain
- [ ] Updated sw.js `CACHE` → `habitio_v11`
- [ ] Updated tests/test-helpers.js `STORAGE_VERSION`
- [ ] Added migration logic if schema changed
- [ ] Ran `yarn test` — all pass
- [ ] Ran `yarn format` — code formatted
- [ ] Ran `sonar-scanner` — Quality Gate passes
- [ ] Updated version display if applicable
- [ ] Commit message includes version change (`v10 → v11`)
- [ ] Verified old data imports in test/manual

---

## Common Mistakes

### ❌ Hardcoding Version in Tests

```javascript
// BAD - Don't do this
localStorage.setItem("habitio_v11", JSON.stringify(state));
localStorage.setItem("habitio_v10", JSON.stringify(state)); // When v10 exists
localStorage.getItem("habitio_v11");
```

### ✅ Use STORAGE_VERSION Constant

```javascript
// GOOD
localStorage.setItem(STORAGE_VERSION, JSON.stringify(state));
```

### ❌ Forgetting to Delete Old Keys

```javascript
// INCOMPLETE
localStorage.setItem("habitio_v11", JSON.stringify(state));
// <- Should clean up old keys here
```

### ✅ Clean Up Old Keys

```javascript
// COMPLETE
localStorage.setItem("habitio_v11", JSON.stringify(state));
localStorage.removeItem("habitio_v10");
localStorage.removeItem("habitio_v9");
// ... remove all older versions
```

### ❌ Forgetting Migration Logic

If schema changed and you don't migrate, users lose features:
```javascript
// Missing: d.aiCoach = defaultCoachState();
// Result: Coach features break for upgraded users
```

### ✅ Always Initialize New Fields

```javascript
d.aiCoach = { ...defaultCoachState(), ...(d.aiCoach || {}) };
```

---

## Example: Full Upgrade v10 → v11

### Scenario
App now tracks coaching sessions. New field: `aiCoach` object.

**Files to change:**

**1. app.js**
```javascript
// Line 623
function save() {
  localStorage.setItem("habitio_v11", JSON.stringify(state));
}

// Line 629 (add v11 and v10 to fallback)
const raw =
  localStorage.getItem("habitio_v11") ||
  localStorage.getItem("habitio_v10") ||
  // ... rest

// Line 655 (add aiCoach initialization)
d.aiCoach = { ...defaultCoachState(), ...(d.aiCoach || {}) };

// Line 661 (clean up v10)
localStorage.removeItem("habitio_v10");
```

**2. sw.js**
```javascript
// Line 1
const CACHE = "habitio_v11";
```

**3. tests/test-helpers.js**
```javascript
// Line 7
const STORAGE_VERSION = "habitio_v11";
```

**4. Commit**
```bash
git add app.js sw.js tests/test-helpers.js
git commit -m "chore: upgrade storage version v10 → v11

- Add aiCoach field to state for coaching feature
- Update localStorage key in save() and load()
- Update SW cache name for asset busting
- Update test constant (all 20+ tests auto-updated)
- Migration handles old v10 data, adds aiCoach defaults"
```

---

## Benefits of This Approach

| Aspect | Benefit |
|--------|---------|
| **Single source of truth** | Change once → all tests updated automatically |
| **Migration guaranteed** | Users never lose data on version bumps |
| **Cache busting automatic** | New version key forces asset reload |
| **Testable** | Old data import tests verify migration works |
| **Backwards compatible** | New app reads old keys, migrates, cleans up |
| **No downtime** | Users can upgrade seamlessly |

---

## See Also

- [Data Storage Architecture](app.js#L620-L670)
- [Service Worker Caching](sw.js#L1-L113)
- [Test Helpers](tests/test-helpers.js#L1-L250)
- [Copilot Instructions](.github/copilot-instructions.md#service-worker--caching)
