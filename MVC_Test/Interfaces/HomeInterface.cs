namespace MVC_Test.Interfaces
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


}
