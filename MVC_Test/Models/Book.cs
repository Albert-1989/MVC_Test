using System.ComponentModel.DataAnnotations;

namespace MVC_Test.Models
{
    public class Book
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime PublishDate { get; set; }
    }
}
