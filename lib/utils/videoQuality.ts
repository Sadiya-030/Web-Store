/**
 * Video quality utilities for adaptive streaming
 */

export type NetworkSpeed = "4g" | "3g" | "2g" | "slow-2g" | "unknown";

export interface VideoSource {
  url: string;
  mimeType: string;
  format: string;
}

/**
 * Get the network connection speed
 */
function getNetworkSpeed(): NetworkSpeed {
  if (typeof navigator === "undefined") return "unknown";

  const connection = (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return "unknown";

  return (connection.effectiveType as NetworkSpeed) || "unknown";
}

/**
 * Determine preferred video quality based on network speed
 */
function getQualityByNetwork(speed: NetworkSpeed): "480p" | "720p" | "1080p" {
  switch (speed) {
    case "slow-2g":
    case "2g":
      return "480p";
    case "3g":
      return "720p";
    case "4g":
    case "unknown":
    default:
      return "1080p";
  }
}

/**
 * Determine preferred video quality based on screen size
 */
function getQualityByScreenSize(): "480p" | "720p" | "1080p" {
  if (typeof window === "undefined") return "1080p";

  const width = window.innerWidth;

  if (width < 768) {
    return "480p"; // Mobile
  } else if (width < 1920) {
    return "720p"; // Tablet/small desktop
  }
  return "1080p"; // Large desktop
}

/**
 * Extract quality level from video source URL or format
 */
function extractQualityFromSource(source: VideoSource): "480p" | "720p" | "1080p" | null {
  const { url, format } = source;
  const combined = `${url}${format}`.toLowerCase();

  if (combined.includes("1080") || combined.includes("fullhd")) return "1080p";
  if (combined.includes("720") || combined.includes("hd")) return "720p";
  if (combined.includes("480") || combined.includes("mobile")) return "480p";

  return null;
}

/**
 * Quality preference order for selection
 */
const qualityOrder: Record<"480p" | "720p" | "1080p", number> = {
  "480p": 1,
  "720p": 2,
  "1080p": 3,
};

/**
 * Get the best video source based on network speed and screen size
 * Prefers the most conservative option (lowest of the two)
 */
export function getBestVideoSource(
  sources: VideoSource[]
): VideoSource | null {
  if (!sources || sources.length === 0) return null;

  const networkQuality = getQualityByNetwork(getNetworkSpeed());
  const screenQuality = getQualityByScreenSize();

  // Take the most conservative option (lower quality)
  const targetQuality =
    qualityOrder[networkQuality] < qualityOrder[screenQuality]
      ? networkQuality
      : screenQuality;

  // First, try to find an exact match for target quality
  let match = sources.find((source) => {
    const quality = extractQualityFromSource(source);
    return quality === targetQuality;
  });

  if (match) return match;

  // If no exact match, find the closest lower quality
  const qualityLevels: Array<"480p" | "720p" | "1080p"> = ["480p", "720p", "1080p"];
  const targetIndex = qualityLevels.indexOf(targetQuality);

  for (let i = targetIndex; i >= 0; i--) {
    match = sources.find((source) => {
      const quality = extractQualityFromSource(source);
      return quality === qualityLevels[i];
    });
    if (match) return match;
  }

  // If still no match, return the first source
  return sources[0] || null;
}
