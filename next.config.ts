import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sites currently serves these already-compressed local launch assets more
    // reliably than its unavailable runtime image-transform binding.
    unoptimized: true,
  },
};

export default nextConfig;
