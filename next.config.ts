import type { NextConfig } from "next";

const shutterImageHostnames = (
  process.env.SHUTTER_IMAGE_HOSTNAMES ??
  process.env.SHUTTER_IMAGE_HOSTNAME ??
  ""
)
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: shutterImageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
