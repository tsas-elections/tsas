fetch("https://tsas-backend.onrender.com/api/notices")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("notice-container");
        if (!container) return;

        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = "<p class='text-muted mb-0'>No notices available.</p>";
            return;
        }

        const urgentRe = /(urgent|important|immediate|last date|deadline)/i;

        data.forEach(notice => {
            const created = new Date(notice.createdAt);
            const formatted = created.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const now = new Date();
            const diffHours = (now - created) / (1000 * 60 * 60);
            const isNew = diffHours <= 24;
            const isUrgent = urgentRe.test(notice.title || "");

            const fileUrl = notice.fileUrl || "";
            const titleHtml = fileUrl
                ? `<a class="notice-title" href="${fileUrl}" target="_blank" rel="noopener noreferrer">${notice.title}</a>`
                : `<span class="notice-title">${notice.title || "Untitled notice"}</span>`;

            const descRaw = notice.description || notice.summary || "Open the notice to view the full details.";
            const desc = String(descRaw).length > 140 ? `${String(descRaw).slice(0, 140)}…` : String(descRaw);

            container.innerHTML += `
                <article class="notice-card ${isUrgent ? "is-urgent" : ""}">
                    <div class="d-flex align-items-start justify-content-between gap-2">
                        <div>
                            <div class="d-flex align-items-center flex-wrap gap-2">
                                ${titleHtml}
                                ${isUrgent ? '<span class="tag tag-urgent">URGENT</span>' : ''}
                                ${isNew ? '<span class="tag tag-new">NEW</span>' : ''}
                            </div>
                            <div class="notice-meta">${formatted}</div>
                            <div class="notice-desc">${desc}</div>

                            <div class="notice-actions">
                                ${fileUrl ? `<a class="link-read" href="${fileUrl}" target="_blank" rel="noopener noreferrer">Read More</a>` : ""}
                            </div>
                        </div>

                        ${fileUrl ? `<a class="btn btn-tsas btn-sm" href="${fileUrl}" target="_blank" rel="noopener noreferrer" download>Download</a>` : ""}
                    </div>
                </article>
            `;
        });
    })
    .catch(() => {
        const el = document.getElementById("notice-container");
        if (el) el.innerHTML = "<p class='text-danger mb-0'>Failed to load notices.</p>";
    });
