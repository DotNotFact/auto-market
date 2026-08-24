namespace AutoMarket.DTOs.Request;

public class CreateModelRequest
{
    public required string Name { get; set; }
    public int ReleaseYear { get; set; }

    public Guid MakerId { get; set; }
}
