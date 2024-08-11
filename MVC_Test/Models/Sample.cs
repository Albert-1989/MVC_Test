using MVC_Test.Interfaces;

namespace MVC_Test.Models
{
    public class Sample : ISingleton, IScoped, ITransient
    {
        private static int _count;
        private int _id;

        public Sample()
        {
            this._id = ++_count;
        }

        public int Id => _id;
    }


    public class ObjReturn
    {
        public ISingleton? Singleton { get; set; }
        public IScoped? Scoped { get; set; }
        public ITransient? Transient { get; set; }
    }


}
