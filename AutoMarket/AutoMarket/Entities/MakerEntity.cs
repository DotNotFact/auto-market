namespace AutoMarket.Entities;

public class MakerEntity
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    public required string Country { get; set; }
    public int FoundedYear { get; set; }

    public ICollection<ModelEntity> Models { get; set; } = [];
}
