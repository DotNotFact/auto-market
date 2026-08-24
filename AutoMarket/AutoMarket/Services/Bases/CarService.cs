using AutoMarket.Repositories.Abstracts;
using AutoMarket.Services.Abstracts;
using AutoMarket.DTOs.Response;
using AutoMarket.DTOs.Request;
using AutoMarket.Entities;

namespace AutoMarket.Services.Bases;

public class CarService(IRepository<MakerEntity> makersRepository, IRepository<ModelEntity> modelRepository) : ICarService
{
    private readonly IRepository<MakerEntity> _makersRepository = makersRepository;
    private readonly IRepository<ModelEntity> _modelRepository = modelRepository;

    #region [ Maker ]

    public async Task<IEnumerable<MakerResponse>> GetAllMakersAsync()
    {
        var makers = await _makersRepository.GetAllAsync();
        return makers.Select(ToResponse);
    }

    public async Task<MakerResponse?> GetMakerByIdAsync(Guid id)
    {
        var maker = await _makersRepository.GetByIdAsync(id);
        return maker is null ? null : ToResponse(maker);
    }

    public async Task<MakerResponse> AddMakerAsync(CreateMakerRequest request)
    {
        var maker = new MakerEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Country = request.Country,
            FoundedYear = request.FoundedYear,
        };

        await _makersRepository.AddAsync(maker);
        return ToResponse(maker);
    }

    public async Task UpdateMakerAsync(UpdateMakerRequest request)
    {
        var maker = new MakerEntity
        {
            Id = request.Id,
            Name = request.Name,
            Country = request.Country,
            FoundedYear = request.FoundedYear,
        };

        await _makersRepository.UpdateAsync(maker);
    }

    public async Task DeleteMakerAsync(Guid id)
    {
        await _makersRepository.DeleteAsync(id);
    }

    private static MakerResponse ToResponse(MakerEntity maker) => new()
    {
        Id = maker.Id,
        Name = maker.Name,
        Country = maker.Country,
        FoundedYear = maker.FoundedYear,
        Models = maker.Models.Select(ToResponse).ToList(),
    };

    #endregion

    #region [ Model ]

    public async Task<ModelResponse?> GetModelByIdAsync(Guid id)
    {
        var model = await _modelRepository.GetByIdAsync(id);
        return model is null ? null : ToResponse(model);
    }

    public async Task UpdateModelAsync(UpdateModelRequest request)
    {
        var model = new ModelEntity
        {
            Id = request.Id,
            Name = request.Name,
            ReleaseYear = request.ReleaseYear,
            MakerId = request.MakerId,
        };

        await _modelRepository.UpdateAsync(model);
    }

    public async Task<ModelResponse> AddModelAsync(CreateModelRequest request)
    {
        var model = new ModelEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            ReleaseYear = request.ReleaseYear,
            MakerId = request.MakerId,
        };

        await _modelRepository.AddAsync(model);
        return ToResponse(model);
    }

    public async Task DeleteModelAsync(Guid id)
    {
        await _modelRepository.DeleteAsync(id);
    }

    private static ModelResponse ToResponse(ModelEntity model) => new()
    {
        Id = model.Id,
        Name = model.Name,
        ReleaseYear = model.ReleaseYear,
        MakerId = model.MakerId,
    };

    #endregion
}
