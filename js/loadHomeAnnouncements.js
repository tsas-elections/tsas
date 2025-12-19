fetch("https://tsas-backend.onrender.com/api/announcements")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("home-announcement-container");
        if (!container) return;

        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = "<p class='text-muted mb-0'>No announcements yet.</p>";
            return;
        }

        const urgentRe = /(urgent|important|immediate|last date|deadline)/i;
        const maxItems = 3;

        data.slice(0, maxItems).forEach(a => {
            const created = new Date(a.createdAt);
            const formatted = created.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const now = new Date();
            const diffHours = (now - created) / (1000 * 60 * 60);
            const isNew = diffHours <= 24;
            const isUrgent = urgentRe.test(a.title || "");

            const descRaw = a.description || a.summary || "Refer to the notice board for full details.";
            const desc = String(descRaw).length > 120 ? `${String(descRaw).slice(0, 120)}…` : String(descRaw);

            container.innerHTML += `
                <article class="announcement ${isUrgent ? "is-urgent" : ""}">
                    <div class="d-flex align-items-center flex-wrap gap-2">
                        <div class="notice-title">${a.title || "Announcement"}</div>
                        ${isUrgent ? '<span class="tag tag-urgent">URGENT</span>' : ''}
                        ${isNew ? '<span class="tag tag-new">NEW</span>' : ''}
                    </div>
                    <div class="notice-meta">${formatted}</div>
                    <div class="notice-desc">${desc}</div>
                    <div class="notice-actions">
                        <a class="link-read" href="notices.html#announcements">Read More</a>
                    </div>
                </article>
            `;
        });

        if (data.length > maxItems) {
            container.innerHTML += `
                <div>
                    <a class="link-strong" href="notices.html#announcements">View all announcements →</a>
                </div>
            `;
        }
    })
    .catch(() => {
        const el = document.getElementById("home-announcement-container");
        if (el) el.innerHTML = "<p class='text-danger mb-0'>Failed to load announcements.</p>";
    });
