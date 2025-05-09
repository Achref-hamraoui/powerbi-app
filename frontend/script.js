document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Wait for Power BI to be loaded
        if (!window['powerbi']) {
            console.error("❌ Power BI library not loaded");
            document.getElementById('reportContainer').innerText = 'Erreur : Power BI library not loaded.';
            return;
        }

        const res = await fetch('/api/powerbi-token');
        if (!res.ok) {
            document.getElementById('reportContainer').innerText = 'Erreur de chargement du rapport (API non disponible).';
            return;
        }

        const data = await res.json();
        console.log(data); // Debugging

        const embedConfig = {
            type: 'report',
            id: data.reportId,
            embedUrl: data.embedUrl,
            accessToken: data.token || '',
            tokenType: window['powerbi'].models.TokenType.Embed,
            settings: {
                panes: {
                    filters: { visible: false },
                    pageNavigation: { visible: true }
                }
            }
        };

        const reportContainer = document.getElementById('reportContainer');
        const powerbiService = new window['powerbi'].service.Service(window['powerbi'].factories.createEmbedConfigService());
        const report = powerbiService.embed(reportContainer, embedConfig);

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
        document.getElementById('reportContainer').innerText = 'Erreur : ' + error.message;
    }
});
