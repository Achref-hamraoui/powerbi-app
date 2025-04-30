(async () => {
    const res = await fetch('/api/powerbi-token');
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
})();
