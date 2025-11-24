export function isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      if (!decoded.exp) return false; 
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true; 
    }
  }
  