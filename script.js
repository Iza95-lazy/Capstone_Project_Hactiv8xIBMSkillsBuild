/**
 * script.js — Expense Analyzer Dashboard
 * =========================================================
 * Responsibilities:
 *  1. Seed 100 realistic expense transactions
 *  2. Render 4 dynamic KPI cards
 *  3. Render category expense breakdown with progress bars
 *  4. Render budget goal tracker
 *  5. Populate the 100-row transaction table
 *  6. Real-time search input filtering
 *  7. Category filter dropdown
 *  8. IDR (Indonesian Rupiah) currency formatting
 *  9. Sidebar mobile toggle
 * 10. Nav item active state
 * =========================================================
 * Constraints: Vanilla JS only, zero external libraries.
 */

'use strict';

/* ════════════════════════════════════════════════════════
   SECTION 1 — CONSTANTS & CONFIGURATION
   ════════════════════════════════════════════════════════ */

/** Monthly budget ceiling in IDR */
const MONTHLY_BUDGET = 50_000_000; // Rp 50,000,000

/**
 * Category definitions — each has a name, color, and budget allocation.
 * Colors chosen to be visually distinct on the dark dashboard.
 */
const CATEGORIES = [
  { name: 'Food & Beverage',  color: '#F59E0B', budget: 8_000_000  },
  { name: 'Transportation',   color: '#6366F1', budget: 5_000_000  },
  { name: 'Accommodation',    color: '#10B981', budget: 7_000_000  },
  { name: 'Office Supplies',  color: '#3B82F6', budget: 4_000_000  },
  { name: 'Software & Tools', color: '#A855F7', budget: 6_000_000  },
  { name: 'Marketing',        color: '#EF4444', budget: 8_000_000  },
  { name: 'Utilities',        color: '#06B6D4', budget: 3_500_000  },
  { name: 'Healthcare',       color: '#F97316', budget: 2_500_000  },
  { name: 'Education',        color: '#84CC16', budget: 3_000_000  },
  { name: 'Entertainment',    color: '#EC4899', budget: 2_500_000  },
];

/** Expense type options */
const TYPES = ['Personal', 'Business'];

/** Transaction status options */
const STATUSES = ['Completed', 'Pending', 'Rejected'];

/**
 * Sample merchants per category — used to make fake description text.
 * Index corresponds to CATEGORIES array.
 */
const MERCHANTS = [
  ['Kopi Kenangan', 'GrabFood', 'GoFood', 'Warung Padang', 'McDonalds Indonesia'],
  ['Grab Car', 'Gojek', 'Commuter Line', 'TransJakarta', 'Blue Bird Taxi'],
  ['Hotel Mulia', 'Aston Priority', 'RedDoorz', 'OYO Rooms', 'Guesthouse Bali'],
  ['Tokopedia Supplies', 'Shopee Office', 'ATK Gramedia', 'Lotte Mart Office', 'Ace Hardware'],
  ['GitHub Teams', 'Figma Pro', 'Adobe Cloud', 'Notion Premium', 'Slack Business'],
  ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Influencer Fee', 'Content Studio'],
  ['PLN Electricity', 'PDAM Water', 'Telkom Internet', 'Indihome Package', 'Gas PGN'],
  ['Apotek Kimia Farma', 'Klinik Sehat', 'Lab Prodia', 'BPJS Health', 'Guardian Pharmacy'],
  ['Coursera Subscription', 'Udemy Course', 'Seminar Fee', 'BNSP Certification', 'LinkedIn Learning'],
  ['Netflix Business', 'Spotify Team', 'Disney+ Hotstar', 'Cinema XXI', 'Event Ticket'],
];

/* ════════════════════════════════════════════════════════
   SECTION 2 — UTILITY FUNCTIONS
   ════════════════════════════════════════════════════════ */

/**
 * Formats a number into IDR currency string.
 * e.g. 1500000 → "Rp 1.500.000"
 * @param {number} amount
 * @returns {string}
 */
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Picks a random element from an array.
 * @param {Array} arr
 * @returns {*}
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random date string within the current month.
 * @returns {string} "YYYY-MM-DD"
 */
function randomDateThisMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = randomInt(1, now.getDate()); // up to today
  const d = new Date(year, month, day);
  return d.toISOString().slice(0, 10);
}

/**
 * Formats an ISO date string to a localized readable date.
 * @param {string} isoDate "YYYY-MM-DD"
 * @returns {string} e.g. "15 Jul 2025"
 */
function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Clamps a value between 0 and 100 for progress bar widths.
 * @param {number} value
 * @returns {number}
 */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/* ════════════════════════════════════════════════════════
   SECTION 3 — DATA GENERATION
   ════════════════════════════════════════════════════════ */

/**
 * Generates an array of 100 synthetic expense transactions.
 * Each transaction object has:
 *   id, date, description, category, type, amount, status
 * @returns {Array<Object>}
 */
function generateTransactions() {
  const transactions = [];

  for (let i = 1; i <= 100; i++) {
    // Pick a random category index
    const catIndex = randomInt(0, CATEGORIES.length - 1);
    const category = CATEGORIES[catIndex];

    // Pick a random merchant for that category
    const merchant = randomPick(MERCHANTS[catIndex]);

    // Expense amount: varies by category budget to keep it realistic
    const minAmt = Math.floor(category.budget * 0.01);
    const maxAmt = Math.floor(category.budget * 0.35);
    const amount = randomInt(minAmt, maxAmt);

    // Random status — weight towards 'Completed' (more realistic)
    const statusWeighted = Math.random();
    let status;
    if (statusWeighted < 0.70)      status = 'Completed';
    else if (statusWeighted < 0.90) status = 'Pending';
    else                            status = 'Rejected';

    transactions.push({
      id:          i,
      date:        randomDateThisMonth(),
      description: merchant,
      category:    category.name,
      type:        randomPick(TYPES),
      amount:      amount,
      status:      status,
    });
  }

  // Sort by date descending (most recent first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return transactions;
}

/* Seed the data once and store globally — all renders read from these */
const ALL_TRANSACTIONS = generateTransactions();

/* ════════════════════════════════════════════════════════
   SECTION 4 — AGGREGATION HELPERS
   ════════════════════════════════════════════════════════ */

/**
 * Calculates the total spend from a list of transactions.
 * Only counts 'Completed' and 'Pending' statuses (not 'Rejected').
 * @param {Array<Object>} txns
 * @returns {number}
 */
function calcTotalSpend(txns) {
  return txns
    .filter(t => t.status !== 'Rejected')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Aggregates spend per category name from a transaction list.
 * Returns a Map: categoryName → { total, count, color, budget }
 * @param {Array<Object>} txns
 * @returns {Map<string, Object>}
 */
function aggregateByCategory(txns) {
  const map = new Map();

  // Pre-populate every category with zero so all appear even if no spend
  CATEGORIES.forEach(cat => {
    map.set(cat.name, { total: 0, count: 0, color: cat.color, budget: cat.budget });
  });

  txns
    .filter(t => t.status !== 'Rejected')
    .forEach(t => {
      const entry = map.get(t.category);
      if (entry) {
        entry.total += t.amount;
        entry.count += 1;
      }
    });

  return map;
}

/**
 * Counts categories that have exceeded their individual budget.
 * @param {Map<string, Object>} catMap
 * @returns {number}
 */
function countOverspendingCategories(catMap) {
  let count = 0;
  catMap.forEach(entry => {
    if (entry.total > entry.budget) count++;
  });
  return count;
}

/* ════════════════════════════════════════════════════════
   SECTION 5 — KPI CARD RENDERER
   ════════════════════════════════════════════════════════ */

/**
 * Renders all four KPI cards using live-calculated values.
 * @param {Array<Object>} txns — filtered or full transaction list
 */
function renderKPICards(txns) {
  const catMap    = aggregateByCategory(txns);
  const totalSpend = calcTotalSpend(txns);
  const remaining  = MONTHLY_BUDGET - totalSpend;
  const alertCount = countOverspendingCategories(catMap);
  const spendPct   = ((totalSpend / MONTHLY_BUDGET) * 100).toFixed(1);

  /* ── Card 1: Total Spend ── */
  document.getElementById('kpiValueTotalSpend').textContent = formatIDR(totalSpend);
  const deltaSpend = document.getElementById('kpiDeltaTotalSpend');
  deltaSpend.textContent  = `${spendPct}% of monthly budget used`;
  deltaSpend.className    = 'kpi-card__delta ' + (totalSpend > MONTHLY_BUDGET ? 'negative' : 'neutral');

  /* ── Card 2: Monthly Budget ── */
  document.getElementById('kpiValueMonthlyBudget').textContent = formatIDR(MONTHLY_BUDGET);
  const deltaBudget = document.getElementById('kpiDeltaMonthlyBudget');
  deltaBudget.textContent = `Fixed ceiling this month`;
  deltaBudget.className   = 'kpi-card__delta neutral';

  /* ── Card 3: Remaining Budget ── */
  document.getElementById('kpiValueRemaining').textContent = formatIDR(Math.abs(remaining));
  const deltaRemaining = document.getElementById('kpiDeltaRemaining');
  if (remaining >= 0) {
    deltaRemaining.textContent = `${(100 - parseFloat(spendPct)).toFixed(1)}% budget still available`;
    deltaRemaining.className   = 'kpi-card__delta positive';
  } else {
    deltaRemaining.textContent = `Over budget by ${formatIDR(Math.abs(remaining))}`;
    deltaRemaining.className   = 'kpi-card__delta negative';
  }

  /* ── Card 4: Overspending Alert Count ── */
  document.getElementById('kpiValueAlerts').textContent = alertCount;
  const deltaAlerts = document.getElementById('kpiDeltaAlerts');
  if (alertCount === 0) {
    deltaAlerts.textContent = 'All categories within budget';
    deltaAlerts.className   = 'kpi-card__delta positive';
  } else {
    deltaAlerts.textContent = `${alertCount} categor${alertCount === 1 ? 'y' : 'ies'} exceeded budget`;
    deltaAlerts.className   = 'kpi-card__delta negative';
  }
}

/* ════════════════════════════════════════════════════════
   SECTION 6 — CATEGORY BREAKDOWN RENDERER
   ════════════════════════════════════════════════════════ */

/**
 * Renders the category expense breakdown list with custom progress bars.
 * @param {Array<Object>} txns
 */
function renderCategoryBreakdown(txns) {
  const catMap = aggregateByCategory(txns);
  const list   = document.getElementById('categoryList');

  // Find max total across all categories for scaling progress bars
  let maxTotal = 0;
  catMap.forEach(entry => { if (entry.total > maxTotal) maxTotal = entry.total; });
  if (maxTotal === 0) maxTotal = 1; // prevent division by zero

  // Update badge
  document.getElementById('categoryCount').textContent = `${catMap.size} categories`;

  // Clear previous content
  list.innerHTML = '';

  // Sort categories by spend descending
  const sorted = Array.from(catMap.entries()).sort((a, b) => b[1].total - a[1].total);

  sorted.forEach(([name, entry]) => {
    const pct = clamp100((entry.total / maxTotal) * 100);

    /* Build list item element */
    const li = document.createElement('li');
    li.className = 'category-item';

    li.innerHTML = `
      <div class="category-item__header">
        <div class="category-item__info">
          <span class="category-dot" style="background:${entry.color}"></span>
          <span class="category-item__name">${name}</span>
          <span class="category-item__count">(${entry.count} txn)</span>
        </div>
        <span class="category-item__amount">${formatIDR(entry.total)}</span>
      </div>
      <div class="progress-track" role="progressbar"
           aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
           aria-label="${name} spend progress">
        <div class="progress-fill"
             style="width:${pct}%; background:${entry.color};">
        </div>
      </div>
    `;

    list.appendChild(li);
  });
}

/* ════════════════════════════════════════════════════════
   SECTION 7 — BUDGET GOAL TRACKER RENDERER
   ════════════════════════════════════════════════════════ */

/**
 * Renders the budget goal tracker cards.
 * Shows spend vs allocated budget per category with a color-coded % badge.
 * @param {Array<Object>} txns
 */
function renderBudgetTracker(txns) {
  const catMap     = aggregateByCategory(txns);
  const trackerEl  = document.getElementById('budgetTrackerList');
  const statusBadge = document.getElementById('budgetStatus');

  trackerEl.innerHTML = '';

  // Count overspending categories for the header badge
  const overCount = countOverspendingCategories(catMap);
  if (overCount === 0) {
    statusBadge.textContent  = 'On Track';
    statusBadge.className    = 'card__badge card__badge--success';
  } else {
    statusBadge.textContent  = `${overCount} Over Budget`;
    statusBadge.className    = 'card__badge card__badge--danger';
  }

  // Sort by % used (highest first) for priority visibility
  const sorted = Array.from(catMap.entries())
    .sort((a, b) => (b[1].total / b[1].budget) - (a[1].total / a[1].budget));

  sorted.forEach(([name, entry]) => {
    const rawPct  = (entry.total / entry.budget) * 100;
    const pct     = clamp100(rawPct);
    const display = rawPct.toFixed(0);

    // Determine badge severity
    let pctClass;
    if (rawPct < 75)       pctClass = 'budget-goal-item__pct--ok';
    else if (rawPct < 100) pctClass = 'budget-goal-item__pct--warn';
    else                   pctClass = 'budget-goal-item__pct--danger';

    // Get category color
    const cat   = CATEGORIES.find(c => c.name === name);
    const color = cat ? cat.color : '#6366F1';

    const item = document.createElement('div');
    item.className = 'budget-goal-item';

    item.innerHTML = `
      <div class="budget-goal-item__header">
        <span class="budget-goal-item__name">${name}</span>
        <span class="budget-goal-item__pct ${pctClass}">${display}%</span>
      </div>
      <div class="budget-goal-item__sub">
        <span>Spent: ${formatIDR(entry.total)}</span>
        <span>Budget: ${formatIDR(entry.budget)}</span>
      </div>
      <div class="progress-track" role="progressbar"
           aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
           aria-label="${name} budget usage">
        <div class="progress-fill"
             style="width:${pct}%; background:${rawPct >= 100 ? 'var(--color-danger)' : rawPct >= 75 ? 'var(--color-amber)' : color};">
        </div>
      </div>
    `;

    trackerEl.appendChild(item);
  });
}

/* ════════════════════════════════════════════════════════
   SECTION 8 — TRANSACTION TABLE RENDERER
   ════════════════════════════════════════════════════════ */

/**
 * Renders the transaction table body from a given array of transactions.
 * @param {Array<Object>} txns — may be filtered subset
 */
function renderTransactionTable(txns) {
  const tbody      = document.getElementById('transactionTableBody');
  const countBadge = document.getElementById('transactionCount');
  const tableInfo  = document.getElementById('tableInfo');

  tbody.innerHTML = '';

  // Update count badges
  countBadge.textContent = `${txns.length} results`;
  tableInfo.textContent  = `Showing ${txns.length} of ${ALL_TRANSACTIONS.length} transactions`;

  if (txns.length === 0) {
    /* Empty state row */
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="7" class="empty-state">
        No transactions match your search criteria.
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  txns.forEach((txn, index) => {
    const row = document.createElement('tr');

    /* Build status badge */
    const statusClass = {
      'Completed': 'status-badge--completed',
      'Pending':   'status-badge--pending',
      'Rejected':  'status-badge--rejected',
    }[txn.status] || 'status-badge--completed';

    /* Build type badge */
    const typeClass = txn.type === 'Business'
      ? 'type-badge--business'
      : 'type-badge--personal';

    /* Amount cell — color red for expense */
    const amountClass = txn.status !== 'Rejected' ? 'amount-cell expense' : 'amount-cell';

    /* Get category color dot */
    const cat   = CATEGORIES.find(c => c.name === txn.category);
    const color = cat ? cat.color : '#94A3B8';

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatDate(txn.date)}</td>
      <td title="${txn.description}">${txn.description}</td>
      <td>
        <span style="display:inline-flex;align-items:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block;"></span>
          ${txn.category}
        </span>
      </td>
      <td><span class="type-badge ${typeClass}">${txn.type}</span></td>
      <td class="${amountClass}">${formatIDR(txn.amount)}</td>
      <td><span class="status-badge ${statusClass}">${txn.status}</span></td>
    `;

    tbody.appendChild(row);
  });
}

/* ════════════════════════════════════════════════════════
   SECTION 9 — FILTER DROPDOWN POPULATION
   ════════════════════════════════════════════════════════ */

/**
 * Populates the category filter <select> with all unique categories
 * derived from the full transaction dataset.
 */
function populateCategoryFilter() {
  const select = document.getElementById('categoryFilter');

  // Collect unique category names
  const uniqueCategories = [...new Set(ALL_TRANSACTIONS.map(t => t.category))].sort();

  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value       = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

/* ════════════════════════════════════════════════════════
   SECTION 10 — FILTERING & SEARCH LOGIC
   ════════════════════════════════════════════════════════ */

/**
 * Reads current search input and category filter values,
 * then filters ALL_TRANSACTIONS accordingly.
 * @returns {Array<Object>} — filtered transactions
 */
function getFilteredTransactions() {
  const query    = document.getElementById('searchInput').value.trim().toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  return ALL_TRANSACTIONS.filter(txn => {
    /* Category filter */
    if (category !== 'all' && txn.category !== category) return false;

    /* Search filter — matches description, category, type, status, date */
    if (query) {
      const haystack = [
        txn.description.toLowerCase(),
        txn.category.toLowerCase(),
        txn.type.toLowerCase(),
        txn.status.toLowerCase(),
        txn.date,
        formatIDR(txn.amount),
      ].join(' ');

      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

/**
 * Master re-render function — called whenever filters change.
 * Re-renders KPI cards, category breakdown, budget tracker, and table
 * from the currently filtered transaction list.
 */
function applyFiltersAndRender() {
  const filtered = getFilteredTransactions();
  renderKPICards(filtered);
  renderCategoryBreakdown(filtered);
  renderBudgetTracker(filtered);
  renderTransactionTable(filtered);
}

/* ════════════════════════════════════════════════════════
   SECTION 11 — SIDEBAR & NAVIGATION
   ════════════════════════════════════════════════════════ */

/**
 * Initializes the sidebar mobile toggle (hamburger button).
 */
function initSidebarToggle() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');

  /**
   * Opens the sidebar (mobile).
   */
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // prevent scroll behind
  }

  /**
   * Closes the sidebar (mobile).
   */
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  /* Close when clicking the overlay backdrop */
  overlay.addEventListener('click', closeSidebar);

  /* Close sidebar when a nav item is clicked on mobile */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });
}

/**
 * Initializes nav item active state switching.
 * Updates the page title to match the clicked nav item.
 */
function initNavItems() {
  const navItems = document.querySelectorAll('.nav-item');
  const pageTitle    = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  /** Page subtitle map */
  const subtitles = {
    dashboard:    'Welcome back, Dzaky Rafif',
    transactions: 'All your transactions in one place',
    budget:       'Track and manage your budgets',
    reports:      'Analytics and financial reports',
    settings:     'Account & preference settings',
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      /* Remove active from all, add to clicked */
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      /* Update page title */
      const label = item.querySelector('.nav-label').textContent;
      const page  = item.dataset.page;
      pageTitle.textContent    = label;
      pageSubtitle.textContent = subtitles[page] || '';
    });
  });
}

/* ════════════════════════════════════════════════════════
   SECTION 12 — EVENT LISTENERS
   ════════════════════════════════════════════════════════ */

/**
 * Attaches real-time search and filter change listeners.
 */
function initFilterListeners() {
  const searchInput    = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  /* Real-time search — fires on every keystroke */
  searchInput.addEventListener('input', applyFiltersAndRender);

  /* Category dropdown — fires on selection change */
  categoryFilter.addEventListener('change', applyFiltersAndRender);
}

/* ════════════════════════════════════════════════════════
   SECTION 13 — INITIALISATION (DOMContentLoaded)
   ════════════════════════════════════════════════════════ */

/**
 * Main entry point — runs after the DOM is fully parsed.
 * Sets up all components in order.
 */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Populate the category filter dropdown before first render */
  populateCategoryFilter();

  /* 2. Initial full render with all transactions (no filter) */
  renderKPICards(ALL_TRANSACTIONS);
  renderCategoryBreakdown(ALL_TRANSACTIONS);
  renderBudgetTracker(ALL_TRANSACTIONS);
  renderTransactionTable(ALL_TRANSACTIONS);

  /* 3. Wire up interactive controls */
  initFilterListeners();
  initSidebarToggle();
  initNavItems();

  /*
   * 4. A tiny animation trigger — progress bars begin at width:0 in
   *    the DOM paint, then CSS transitions animate them to their
   *    final widths on the very next frame.
   *    (The progress-fill inline `style.width` is already set during
   *    render so the CSS transition fires automatically on insert.)
   */

  console.info(
    '%c FinTrack Dashboard loaded ✔ ',
    'background:#0F172A;color:#F59E0B;font-weight:bold;padding:4px 8px;border-radius:4px;'
  );
});
