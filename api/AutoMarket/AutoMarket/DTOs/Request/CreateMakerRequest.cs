namespace AutoMarket.DTOs.Request;

public class CreateMakerRequest
{
    public required string Name { get; set; }
    public required string Country { get; set; }
    public int FoundedYear { get; set; }
}
