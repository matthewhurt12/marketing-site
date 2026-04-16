import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #171a1f 0%, #1e2230 50%, #171a1f 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Logo */}
        <img
          src="https://raw.githubusercontent.com/matthewhurt12/marketing-site/main/public/logo.png"
          width={140}
          height={140}
          style={{ marginBottom: 32 }}
        />
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: "#d4dbe6",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          In Person
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#7a8599",
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
          }}
        >
          Dating, without the app part
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
