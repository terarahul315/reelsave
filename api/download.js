export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Aapki Key Server Ke Andar Protected Rahegi
    const RAPID_API_KEY  = "c226f9c559msh6075143f957b67cp1c488cjsn50c46061a4cb"; 
    const RAPID_API_HOST = "instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com";

    try {
        const apiUrl = `https://${RAPID_API_HOST}/scraper?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST
            }
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
