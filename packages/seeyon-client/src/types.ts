/**
 * 客户端配置
 */
export interface SeeyonConfig {
  /** REST 账号用户名 */
  username: string;
  /** REST 账号密码 */
  password: string;
  /** API 基础地址 */
  baseURL?: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retry?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** 模拟登录的用户名 */
  loginName?: string;
  /** 用户ID */
  memberId?: string;
  /** 用户编码 */
  memberCode?: string;
  /** 终端类型 */
  userAgentFrom?: string;
}

/**
 * 标准API响应格式
 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message?: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  /** 访问令牌 */
  id: string;
  /** 绑定用户信息 */
  bindingUser?: string;
  /** 用户名 */
  userName?: string;
}

/**
 * 更新表单数据缓存参数
 */
export interface UpdateCacheFormDataParams {
  /** 主表数据ID */
  formMasterDataId: string;
  /** 表单ID */
  formId: string;
  /** 需要更新的字段名 */
  fieldName: string;
  /** 重复表数据ID */
  formRecordId?: string;
  /** 重复表名 */
  formSonTableName?: string;
  /** 主从表的值 */
  mergeData: Record<string, unknown>;
}

/**
 * 无流程批量操作参数
 */
export interface BatchOperationParams {
  /** 表单编号 */
  formCode: string;
  /** 登录名 */
  loginName: string;
  /** 权限ID */
  rightId: string;
  /** 是否执行触发 */
  doTrigger?: boolean;
  /** 更新用的唯一标识 */
  uniqueFiled?: string[];
  /** 数据列表 */
  dataList: FormDataItem[];
}

/**
 * 无流程批量删除参数
 */
export interface BatchDeleteParams {
  /** 表单编号 */
  formCode: string;
  /** 登录名 */
  loginName: string;
  /** 要删除的数据ID列表 */
  idList: string[];
}

/**
 * 无流程批量导出参数
 */
export interface ExportDataParams {
  /** 表单模板代码 */
  templateCode: string;
  /** 权限ID */
  rightId: string;
  /** 开始时间 */
  beginDateTime: string;
  /** 结束时间 */
  endDateTime: string;
  /** 数据ID */
  dataId?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 表单字段值
 */
export interface FormFieldValue {
  /** 字段值 */
  value: string | number;
  /** 显示值 */
  showValue?: string;
}

/**
 * 表单数据源
 */
export interface FormDataSource {
  /** 主表数据，键为表单字段名 */
  [formTableName: string]: Record<string, unknown> | undefined;
}

/**
 * 表单记录
 */
export interface FormRecord {
  /** 数据ID */
  id: number;
  /** 字段值 */
  fields: FormField[];
}

/**
 * 表单字段
 */
export interface FormField {
  /** 字段名称 */
  name: string;
  /** 字段值 */
  value: string;
  /** 显示值 */
  showValue: string;
}

/**
 * 主表数据
 */
export interface MasterTable {
  /** 数据库表名称 */
  name: string;
  /** 记录的数据 */
  record: FormRecord;
  /** 需要计算的字段 */
  changedFields?: string[];
}

/**
 * 明细表数据
 */
export interface SubTable {
  /** 数据库表名称 */
  name: string;
  /** 包含的所有数据 */
  records: FormRecord[];
  /** 需要计算的字段 */
  changedFields?: string[];
}

/**
 * 表单数据项
 */
export interface FormDataItem {
  /** 主表数据 */
  masterTable: MasterTable;
  /** 明细表数据 */
  subTables?: SubTable[];
  /** 表单附件 */
  attachmentInfos?: AttachmentInfo[];
}

/**
 * 附件信息
 */
export interface AttachmentInfo {
  /** 对应附件字段的值 */
  subReference: string;
  /** 上传的附件ID */
  fileUrl: string;
  /** 附件排序 */
  sort: number;
}

/**
 * 流程发起参数
 */
export interface ProcessStartParams {
  /** 应用类型 */
  appName: string;
  /** 流程数据 */
  data: ProcessStartData;
}

/**
 * 流程发起数据
 */
export interface ProcessStartData {
  /** 模板编号 */
  templateCode: string;
  /** 是否为待发：0:新建-发送；1:新建-保存待发 */
  draft: string;
  /** 表单数据 */
  data?: FormDataSource;
  /** 协同标题区附件 */
  attachments?: number[];
  /** 协同公文的id */
  relateDoc?: string;
  /** 协同标题 */
  subject?: string;
  /** 是否使用新的表单数据格式 */
  useNewDataStructure?: boolean;
  /** 是否执行触发 */
  doTrigger?: boolean;
  /** CAP4附件参数 */
  thirdAttachments?: AttachmentInfo[];
  /** 参与计算的字段 */
  changedFields?: Record<string, string[]>;
}

/**
 * 流程发起响应
 */
export interface ProcessStartResponse {
  /** 流程ID */
  processId: string;
  /** 协同ID */
  summaryId: string;
  /** 事项ID */
  affairId: string;
  /** 协同标题 */
  subject: string;
  /** 工作项列表 */
  workitems: WorkItem[];
  /** 错误信息 */
  errorMsg: string;
}

/**
 * 过时的流程发起参数（V61update）
 */
export interface LegacyProcessStartParams {
  /** 发起者的登录名 */
  senderLoginName: string;
  /** 协同的标题 */
  subject: string;
  /** 表单数据 */
  data: string | Record<string, unknown>;
  /** 附件 */
  attachments?: number[];
  /** 控制是否流程发送 */
  param?: string;
  /** data格式 */
  transfertype?: "xml" | "json";
  /** 表单附件 */
  formContentAtt?: AttachmentInfo[];
  /** 发起人单位编码 */
  accountCode?: string;
}

/**
 * 工作项
 */
export interface WorkItem {
  /** 节点名称 */
  nodeName: string;
  /** 登录名 */
  userLoginName: string;
  /** 工作项ID */
  id: string;
  /** 用户名 */
  userName: string;
  /** 节点ID */
  nodeId: string;
  /** 用户ID */
  userId: string;
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse {
  /** 成功的数据ID列表 */
  successIdList: string[];
  /** 失败的数据ID及原因 */
  failedData: Record<string, string>;
  /** 成功数量 */
  successCount: number;
  /** 失败数量 */
  failedCount: number;
}

/**
 * 导出数据响应
 */
export interface ExportDataResponse {
  /** 表单定义 */
  definition: FormDefinition;
  /** 数据列表 */
  data: ExportDataItem[];
}

/**
 * 表单定义
 */
export interface FormDefinition {
  /** 表单信息 */
  form: FormInfo;
  /** 字段定义 */
  fields: FieldDefinition[];
}

/**
 * 表单信息
 */
export interface FormInfo {
  /** 表单ID */
  formId: string;
  /** 表单名称 */
  formName: string;
}

/**
 * 字段定义
 */
export interface FieldDefinition {
  /** 字段名称 */
  name: string;
  /** 字段显示名称 */
  display: string;
  /** 字段类型 */
  fieldType: string;
  /** 输入框类型 */
  inputType: string;
  /** 格式化信息 */
  formatType: string;
  /** 字段长度 */
  fieldLength: string;
  /** 小数位长度 */
  digitNum: string;
  /** 枚举ID */
  enumId: string;
  /** 是否必填 */
  isNotNull: string;
  /** 权限 */
  auth: string;
}

/**
 * 导出数据项
 */
export interface ExportDataItem {
  /** 主表数据 */
  masterData: Record<string, FormFieldValue>;
  /** 明细表数据 */
  subData: Record<string, FormFieldValue[]>;
}

/**
 * 表单截图参数
 */
export interface FormCaptureParams {
  /** 权限id */
  rightId: string;
  /** 对应流程表中的summaryId */
  moduleId: string;
  /** cap无流程表单：42；协同表单：1 */
  moduleType: number;
  /** 渲染类型，两种选项：base64,pdf */
  renderType: "base64" | "pdf";
  /** 请求参数 */
  requestParams: FormCaptureRequestParams;
}

/**
 * 表单截图请求参数
 */
export interface FormCaptureRequestParams {
  /** 服务器名称 */
  serverName: string;
  /** 服务器端口 */
  serverPort: string;
  /** 协议类型 */
  scheme: "http" | "https";
  /** 上下文路径 */
  contextPath: string;
}

/**
 * 表单截图响应
 */
export interface FormCaptureResponse {
  /** base64编码的图片或pdf下载路径 */
  result: string;
}
