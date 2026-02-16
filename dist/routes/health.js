export function handleHealth(_req, res) {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
}
//# sourceMappingURL=health.js.map