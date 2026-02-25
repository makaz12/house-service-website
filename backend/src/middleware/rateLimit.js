function createRateLimiter({ windowMs, max }) {
  const requests = new Map();

  return function rateLimit(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    const recentHits = (requests.get(key) || []).filter(
      (timestamp) => timestamp > windowStart
    );

    if (recentHits.length >= max) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    recentHits.push(now);
    requests.set(key, recentHits);
    next();
  };
}

module.exports = { createRateLimiter };
