import { useEffect, useRef } from "react";
const version = require('../../package.json').version;
interface useCacheProps {
    key: string
}
interface useCashResult {
    clear: () => void,
    get: (url: string) => Promise<any>,
    add: (url: string, data: any, lifetimeInSeconds: number) => Promise<boolean>
}
const useCache = ({ key }: useCacheProps = {
    key: "regional-water"
}): useCashResult => {
    const exist = useRef<boolean>(false);
    const cachingName = (key) + version;
    useEffect(() => {
        if (window && 'caches' in window) {
            exist.current = true;
        } else {
            exist.current = false;
        }
    }, [])
    return {
        clear: async () => {
            if (!exist.current) return false;
            const cacheKeys = await caches.keys();
            for (let cacheKey of cacheKeys) {
                if (cacheKey.startsWith(key) && cacheKey !== cachingName) {
                    await caches.delete(cacheKey);
                }
            }
        },
        get: async (url: string) => {
            if (!exist.current) return false;
            const cache = await caches.open(cachingName);
            const cachedResponse = await cache.match(url);
            if (!cachedResponse) return null;
            const createTime = cachedResponse.headers.get("Cache-Created");
            const cacheLifetime = cachedResponse.headers.get("Cache-Lifetime");
            if (!createTime || !cacheLifetime || Date.now() - parseInt(createTime) > parseInt(cacheLifetime) * 1000) {
                return null;  // Cache expired 
            }

            return await cachedResponse.json();
        },
        add: async (url: string, data: any, lifetimeInSeconds: number): Promise<boolean> => {
            try {
                if (!exist.current) return false;
                let cache = await caches.open(cachingName);
                const response = new Response(JSON.stringify(data));
                // Set cache headers       
                response.headers.append("Cache-Created", Date.now().toString());
                response.headers.append("Cache-Lifetime", lifetimeInSeconds.toString());
                cache.put(url, response);
                return true
            }
            catch (err) {
                return false;
            }
        }
    };
}
export default useCache;