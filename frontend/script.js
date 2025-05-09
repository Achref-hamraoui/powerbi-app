document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Wait for Power BI library to be loaded
        await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (window.powerbi) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject("Power BI library failed to load.");
            }, 5000); // 5 seconds timeout
        });

        console.log("✅ Power BI library loaded.");

        const res = await fetch('/api/powerbi-token');
        if (!res.ok) {
            document.getElementById('reportContainer').innerText = 'Erreur de chargement du rapport (API non disponible).';
            return;
        }

        const data = await res.json();
        console.log("✅ Power BI Token Data:", data);

        const embedConfig = {
            type: 'report',
            id: data.reportId,
            embedUrl: data.embedUrl,
            accessToken: data.token || '',
            tokenType: window.powerbi.models.TokenType.Embed,
            settings: {
                panes: {
                    filters: { visible: false },
                    pageNavigation: { visible: true }
                }
            }
        };

        const reportContainer = document.getElementById('reportContainer');
        const report = window.powerbi.embed(reportContainer, embedConfig);

        report.on("loaded", function() {
            console.log("✅ Power BI Report Loaded");
            document.getElementById('reportContainer').style.color = '#333';
        });

        report.on("error", function(event) {
            console.error("❌ Error:", event.detail);
            document.getElementById('reportContainer').innerText = 'Erreur : ' + event.detail.message;
        });

    } catch (error) {
        console.error('❌ Error loading Power BI report:', error);
        document.getElementById('reportContainer').innerText = 'Erreur : ' + error;
    }
});
