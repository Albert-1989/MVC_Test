namespace MVC_Test.Interface
{
    public interface ISample
    {
        int Id { get; }
    }

    public interface ISingleton : ISample
    { }

    public interface IScoped : ISample
    { }

    public interface ITransient : ISample
    { }

    //public interface IHomeService
    //{ }

}
