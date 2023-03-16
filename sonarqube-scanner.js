const scanner = require("sonarqube-scanner");

scanner(
  {
    serverUrl: "https://scanner.automatly.io",
    token: "sqp_f17d4510a04881a70943e3ed62b983fc2dd79d1d",
    options: {
      "sonar.projectKey": "Auth-Framework",
      "sonar.sources": "./src",
      "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
    },
  },
  () => process.exit()
);
