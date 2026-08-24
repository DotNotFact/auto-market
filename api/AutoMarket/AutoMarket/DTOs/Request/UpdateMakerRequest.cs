namespace AutoMarket.DTOs.Request;

public class UpdateMakerRequest
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    public required string Country { get; set; }
    public int FoundedYear { get; set; }
}
