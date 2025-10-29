# Seeyon Client

![npm version](https://img.shields.io/npm/v/seeyon-client)
![npm downloads](https://img.shields.io/npm/dw/seeyon-client)
![npm license](https://img.shields.io/npm/l/seeyon-client)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> 一个现代化的 TypeScript Seeyon REST API 客户端库，提供对 Seeyon CAP4 表单和工作流的完整访问，专注于表单数据处理、工作流发起和批量操作。

## 特性

- 🚀 **完整的 CAP4 API 支持**: 涵盖表单管理、工作流处理和批量操作
- 📝 **完整的 TypeScript 支持**: 全面的类型定义和类型安全
- 🔄 **基于 ofetch**: 使用现代化的 HTTP 客户端，提供可靠的请求处理
- 🛡️ **自动认证管理**: Token 自动获取、刷新和验证机制
- 📊 **批量操作**: 支持表单数据的批量增删改查
- 📋 **表单截图**: 内置表单截图和数据导出功能
- 🗃️ **数据缓存**: 表单数据缓存更新和管理
- 🔧 **简单配置**: 灵活且直观的配置选项

## 安装

```bash
npm install seeyon-client
# 或者
yarn add seeyon-client
# 或者
pnpm add seeyon-client
```

## 快速开始

```typescript
import { SeeyonClient } from "seeyon-client";

// 初始化客户端
const client = new SeeyonClient({
  username: "your-username",
  password: "your-password",
  baseURL: "http://127.0.0.1/seeyon", // 默认值
});

// 获取认证 Token
const auth = await client.auth.getToken();
console.log("认证成功，Token:", auth.id);

// 发起工作流
const workflowResult = await client.cap4.startProcess({
  appName: "协同工作流",
  data: {
    templateCode: "your-template-code",
    draft: "0", // 0: 新建-发送；1: 新建-保存待发
    subject: "测试申请流程",
  },
});

console.log("工作流发起成功，流程ID:", workflowResult.data.processId);
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

### 基础用法

```typescript
import { SeeyonClient } from "seeyon-client";

// 简单配置（使用默认设置）
const client = new SeeyonClient({
  username: "admin",
  password: "password123",
});

// 高级配置（自定义设置）
const client = new SeeyonClient({
  username: "admin",
  password: "password123",
  baseURL: "https://your-seeyon-server.com/seeyon",
  timeout: 60000,
  retry: 5,
  headers: {
    "X-Custom-Header": "custom-value",
  },
  loginName: "模拟用户",
  memberId: "user001",
});
```

### 认证方式

**重要**: Seeyon API 需要有效的身份验证：

- **用户名密码认证** (`username/password`): 用于获取初始访问令牌
- **自动 Token 刷新**: Token 过期前自动刷新（15分钟有效期）
- **Token 验证**: 提供验证 Token 有效性的方法

## 核心功能

### 认证管理 (`client.auth`)

- **`getToken()`**: 获取认证 Token
- **`verifyToken()`**: 验证 Token 有效性
- **`logout()`**: 注销当前会话

### CAP4 表单和工作流 (`client.cap4`)

- **`startProcess()`**: 发起新的工作流程
- **`updateCacheFormData()`**: 更新表单数据缓存
- **`batchAdd()`**: 批量添加表单数据
- **`batchUpdate()`**: 批量更新表单数据
- **`batchDelete()`**: 批量删除表单数据
- **`exportData()`**: 导出表单数据
- **`formCapture()`**: 生成表单截图

## 高级使用示例

### 批量操作表单数据

```typescript
// 批量添加表单数据
const batchResult = await client.cap4.batchAdd({
  formCode: "FORM_001",
  loginName: "admin",
  rightId: "RIGHT_001",
  doTrigger: true,
  dataList: [
    {
      masterTable: {
        name: "form_main_001",
        record: {
          id: 1,
          fields: [
            { name: "title", value: "申请标题", showValue: "申请标题" },
            { name: "content", value: "申请内容", showValue: "申请内容" },
          ],
        },
      },
    },
  ],
});

console.log("批量添加成功:", batchResult.data.successCount);
```

### 导出表单数据

```typescript
// 导出表单数据
const exportResult = await client.cap4.exportData({
  templateCode: "TEMPLATE_001",
  rightId: "RIGHT_001",
  beginDateTime: "2024-01-01 00:00:00",
  endDateTime: "2024-12-31 23:59:59",
  page: 1,
  pageSize: 50,
});

console.log("导出数据条数:", exportResult.data.data.length);
```

### 表单截图

```typescript
// 生成表单截图
const capture = await client.cap4.formCapture({
  rightId: "RIGHT_001",
  moduleId: "SUMMARY_001",
  moduleType: 1, // 1: 协同表单；42: CAP4无流程表单
  renderType: "base64", // "base64" 或 "pdf"
  requestParams: {
    serverName: "seeyon-server",
    serverPort: "8080",
    scheme: "http",
    contextPath: "/seeyon",
  },
});

console.log("表单截图生成成功:", capture.result);
```

## API 概览

### 认证资源

```typescript
class AuthResource {
  getToken(): Promise<AuthResponse>;
  verifyToken(): Promise<boolean>;
  logout(): Promise<void>;
}
```

### CAP4 资源

```typescript
class Cap4Resource {
  // 工作流相关
  startProcess(
    params: ProcessStartParams,
  ): Promise<ApiResponse<ProcessStartResponse>>;

  // 数据缓存
  updateCacheFormData(
    params: UpdateCacheFormDataParams,
  ): Promise<ApiResponse<void>>;

  // 批量操作
  batchAdd(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;
  batchUpdate(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;
  batchDelete(
    params: BatchDeleteParams,
  ): Promise<ApiResponse<BatchOperationResponse>>;

  // 数据导出
  exportData(
    params: ExportDataParams,
  ): Promise<ApiResponse<ExportDataResponse>>;

  // 表单截图
  formCapture(params: FormCaptureParams): Promise<FormCaptureResponse>;
}
```

## 错误处理

```typescript
try {
  const result = await client.cap4.startProcess(params);
} catch (error) {
  if (error instanceof Error) {
    console.error("操作失败:", error.message);
    // 处理具体错误
  }
}
```

## 常见错误和解决方案

1. **认证失败**: 检查用户名密码是否正确
2. **Token 过期**: 自动刷新，一般无需手动处理
3. **权限不足**: 确保用户有相应的操作权限
4. **网络超时**: 可调整 timeout 参数或检查网络连接

## 支持

- 📖 [示例环境](../../playground/README.md) - 实际使用示例
- 📖 [Seeyon 官方文档](https://open.seeyoncloud.com/)
- 🐛 [报告问题](https://github.com/DemoMacro/seeyon-client/issues)

## 许可证

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
