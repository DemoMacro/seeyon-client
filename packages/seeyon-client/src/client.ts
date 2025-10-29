import { type FetchOptions, ofetch } from "ofetch";
import type { AuthResponse, SeeyonConfig } from "./types";
import { Cap4Resource } from "./resources/cap4";

/**
 * Seeyon 客户端类
 */
export class SeeyonClient {
  public config: SeeyonConfig;
  private _fetch: ReturnType<typeof ofetch.create>;
  private _token?: string;
  private _tokenExpiry?: number;
  private _cap4!: Cap4Resource;

  constructor(config: SeeyonConfig) {
    this.config = {
      baseURL: "http://127.0.0.1/seeyon",
      timeout: 30000,
      retry: 3,
      ...config,
    };

    this._fetch = this.createFetchInstance();
    this._cap4 = new Cap4Resource(this);
  }

  /**
   * 创建 fetch 实例
   */
  private createFetchInstance(): ReturnType<typeof ofetch.create> {
    return ofetch.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      retry: this.config.retry,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.config.headers,
      },
      onRequest: this.onRequest.bind(this),
    });
  }

  /**
   * 请求拦截器 - 自动添加认证头
   */
  private async onRequest(context: {
    request: RequestInfo;
    options: FetchOptions;
  }): Promise<void> {
    const url =
      typeof context.request === "string"
        ? context.request
        : context.request.url;

    // 获取 token 的请求不需要添加认证头
    if (!url.includes("/rest/token")) {
      await this.ensureValidToken();
      if (this._token) {
        const headers = new Headers(context.options.headers);
        headers.set("token", this._token);
        context.options.headers = headers;
      }
    }
  }

  /**
   * 确保 token 有效
   */
  private async ensureValidToken(): Promise<void> {
    if (
      !this._token ||
      !this._tokenExpiry ||
      Date.now() > this._tokenExpiry - 5 * 60 * 1000
    ) {
      await this.refreshToken();
    }
  }

  /**
   * 发起请求
   */
  async request<T = unknown>(
    url: string,
    options: Omit<FetchOptions, "responseType"> = {},
  ): Promise<T> {
    return this._fetch<T>(url, { ...options, responseType: "json" as const });
  }

  get cap4(): Cap4Resource {
    return this._cap4;
  }

  /**
   * 获取当前 token，如果不存在或过期则自动获取
   */
  async getToken(): Promise<string | undefined> {
    await this.ensureValidToken();
    return this._token;
  }

  /**
   * 获取新的 token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const body: Record<string, unknown> = {
        userName: this.config.username,
        password: this.config.password,
      };

      // 添加模拟登录参数
      if (this.config.loginName) body.loginName = this.config.loginName;
      if (this.config.memberId) body.memberId = this.config.memberId;
      if (this.config.memberCode) body.memberCode = this.config.memberCode;
      if (this.config.userAgentFrom)
        body.userAgentFrom = this.config.userAgentFrom;

      const response = await this.request<AuthResponse>("/rest/token", {
        method: "POST",
        body,
        baseURL: this.config.baseURL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...this.config.headers,
        },
        timeout: this.config.timeout,
        retry: this.config.retry,
      });

      this._token = response.id;
      this._tokenExpiry = Date.now() + 15 * 60 * 1000; // 15分钟过期
      return response;
    } catch (error) {
      throw new Error(
        `Failed to refresh token: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }
}
