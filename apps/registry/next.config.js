module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async rewrites() {
    return [
      {
        source: "/:payload",
        destination: "/api/:payload",
      },
      {
        source: "/:payload/interview",
        destination: "/interview",
      },
      {
        source: "/:payload/jobs",
        destination: "/jobs",
      },
      {
        source: "/:payload/letter",
        destination: "/letter",
      },
      {
        source: "/:payload/suggestions",
        destination: "/suggestions",
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};
