using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_Test.Interfaces;
using MVC_Test.Models;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Numerics;
using System.Xml.Linq;




namespace MVC_Test.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        public readonly ISingleton? _Singleton;
        public readonly IScoped? _Scoped;
        public readonly ITransient? _Transient;

        private readonly IConfiguration _configuration;
        private readonly IOptions<DemoUserOption> _info;

        public HomeController(
            ILogger<HomeController> logger, ISingleton singleton, 
            IScoped scoped, ITransient transient, IConfiguration configuration, 
            IOptions<DemoUserOption> info
            )
        {
            _logger = logger;
            _Singleton = singleton;
            _Scoped = scoped;
            _Transient = transient;
            _configuration = configuration;
            _info = info;
        }

        public IActionResult Index()
        {
            ObjReturn DIObj = new()
            {
                Singleton = _Singleton,
                Scoped = _Scoped,
                Transient = _Transient
            };

            //又一種寫法
            var builder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json");
            var config = builder.Build();


            var DemoUser = _configuration.GetSection("DemoUser");
            var PhoneNumber = DemoUser.GetSection("PhoneNumber");
            var DemoUrl = _configuration.GetSection("DemoUrl");

            var Config = new
            {
                Name = DemoUser.GetValue<string>("Name"),
                PhoneNumber = new
                {
                    Tel = PhoneNumber.GetValue<string>("Tel"),
                    Phone = PhoneNumber.GetValue<string>("Phone")
                },
                Address = DemoUser.GetValue<string>("Address"),
                Email = DemoUser.GetValue<string>("Email"),
                Age = DemoUser.GetValue<Int32>("Age"),
                IsActive = DemoUser.GetValue<bool>("IsActive"),

                //寫法2
                DemoUser = _info.Value,

                //寫法3
                DemoUser2 = new {
                    Name = config["DemoUser:Name"],
                    PhoneNumber = new {
                        Tel = config["DemoUser:PhoneNumber:Tel"],
                        Phone = config["DemoUser:PhoneNumber:Phone"]
                    }
                }
            };
            var JsonObj = JsonConvert.SerializeObject(Config);

            ViewData["DemoUser"] = JsonObj;
            ViewData["ConfigValue"] = _configuration.GetValue<string>("ConfigValue");
            ViewData["GoogleUrl"] = DemoUrl.GetValue<string>("Google");

            return View(DIObj);

        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        /// <summary>
        /// 取 Member 資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetMemberData()
        {
            ExecResult<Member> result = new()
            {
                Msg = "OK"
            };


            string connStr = _configuration.GetValue<string>("MyDataBase");
            string SQLCmd = "Select * From [Member]With(NoLock)";

            try
            {
                SqlConnection conn = new SqlConnection(connStr);
                var DataResult = await conn.QueryAsync<Member>(SQLCmd, null);
                result.Datas = DataResult.ToList();
                conn.Close();
            }
            catch (Exception ex)
            {
                result.Msg = ex.Message;
            }


            return Json(result);
        }


        /// <summary>
        /// 編輯 Member 資料
        /// </summary>
        /// <param name="EditData">編輯的資料</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> EditMemberData([FromBody] EditData<Member> EditData)
        {

            ExecResult<Member> result = new()
            {
                Msg = "OK"
            };


            string connStr = _configuration.GetValue<string>("MyDataBase");
            string SQLCmd = "";

            if (EditData.OPType == "新增")
            {
                SQLCmd = "Insert Into Member Select NEWID(), @Name, @Phone, @Tel, @Gender, @Birthday ;";
            }
            else if (EditData.OPType == "修改")
            {
                SQLCmd =
                    "Update Member Set Name = @Name, Phone = @Phone, Tel = @Tel, " +
                    "Gender = @Gender, Birthday = @Birthday " +
                    "Where Id = @ID ;";
            }
            else if (EditData.OPType == "刪除")
            {
                SQLCmd = "Delete Member Where Id = @ID ";
            }


            try
            {
                SqlConnection conn = new SqlConnection(connStr);
                var DataResult = await conn.ExecuteAsync(SQLCmd, EditData.Param);
                conn.Close();
            }
            catch (Exception ex)
            {
                result.Msg = ex.Message;
            }

            return Json(result);
        }



    }
}
