document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/api/powerbi-token');
        if (!res.ok) {
            throw new Error('Failed to fetch Power BI token');
        }

        const data = await res.json();

        const embedConfig = {
            type: 'report',
            id: data.reportId,
            embedUrl: data.embedUrl,
            accessToken: data.token,
            tokenType: window.powerbi.models.TokenType.Embed,
            settings: {
                panes: {
                    filters: { visible: false },
                    pageNavigation: { visible: true }
                }
            }
        };

        const reportContainer = document.getElementById('reportContainer');
        powerbi.embed(reportContainer, embedConfig);
        console.log('✅ Power BI report embedded successfully');
    } catch (err) {
        console.error('❌ Error embedding Power BI report:', err);
        alert("Error loading Power BI report. Please try again.");
    }
});
