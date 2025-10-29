# 调用Rest接口

## 基于POST的认证（推荐）

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/token`
- **请求头：**
  - Accept: application/json
  - Content-Type: application/json

### 请求体

```json
{
  "userName": "restName",
  "password": "restPassword",
  "loginName": "loginName"
}
```

### 基于GET的认证

### 接口请求说明

- **HTTP请求方式：** GET
- **接口地址：** `http://ip:port/seeyon/rest/token/{userName}/{password}?loginName={loginName}`
- **请求头：**
  - Accept: application/json
  - Content-Type: application/json

### 认证返回结果

**成功返回：**

```json
{
  "id": "013a2a1e-a0b0-4f66-b533-da0563f89c6c"
}
```

**带用户信息返回：**

```json
{
  "bindingUser": "...",
  "id": "013a2a1e-a0b0-4f66-b533-da0563f89c6c"
}
```

**失败返回：**

```json
{
  "id": "-1"
}
```

## 实现步骤

### 1. 注册Rest账号

外部系统要调用V5系统Rest接口，需要注册Rest账号。在V5系统管理员界面的"信息集成配置"->"REST用户管理"中新建REST用户。

### 2. 获取Token

通过调用认证接口获取token，用于后续所有Rest接口的身份验证。

**基于POST的认证：**

```
POST http://127.0.0.1/seeyon/rest/token HTTP/1.1
Host: 127.0.0.1
Accept: application/json
Content-Type: application/json

{
    "userName": "rest",
    "password": "123456"
}
```

**基于GET的认证：**

```
GET http://127.0.0.1/seeyon/rest/token/rest/123456 HTTP/1.1
Host: 127.0.0.1
Accept: application/json
Content-Type: application/json
```

### 3. 模拟人员登录

如需要以指定用户身份调用接口，可在认证时添加用户身份参数。

**POST方式：**

```json
{
  "userName": "REST帐号",
  "password": "REST密码",
  "memberId": "用户的ID",
  "loginName": "用户的登录名",
  "code": "用户的人员编码",
  "userAgentFrom": "pc"
}
```

**GET方式：**

```
GET http://127.0.0.1/seeyon/rest/token/{userName}/{password}?loginName=zhangsan
```

### 4. 设置登录端类型

请求参数`userAgentFrom`用于标识当前Rest请求来源，默认为`rest`。

**可选值：**

- pc（普通电脑）
- mobile（手机终端）
- iphone、ipad、androidphone、androidpad
- wechat（微信）
- ucpc（致信PC客户端）
- rest（REST调用）
- h5（HTML5）
- zhifei（致飞）
- WeChat（微信公众号）
- Lark（飞书）
- DingTalk（钉钉）
- wxwork（企业微信）
- welink（welink）

**示例：**

```
GET http://127.0.0.1/seeyon/rest/token/{userName}/{password}?loginName={loginName}&userAgentFrom=mobile
```

### 5. Token校验设置

REST账号可设置是否校验绑定IP：

- 勾选校验：获取token时校验IP，必须与绑定IP一致
- 不勾选校验：不对请求IP做校验

### 6. 调用具体Rest接口

**Token传递方式：**

**方式一：HTTP请求头中传递**

```
GET http://127.0.0.1/seeyon/rest/xxx HTTP/1.1
Host: 127.0.0.1
Accept: application/json
Content-Type: application/json;charset=UTF-8
token: 013a2a1e-a0b0-4f66-b533-da0563f89c6c
```

**方式二：URL参数中传递**

```
http://127.0.0.1/seeyon/rest/orgMember/123?token=013a2a1e-a0b0-4f66-b533-da0563f89c6c
```

### 7. 注意事项

- 所有REST调用必须传递Token
- Token生命周期为15分钟，超时未调用将失效
- 失效后调用返回401错误："Invalid token,please authenticate again"
- 支持国际化，需要在请求头中增加Accept-Language属性
- 支持内容协商，通过Accept属性指定返回格式（XML/JSON/Text）

### 8. WADL查看

启动服务后，可通过以下地址查看RESTFull web service服务的WADL：

```
http://ip:port/seeyon/rest/application.wadl
```

### 9. Token失效时长

不同版本可能存在差异，以v8.2sp1 20221013版本为例，时长为20分钟。
