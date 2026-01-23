import https from "https";

// Helper function to make HTTPS requests
export function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error("Failed to parse response"));
          }
        });
      })
      .on("error", reject);
  });
}
