document.addEventListener("DOMContentLoaded", async () => {
    try {
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
            tokenType: window['powerbi-client'].models.TokenType.Embed,
            settings: {
                panes: {
                    filters: { visible: false },
                    pageNavigation: { visible: true }
                }
            }
        };

        const reportContainer = document.getElementById('reportContainer');
        const powerbiService = new window['powerbi-client'].service.Service(window['powerbi-client'].factories.createEmbedConfigService());
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
