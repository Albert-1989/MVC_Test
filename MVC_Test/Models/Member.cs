namespace MVC_Test.Models
{
    public class ExecResult<T>
    {
        public string Msg { get; set; } = "";

        public List<T>? Datas { get; set; }
    }

    public class EditData<T>
    {
        public string OPType { get; set; } = "";

        public T? Param { get; set; }
    }



    public class Member
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Tel { get; set; }
        public string Gender { get; set; }
        public DateTime Birthday { get; set; }

    }
}
