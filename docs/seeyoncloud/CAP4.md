# CAP4表单应用接口

## 获取参数rightId步骤

rightId组成是viewId和authId，格式为：viewId.authId

### 1. 获取表单ID

通过系统找到表单ID。

### 2. 查询数据库获取viewId

```sql
select * from cap_form_view_info where FORM_ID=:formId
```

一条表示pc端，一条表示移动端，选pc的view_id。

### 3. 查询数据库获取authId

**高版本方式：**

```sql
select * from cap_form_auth_info where FORM_ID=:formId;
```

根据想要的权限选择，比如用填写权限。

**低版本方式：**
如果没有cap_form_auth_info表，则查询cap_form_definition，获取view_info字段：

```sql
select view_info from cap_form_definition where id=:formId;
```

获取pc（type为seeyonform）的json对象，根据想要的权限选择id。

### 4. 合并结果得到rightId

示例：

```
rightId："7382243805636937862.739077934791477512";
```

## 更新表单数据缓存

根据传入参数，更新后端表单的数据缓存，在保存表单时会将缓存中的值存入数据库中持久化。

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/cap4/form/api/updateCacheFormData`
- **认证要求：** 请求需要携带token

### 请求参数

| 参数             | 是否必须 | 参数说明                                                                                                  |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| formMasterDataId | 是       | 主表数据ID                                                                                                |
| formId           | 是       | 表单ID                                                                                                    |
| fieldName        | 是       | 需要更新的字段名                                                                                          |
| fromRecordId     | 否       | 重复表数据ID                                                                                              |
| formSonTableName | 否       | 重复表名                                                                                                  |
| mergeData        | 是       | 主从表的值（类型为Map，key为主从表的表名，value为所有字段值的Map，第二层Map的key为字段名，value为字段值） |

### 返回说明

#### 响应结构

| 参数    | 是否必须 | 参数说明       |
| ------- | -------- | -------------- |
| code    | 是       | HTTP请求状态码 |
| data    | 是       | 请求返回数据   |
| message | 是       | 提示信息       |

#### data结构

| 参数    | 是否必须 | 参数说明 |
| ------- | -------- | -------- |
| code    | 是       | 状态码   |
| message | 是       | 提示信息 |

## 发起表单流程

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/bpm/process/start`
- **认证要求：** 请求需要携带token

### 请求参数

#### 主参数

| 参数    | 是否必须 | 说明     |
| ------- | -------- | -------- |
| appName | 是       | 应用类型 |
| data    | 是       | data参数 |

#### data参数

| 参数                | 是否必须 | 说明                                                                              |
| ------------------- | -------- | --------------------------------------------------------------------------------- |
| templateCode        | 是       | 模板编号，参见表单正文流程模板编号                                                |
| draft               | 是       | 是否为待发：0:新建-发送；1:新建-保存待发                                          |
| attachments         | 否       | 协同标题区附件，Long型List，值为附件的Id。Id是附件接口响应结果中fileUrl字段的值。 |
| relateDoc           | 否       | 协同公文的id                                                                      |
| subject             | 否       | 未设置取模板设置的标题                                                            |
| data                | 否       | 表单data参数                                                                      |
| useNewDataStructure | 否       | 是否使用新的表单数据格式                                                          |
| doTrigger           | 否       | 是否执行触发                                                                      |

#### 表单data参数

| 参数             | 是否必须 | 说明                                                                                                  |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| formmainxxx      | 是       | 表单字段数据，json格式：key字段显示名称，value字段值（如果是cap4的附件控件，则value为附件的相关信息） |
| formsonxx1       | 是       | 数组结构，参考主表                                                                                    |
| thirdAttachments | 否       | CAP4附件参数                                                                                          |
| changedFields    | 否       | 参与计算的字段                                                                                        |

#### thirdAttachments参数说明

| 参数         | 是否必须 | 说明                    |
| ------------ | -------- | ----------------------- |
| subReference | 是       | 对应的附件字段的value值 |
| fileUrl      | 是       | 上传的附件ID            |
| sort         | 是       | 附件排序                |

### 请求参数示例

```json
{
  "appName": "collaboration",
  "data": {
    "data": {
      "formmain_0177": {
        "文本1": "测试文本1-111",
        "上传附件1": "3091996204880318295",
        "图片下拉1": "-2767075386175501632"
      },
      "formson_0185": [
        {
          "图片下拉2": "-2767075386175501632",
          "上传附件2": "-6092561120937621142"
        }
      ],
      "thirdAttachments": [
        {
          "subReference": "3091996204880318295",
          "fileUrl": "432641077895385013",
          "sort": 1
        },
        {
          "subReference": "-6092561120937621142",
          "fileUrl": "355134930180197101",
          "sort": 1
        }
      ],
      "changedFields": {
        "formmain_0177": ["选人1", "文本1"],
        "formson_0185": ["选人2"]
      }
    },
    "templateCode": "ABC1111",
    "draft": "0",
    "attachments": [123456, 123457],
    "relateDoc": "col|123,456;doc|321,654",
    "subject": "",
    "useNewDataStructure": false,
    "doTrigger": true
  }
}
```

### 返回数据

```json
{
  "code": 0,
  "data": {
    "workitems": [
      {
        "nodeName": "节点姓名",
        "userLoginName": "loginName",
        "id": "6063271658185834554",
        "userName": "用户姓名",
        "nodeId": "15940211100644",
        "userId": "5647565013925644425"
      }
    ],
    "app_bussiness_data": "{\"affairId\":\"-7826004588359563757\",\"summaryId\":\"2076716881761815485\"}",
    "processId": "5724125432261003059",
    "subject": "aaa1",
    "errorMsg": ""
  },
  "message": ""
}
```

### 返回参数说明

| 参数          | 说明                             |
| ------------- | -------------------------------- |
| code          | 返回码                           |
| nodeName      | 节点名称                         |
| userLoginName | 登录名                           |
| id            | wf_workitem_run.id               |
| userName      | 用户名                           |
| nodeId        | 节点ID（ctp_affair.activity_id） |
| userId        | 人员ID                           |
| affairId      | 事项ID                           |
| summaryId     | 协同ID                           |
| processId     | 流程ID（ctp_affair.process_id）  |
| subject       | 标题                             |

## 无流程的批量添加

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/cap4/form/soap/batch-add`
- **认证要求：** 请求需要携带token

### 请求参数

| 参数        | 类型     | 是否必填 | 说明                                                                         |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------- |
| uniqueFiled | String[] | 否       | 更新用的唯一标识                                                             |
| rightId     | String   | 是       | 使用的操作权限id                                                             |
| dataList    | Object[] | 是       | 导入的数据                                                                   |
| formCode    | String   | 是       | 表名                                                                         |
| loginName   | String   | 是       | 用于登陆的登录名（登录名对应的人员必须有底表操作权限才可以，并不是普通用户） |
| doTrigger   | boolean  | 否       | 是否执行触发                                                                 |

### 请求参数示例

```json
{
  "formCode": "aaa1",
  "loginName": "zhai",
  "rightId": "56195256829429332.-470190193844795028",
  "doTrigger": true,
  "dataList": [
    {
      "masterTable": {
        "name": "formmain_0019",
        "record": {
          "id": 123456789101,
          "fields": [
            {
              "name": "field0001",
              "value": "",
              "showValue": "create"
            },
            {
              "name": "field0002",
              "value": "",
              "showValue": "one"
            }
          ]
        },
        "changedFields": ["field0001", "field0002"]
      },
      "subTables": [
        {
          "name": "formson_0021",
          "records": [
            {
              "id": 123456789101,
              "fields": [
                {
                  "name": "field0005",
                  "value": "",
                  "showValue": "cap"
                }
              ]
            }
          ],
          "changedFields": ["field0005"]
        }
      ]
    }
  ]
}
```

### 返回数据

```json
{
  "code": 0,
  "data": {
    "successIdList": [4035394180072293997],
    "failedData": {},
    "successCount": 1,
    "failedCount": 0
  },
  "message": ""
}
```

## 无流程的批量删除

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/cap4/form/soap/batch-delete`
- **认证要求：** 请求需要携带token

### 请求参数

| 参数      | 类型   | 是否必填 | 说明                                                                          |
| --------- | ------ | -------- | ----------------------------------------------------------------------------- |
| formCode  | String | 是       | 表单编号                                                                      |
| loginName | String | 是       | 用于登陆的登录名 （登录名对应的人员必须有底表操作权限才可以，并不是普通用户） |
| idList    | Long[] | 是       | 要删除的数据id                                                                |

### 请求参数示例

```json
{
  "formCode": "aaa1",
  "loginName": "zhai",
  "idList": [4035394180072293997]
}
```

### 返回数据

```json
{
  "code": 0,
  "data": {
    "successIdList": [4035394180072293997],
    "failedData": {},
    "successCount": 1,
    "failedCount": 0
  },
  "message": ""
}
```

## 无流程的批量更新

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/cap4/form/soap/batch-update`
- **认证要求：** 请求需要携带token

### 请求参数

| 参数        | 类型     | 是否必填 | 说明                                                                          |
| ----------- | -------- | -------- | ----------------------------------------------------------------------------- |
| uniqueFiled | String[] | 否       | 更新用的唯一标识                                                              |
| rightId     | String   | 是       | 使用的操作权限id                                                              |
| dataList    | Object[] | 是       | 导入的数据                                                                    |
| formCode    | String   | 是       | 表名                                                                          |
| loginName   | String   | 是       | 用于登陆的登录名 （登录名对应的人员必须有底表操作权限才可以，并不是普通用户） |
| doTrigger   | boolean  | 否       | 是否执行触发                                                                  |

### 请求参数示例

```json
{
  "formCode": "aaa1",
  "loginName": "zhai",
  "rightId": "56195256829429332.-470190193844795028",
  "doTrigger": true,
  "dataList": [
    {
      "masterTable": {
        "name": "formmain_0019",
        "record": {
          "id": 4035394180072293997,
          "fields": [
            {
              "name": "field0001",
              "value": "",
              "showValue": "create"
            },
            {
              "name": "field0002",
              "value": "",
              "showValue": "one"
            }
          ]
        },
        "changedFields": ["field0001", "field0002"]
      },
      "subTables": [
        {
          "name": "formson_0021",
          "records": [
            {
              "id": 123456789102,
              "fields": [
                {
                  "name": "field0005",
                  "value": "",
                  "showValue": "cap"
                }
              ]
            }
          ],
          "changedFields": ["field0005"]
        }
      ]
    }
  ]
}
```

### 返回数据

```json
{
  "code": 0,
  "data": {
    "successIdList": [4035394180072293997],
    "failedData": {},
    "successCount": 1,
    "failedCount": 0
  },
  "message": ""
}
```

## 无流程批量导出数据

### 接口请求说明

- **HTTP请求方式：** POST
- **接口地址：** `http://ip:port/seeyon/rest/cap4/form/soap/export`
- **认证要求：** 请求需要携带token

### 请求参数

| 参数          | 类型    | 是否必填 | 说明                                 |
| ------------- | ------- | -------- | ------------------------------------ |
| templateCode  | String  | 是       | 表单模版code（与应用绑定中保持一致） |
| beginDateTime | String  | 是       | 导出数据的起始时间                   |
| endDateTime   | String  | 是       | 导出数据的截止创建时间               |
| rightId       | String  | 是       | 权限id                               |
| dataId        | Long    | 否       | 数据id                               |
| page          | Integer | 否       | 分页信息，第几页，不传默认第1页      |
| pageSize      | Integer | 否       | 分页大小，不传默认500条              |

### 请求参数示例

```json
{
  "templateCode": "ABC123",
  "beginDateTime": "2020-06-30",
  "endDateTime": "2020-07-02",
  "rightId": "6009669017095982620.-8527979346162529315"
}
```

### 返回数据

```json
{
  "code": 0,
  "data": {
    "success": 1,
    "code": "200",
    "message": "操作成功!",
    "data": {
      "definition": {
        "form": {
          "formId": "1856567583696046383",
          "formName": "表单名称"
        },
        "fields": [
          {
            "name": "field0001",
            "display": "数字1",
            "fieldType": "DECIMAL",
            "inputType": "text",
            "formatType": "",
            "fieldLength": "20",
            "digitNum": "0",
            "enumId": "0",
            "isNotNull": "0",
            "auth": "browse"
          }
        ]
      },
      "data": [
        {
          "masterData": {
            "field0001": {
              "value": "11",
              "showValue": "11"
            }
          },
          "subData": {}
        }
      ]
    }
  },
  "message": ""
}
```

### 返回参数说明

#### 响应结构

| 参数    | 类型   | 说明         |
| ------- | ------ | ------------ |
| code    | String | HTTP请求code |
| data    | Object | 表单数据     |
| message | String | 提示内容     |

#### data结构

| 参数       | 类型     | 说明     |
| ---------- | -------- | -------- |
| definition | Object   | 定义信息 |
| data       | Object[] | 数据列表 |

#### definition结构

| 参数   | 类型     | 说明     |
| ------ | -------- | -------- |
| form   | Object   | 表单定义 |
| fields | Object[] | 字段定义 |

#### form结构

| 参数     | 类型   | 说明     |
| -------- | ------ | -------- |
| formId   | String | 表单id   |
| formName | String | 表单名称 |

#### fields结构

| 参数        | 类型   | 说明                         |
| ----------- | ------ | ---------------------------- |
| name        | String | 字段名称                     |
| display     | String | 字段显示名称                 |
| fieldType   | String | 字段类型                     |
| inputType   | String | 输入框类型                   |
| formatType  | String | 格式化信息                   |
| fieldLength | String | 字段长度                     |
| digitNum    | String | 小数位长度                   |
| enumId      | String | 枚举id(仅当该字段为枚举类型) |
| isNotNull   | String | 是否必填，1为必填0为否       |
| auth        | String | 权限                         |

#### data—data—data结构

| 参数       | 类型                                     | 说明       |
| ---------- | ---------------------------------------- | ---------- |
| masterData | `Map<String, Object>`                    | 主表数据   |
| subData    | `Map<String, List<Map<String, Object>>>` | 明细表数据 |

#### masterData中Object结构

| 参数      | 类型   | 说明     |
| --------- | ------ | -------- |
| value     | String | 数据库值 |
| showValue | String | 显示值   |

#### subData中Object结构

| 参数      | 类型   | 说明     |
| --------- | ------ | -------- |
| value     | String | 数据库值 |
| showValue | String | 显示值   |
