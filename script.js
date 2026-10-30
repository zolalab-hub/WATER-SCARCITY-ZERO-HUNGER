const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle instanceof HTMLButtonElement && primaryNav instanceof HTMLElement) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const communityFilter = document.querySelector("#community-filter");
const communityTable = document.querySelector("#community-table");
const communityChart = document.querySelector("#community-chart");

if (
  communityFilter instanceof HTMLSelectElement &&
  communityTable instanceof HTMLTableElement &&
  communityChart instanceof HTMLElement
) {
  const rows = Array.from(communityTable.querySelectorAll("tbody tr"));
  const bars = Array.from(communityChart.querySelectorAll(".community-bar"));
  const householdCount = document.querySelector("#kpi-households");
  const communityCount = document.querySelector("#kpi-communities");
  const daysCount = document.querySelector("#kpi-days");
  const highestCount = document.querySelector("#kpi-highest");
  const highestLabel = document.querySelector("#kpi-highest-label");
  const tableCount = document.querySelector("#table-count");
  const tableTotal = document.querySelector("#table-total");

  const updateDashboard = () => {
    const selectedCommunity = communityFilter.value;
    const visibleRows = rows.filter((row) => {
      const matches = selectedCommunity === "all" || row.dataset.community === selectedCommunity;
      row.hidden = !matches;
      return matches;
    });
    const totalsByCommunity = new Map();
    let totalDays = 0;

    visibleRows.forEach((row) => {
      const days = Number(row.dataset.days);
      const community = row.dataset.community;
      if (community) {
        totalsByCommunity.set(community, (totalsByCommunity.get(community) ?? 0) + days);
      }
      totalDays += days;
    });

    const highestCommunity = Array.from(totalsByCommunity.entries()).sort((first, second) => second[1] - first[1])[0];
    bars.forEach((bar) => {
      const days = Number(bar.dataset.days);
      const community = bar.dataset.community;
      bar.style.setProperty("--bar-height", `${Math.max((days / 20) * 100, 3)}%`);
      bar.classList.toggle("is-muted", selectedCommunity !== "all" && community !== selectedCommunity);
      bar.classList.toggle("is-selected", selectedCommunity !== "all" && community === selectedCommunity);
    });
    communityChart.setAttribute(
      "aria-label",
      `Days without sufficient water by community: ${bars
        .map((bar) => `${bar.dataset.community}, ${bar.dataset.days} days`)
        .join("; ")}.`,
    );

    if (householdCount) householdCount.textContent = String(visibleRows.length);
    if (communityCount) communityCount.textContent = String(totalsByCommunity.size);
    if (daysCount) daysCount.textContent = String(totalDays);
    if (highestCount) highestCount.textContent = highestCommunity ? `${highestCommunity[1]} days` : "—";
    if (highestLabel) highestLabel.textContent = highestCommunity?.[0] ?? "No records";
    if (tableCount) tableCount.textContent = `${visibleRows.length} ${visibleRows.length === 1 ? "record" : "records"}`;
    if (tableTotal) tableTotal.textContent = String(totalDays);
  };

  communityFilter.addEventListener("change", updateDashboard);
  updateDashboard();
}