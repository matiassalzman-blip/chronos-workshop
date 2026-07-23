import "@testing-library/jest-dom";
import "whatwg-fetch";

if (!global.Request) {
  global.Request = class Request {
    constructor(url: string | Request, init?: RequestInit) {
      void init; // Intentionally unused
      this.url = typeof url === "string" ? url : url.url;
    }
    url: string;
  } as typeof Request;
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body?: BodyInit, init?: ResponseInit) {
      void body; // Intentionally unused
      this.status = init?.status || 200;
    }
    status: number;
    json() {
      return Promise.resolve({});
    }
    text() {
      return Promise.resolve("");
    }
  } as typeof Response;
}

// Mock Next.js App Router navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  })),
  useParams: jest.fn(() => ({})),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => "/"),
  useSelectedLayoutSegment: jest.fn(() => null),
  useSelectedLayoutSegments: jest.fn(() => []),
  redirect: jest.fn()
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({
    children
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => children,
  useTheme: () => ({ theme: "light", setTheme: jest.fn() })
}));

// Browser API mocks
const intersectionObserverMock = () => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
});

window.IntersectionObserver = jest
  .fn()
  .mockImplementation(intersectionObserverMock);

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// File API mocks for uploads
global.File = class MockFile extends Blob {
  name: string;
  lastModified: number;
  webkitRelativePath = "";

  constructor(
    bits: BlobPart[],
    filename: string,
    options: FilePropertyBag = {}
  ) {
    super(bits, options);
    this.name = filename;
    this.lastModified = Date.now();
  }
} as unknown as typeof File;

/* import * as nextRouter from "next/router";
nextRouter.useRouter = jest.fn();

nextRouter.useRouter.mockImplementation(() => ({
  push: jest.fn(),
  pathname: "",
  asPath: "",
})); */

/* jest.mock("next-auth/jwt", () => {
  return {
    getToken: jest.fn(),
  };
}); */

// Mock console.error globally to prevent error logs in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});
