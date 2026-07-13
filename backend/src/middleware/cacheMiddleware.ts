import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

// StdTTL sets standard time to live in seconds (e.g., 300 = 5 minutes)
export const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    return next();
  }
  
  // Create a unique key based on URL and tenantId (and any other query params)
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.json(cachedResponse);
  } else {
    console.log(`Cache miss for ${key}`);
    
    // Override res.json to capture the response body
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Don't cache errors
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body);
      }
      return originalJson(body);
    };
    next();
  }
};
