/* eslint-disable import/no-anonymous-default-export */

export default {
  seedGithubRepository: () =>
    "https://github.com/dualboot-partners/latam-nextjs-seed",
  cliGithubRepository: () =>
    "https://gitlab.com/dualbootpartners/internal/uy/dbp-nextjs-cli",
  nextJsPage: () => "https://nextjs.org/docs/getting-started",
  tailwindPage: () => "https://tailwindcss.com/",
  conventionalCommitsPage: () =>
    "https://www.conventionalcommits.org/en/v1.0.0/",

  /* examples */
  exampleDotCom: () => "https://www.example.com/",
  exampleLinkToAnchor: () =>
    "https://github.com/microsoft/vscode-remote-release/issues/8436#issuecomment-1531866310",
  exampleWithEnvVars: () =>
    `https://${process.env.NEXT_PUBLIC_API_URL}/some-url-here`,

  exampleWith: (param1: string, param2: string) =>
    `https://www.example.com?param=${param1}&extraParam=${param2}`,

  exampleConditionalRoutes: ({
    param1,
    param2,
    param3,
    isBooleanFlag = true
  }: {
    param1: string;
    param2: string;
    param3: string;
    isBooleanFlag: boolean;
  }) => {
    const queryParams = [];

    if (param3) {
      queryParams.push(`param3=${param3}`);
    }

    if (param1 && isBooleanFlag) {
      queryParams?.push(`param1=${param1}`);
      queryParams?.push(`param2=${param2}`);
    }

    const queryString = queryParams.length > 0 ? queryParams.join("&") : "";

    const baseUrl = process.env.NEXT_PUBLIC_SOME_ENV_VAR || "example.com";

    return `${baseUrl}${isBooleanFlag ? `/some-url` : `/fallback-url`}?${queryString}`;
  }
};
