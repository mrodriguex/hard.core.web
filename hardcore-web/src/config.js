const required = (value, name) => {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const parseBool = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value === "true";
};

export const env = {
  apiBaseUrl: required(import.meta.env.VITE_API_BASE_URL, "VITE_API_BASE_URL"),
  signalrHubUrl: required(import.meta.env.VITE_SIGNALR_HUB_URL, "VITE_SIGNALR_HUB_URL"),
  signalrSkipNegotiation: parseBool(import.meta.env.VITE_SIGNALR_SKIP_NEGOTIATION, false),
};