using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace CreditLoanApi.Models
{
    public class ApiResult
    {
        public string Status { get; set; }
        public int? Code { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public enum Level
        {
            CREATE,
            READ,
            UPDATE,
            DELETE,
            CREATE_FAILED,
            READ_FAILED,
            UPDATE_FAILED,
            DELETE_FAILED,
            REJECT
        }

        public static ApiResult ResponseAPI(bool success, ApiResult.Level apiType, Object objData = null, string customMessage = "custom message")
        {
            var json = JsonConvert.SerializeObject(objData);
            JObject settings = JObject.Parse(File.ReadAllText(@"apimessage.json"));

            // error on this part : when parsing from linq
            var dictionary = objData != null ? JsonConvert.DeserializeObject<Dictionary<string, object>>(json) : null;
            string resultStatus = success == true ? settings.GetValue("api_output_ok").ToString() : settings.GetValue("api_output_failed").ToString();

            string resultMessage = "default";
            switch (apiType)
            {
                case ApiResult.Level.CREATE:
                    resultMessage = settings.GetValue("save_success").ToString();
                    break;
                case ApiResult.Level.READ:
                    resultMessage = settings.GetValue("data_found").ToString();
                    break;
                case ApiResult.Level.UPDATE:
                    resultMessage = settings.GetValue("update_success").ToString();
                    break;
                case ApiResult.Level.DELETE:
                    resultMessage = settings.GetValue("delete_success").ToString();
                    break;
                case ApiResult.Level.CREATE_FAILED:
                    resultMessage = settings.GetValue("save_not_success").ToString();
                    break;
                case ApiResult.Level.READ_FAILED:
                    resultMessage = settings.GetValue("data_not_found").ToString();
                    break;
                case ApiResult.Level.UPDATE_FAILED:
                    resultMessage = settings.GetValue("update_not_success").ToString();
                    break;
                case ApiResult.Level.DELETE_FAILED:
                    resultMessage = settings.GetValue("delete_not_success").ToString();
                    break;
                case ApiResult.Level.REJECT:
                    resultMessage = settings.GetValue("workflow_reject").ToString();
                    break;
                default:
                    resultMessage = "no value given";
                    break;
            }

            ApiResult result = new ApiResult()
            {
                Status = resultStatus,
                Message = resultMessage,
                Data = dictionary
            };

            return result;
        }

        public static ApiResult ResponseCommon(bool success, ApiResult.Level apiType, Object objData = null, string customMessage = "custom message")
        {
            JObject settings = JObject.Parse(File.ReadAllText(@"apimessage.json"));
            string resultStatus = success == true ? settings.GetValue("api_output_ok").ToString() : settings.GetValue("api_output_failed").ToString();

            string resultMessage = ReadMessageSetting(apiType, settings);

            ApiResult result = new ApiResult()
            {
                Status = resultStatus,
                Message = resultMessage,
                Data = objData
            };

            return result;
        }

        public static ApiResult response(string statusMessage, string customMessage = "custom message", Object data = null)
        {
            ApiResult result = new ApiResult()
            {
                Status = statusMessage,
                Message = customMessage,
                Data = data
            };

            return result;
        }

        public static ApiResult success(int code, string customMessage, Object data = null)
        {
            ApiResult result = new ApiResult()
            {
                Status = "success",
                Code = code,
                Message = customMessage,
                Data = data
            };

            return result;
        }
        public static ApiResult failed(int code, string customMessage, Object data = null)
        {
            ApiResult result = new ApiResult()
            {
                Status = "failed",
                Code = code,
                Message = customMessage,
                Data = data
            };

            return result;
        }


        private static string ReadMessageSetting(ApiResult.Level apiType, JObject settings)
        {
            string resultMessage = "default";
            switch (apiType)
            {
                case ApiResult.Level.CREATE:
                    resultMessage = settings.GetValue("save_success").ToString();
                    break;
                case ApiResult.Level.READ:
                    resultMessage = settings.GetValue("data_found").ToString();
                    break;
                case ApiResult.Level.UPDATE:
                    resultMessage = settings.GetValue("update_success").ToString();
                    break;
                case ApiResult.Level.DELETE:
                    resultMessage = settings.GetValue("delete_success").ToString();
                    break;
                case ApiResult.Level.CREATE_FAILED:
                    resultMessage = settings.GetValue("save_not_success").ToString();
                    break;
                case ApiResult.Level.READ_FAILED:
                    resultMessage = settings.GetValue("data_not_found").ToString();
                    break;
                case ApiResult.Level.UPDATE_FAILED:
                    resultMessage = settings.GetValue("update_not_success").ToString();
                    break;
                case ApiResult.Level.DELETE_FAILED:
                    resultMessage = settings.GetValue("delete_not_success").ToString();
                    break;
                case ApiResult.Level.REJECT:
                    resultMessage = settings.GetValue("workflow_reject").ToString();
                    break;
                default:
                    resultMessage = "no value given";
                    break;
            }
            return resultMessage;

        }

    }
}
