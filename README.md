# Seeyon Client

![GitHub](https://img.shields.io/github/license/DemoMacro/seeyon-client)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> 一个现代化的 TypeScript Seeyon REST API 客户端库，提供对 Seeyon 的访问。

## 特性

- 🚀 **CAP4 API 支持**: 涵盖表单管理和工作流处理
- 📝 **TypeScript 支持**: 完整的类型定义，提供出色的开发体验
- 🔧 **现代化构建系统**: 基于 unbuild 构建，支持 ESM 和 CJS
- 🌐 **现代 HTTP 客户端**: 使用 ofetch 进行可靠的 HTTP 通信
- 🛡️ **自动认证管理**: Token 自动获取和刷新机制
- 📊 **批量操作支持**: 支持表单数据的批量增删改查
- 📋 **表单截图功能**: 支持表单截图和导出
- 🔄 **基于 Promise**: 全面的异步/等待支持

## 安装

```bash
npm install seeyon-client
# 或者
pnpm add seeyon-client
# 或者
yarn add seeyon-client
```

## 快速开始

```typescript
import { SeeyonClient } from "seeyon-client";

// 初始化客户端
const client = new SeeyonClient({
  username: "your-username",
  password: "your-password",
  baseURL: "http://127.0.0.1/seeyon", // 默认值
  timeout: 30000,
});

// 获取认证 Token
const auth = await client.refreshToken();
console.log("Token:", auth.id);

// 或者直接获取当前 token（如果不存在或过期会自动获取）
const token = await client.getToken();
console.log("Token:", token);

// 发起工作流
const result = await client.cap4.startProcess({
  appName: "协同工作流",
  data: {
    templateCode: "your-template-code",
    draft: "0", // 0: 新建-发送；1: 新建-保存待发
    subject: "测试申请",
  },
});

console.log("工作流发起成功:", result);
```

## 配置

```typescript
interface SeeyonConfig {
  username: string; // REST 账号用户名（必需）
  password: string; // REST 账号密码（必需）
  baseURL?: string; // API 基础地址（默认: http://127.0.0.1/seeyon）
  timeout?: number; // 请求超时时间（毫秒，默认: 30000）
  retry?: number; // 重试次数（默认: 3）
  headers?: Record<string, string>; // 额外请求头
  loginName?: string; // 模拟登录的用户名
  memberId?: string; // 用户ID
  memberCode?: string; // 用户编码
  userAgentFrom?: string; // 终端类型
}
```

## 主要功能

### Token 管理

- **获取当前 Token**: `getToken()` - 获取当前token字符串，如果不存在或过期则自动获取
- **获取新 Token**: `refreshToken()` - 通过API获取新的认证令牌
- **自动刷新**: 在发送请求时自动检查并刷新过期token

### CAP4 表单和工作流 (`client.cap4`)

- **发起工作流**: `startProcess()` - 启动新的工作流实例
- **批量操作**: `batchAdd()`, `batchUpdate()`, `batchDelete()` - 批量处理表单数据
- **数据导出**: `exportData()` - 导出表单数据
- **表单截图**: `formCapture()` - 生成表单截图
- **数据缓存**: `updateCacheFormData()` - 更新表单数据缓存

## 高级用法

### 批量操作表单数据

```typescript
// 批量添加表单数据
const batchResult = await client.cap4.batchAdd({
  formCode: "your-form-code",
  loginName: "your-login-name",
  rightId: "your-right-id",
  dataList: [
    {
      masterTable: {
        name: "form_main_001",
        record: {
          id: 1,
          fields: [
            { name: "field1", value: "value1", showValue: "显示值1" },
            { name: "field2", value: "value2", showValue: "显示值2" },
          ],
        },
      },
    },
  ],
});
```

### 导出表单数据

```typescript
// 导出表单数据
const exportResult = await client.cap4.exportData({
  templateCode: "your-template-code",
  rightId: "your-right-id",
  beginDateTime: "2024-01-01 00:00:00",
  endDateTime: "2024-12-31 23:59:59",
  page: 1,
  pageSize: 100,
});
```

### 表单截图

```typescript
// 生成表单截图
const capture = await client.cap4.formCapture({
  rightId: "your-right-id",
  moduleId: "your-module-id",
  moduleType: 1, // 42: cap无流程表单；1: 协同表单
  renderType: "base64", // 或 "pdf"
  requestParams: {
    serverName: "your-server",
    serverPort: "8080",
    scheme: "http",
    contextPath: "/seeyon",
  },
});
```

## 开发

### 项目结构

```
seeyon-client/
├── packages/seeyon-client/  # 源代码
│   ├── src/
│   │   ├── types.ts         # TypeScript 类型定义
│   │   ├── client.ts        # 主客户端类
│   │   ├── resources/       # 资源类
│   │   │   ├── cap4.ts      # CAP4 表单和工作流
│   │   │   └── index.ts     # 资源导出
│   │   └── index.ts         # 主入口点
│   ├── build.config.ts      # 构建配置
│   └── package.json
├── playground/              # 示例环境
│   ├── client.ts            # 客户端示例
│   ├── config.ts            # 配置管理
│   ├── package.json         # 依赖声明
│   └── tsconfig.json        # TypeScript 配置
├── docs/                    # 文档
│   └── seeyoncloud/         # Seeyon 官方文档
├── basis.config.ts          # 基础配置
├── renovate.json           # 依赖更新配置
├── vitest.config.ts         # 测试配置
└── package.json
```

### 构建

```bash
# 安装依赖
pnpm install

# 构建
cd packages/seeyon-client
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试监听模式
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

## 系统要求

- Node.js 16+ 或更高版本
- Seeyon CAP4 服务器（支持 REST API）

## API 参考

### 客户端类 (`SeeyonClient`)

```typescript
class SeeyonClient {
  constructor(config: SeeyonConfig);

  // CAP4 资源
  get cap4(): Cap4Resource;

  // 通用请求方法
  request<T>(url: string, options?: FetchOptions): Promise<T>;

  // Token 管理
  getToken(): Promise<string | undefined>;
  refreshToken(): Promise<AuthResponse>;
}
```

### CAP4 资源 (`Cap4Resource`)

```typescript
class Cap4Resource {
  startProcess(
    params: ProcessStartParams,
  ): Promise<ApiResponse<ProcessStartResponse>>;
  updateCacheFormData(
    params: UpdateCacheFormDataParams,
  ): Promise<ApiResponse<void>>;
  batchAdd(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;
  batchUpdate(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;
  batchDelete(
    params: BatchDeleteParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;
  exportData(
    params: ExportDataParams,
  ): Promise<ApiResponse<ExportDataResponse>>;
  formCapture(params: FormCaptureParams): Promise<FormCaptureResponse>;
}
```

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 打开 Pull Request

### 开发指南

- 编写具有适当类型定义的 TypeScript 代码
- 为新功能添加测试
- 为 API 更新更新文档
- 遵循现有的代码风格
- 提交 PR 前确保所有测试通过

## 相关链接

- [Seeyon 官方文档](https://open.seeyoncloud.com/)
- [Seeyon API 开发文档](https://open.seeyoncloud.com/seeyonapi/)

## 支持

- 📖 [示例环境](./playground/) - 详细的使用示例和测试
- 🐛 [问题跟踪](https://github.com/DemoMacro/seeyon-client/issues)

## 许可证

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
