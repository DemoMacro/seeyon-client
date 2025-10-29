import type { SeeyonClient } from "../client";
import type {
  ApiResponse,
  BatchOperationParams,
  BatchDeleteParams,
  ExportDataParams,
  ProcessStartParams,
  ProcessStartResponse,
  UpdateCacheFormDataParams,
  BatchOperationResponse,
  ExportDataResponse,
  FormCaptureParams,
  FormCaptureResponse,
  LegacyProcessStartParams,
} from "../types";

/**
 * CAP4 资源类
 */
export class Cap4Resource {
  constructor(private client: SeeyonClient) {}

  /**
   * 发起表单流程
   */
  async startProcess(
    params: ProcessStartParams,
  ): Promise<ApiResponse<ProcessStartResponse>> {
    return this.client.request<ApiResponse<ProcessStartResponse>>(
      "/bpm/process/start",
      { method: "POST", body: params },
    );
  }

  /**
   * 更新表单数据缓存
   */
  async updateCacheFormData(
    params: UpdateCacheFormDataParams,
  ): Promise<ApiResponse<void>> {
    return this.client.request<ApiResponse<void>>(
      "/cap4/form/api/updateCacheFormData",
      { method: "POST", body: params },
    );
  }

  /**
   * 无流程批量添加表单数据
   */
  async batchAdd(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>> {
    return this.client.request<ApiResponse<BatchOperationResponse>>(
      "/cap4/form/soap/batch-add",
      { method: "POST", body: params },
    );
  }

  /**
   * 无流程批量更新表单数据
   */
  async batchUpdate(
    params: BatchOperationParams,
  ): Promise<ApiResponse<BatchOperationResponse>> {
    return this.client.request<ApiResponse<BatchOperationResponse>>(
      "/cap4/form/soap/batch-update",
      { method: "POST", body: params },
    );
  }

  /**
   * 无流程批量删除表单数据
   */
  async batchDelete(
    params: BatchDeleteParams,
  ): Promise<ApiResponse<BatchOperationResponse>> {
    return this.client.request<ApiResponse<BatchOperationResponse>>(
      "/cap4/form/soap/batch-delete",
      { method: "POST", body: params },
    );
  }

  /**
   * 无流程批量导出数据
   */
  async exportData(
    params: ExportDataParams,
  ): Promise<ApiResponse<ExportDataResponse>> {
    return this.client.request<ApiResponse<ExportDataResponse>>(
      "/cap4/form/soap/export",
      { method: "POST", body: params },
    );
  }

  /**
   * 表单截图
   */
  async formCapture(params: FormCaptureParams): Promise<FormCaptureResponse> {
    return this.client.request<FormCaptureResponse>("/cap4/form/api/capture", {
      method: "POST",
      body: params,
    });
  }

  /**
   * 过时的流程发起接口（V61update）
   * @deprecated 请使用 startProcess 方法
   */
  async startLegacyProcess(
    templateCode: string,
    params: LegacyProcessStartParams,
  ): Promise<string> {
    return this.client.request<string>(`/flow/${templateCode}`, {
      method: "POST",
      body: params,
    });
  }
}
