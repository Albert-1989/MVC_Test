using MVC_Test.Interface;

namespace MVC_Test.Service
{

    public class HomeService 
    {
        public ISingleton _Singleton { get; private set; }
        public IScoped _Scoped { get; private set; }
        public ITransient _Transient { get; private set; }

        public HomeService(ISingleton singleton, IScoped scoped, ITransient transient)
        {
            _Singleton = singleton;
            _Scoped = scoped;
            _Transient = transient;
        }



    }
}
