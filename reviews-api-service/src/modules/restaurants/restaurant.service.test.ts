import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import CustomError from "../../types/customError";
import { RestaurantModel } from "./restaurant.model";
import { RestaurantService } from "./restaurant.service";

jest.mock("./restaurant.model", () => ({
  RestaurantModel: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedRestaurantModel = RestaurantModel as jest.Mocked<typeof RestaurantModel>;

describe("RestaurantService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return all restaurants", async () => {
      mockedRestaurantModel.findAll.mockResolvedValue([{ id: "1", name: "Test" }] as any);

      const result = await RestaurantService.list();

      expect(result).toEqual([{ id: "1", name: "Test" }]);
    });
  });

  describe("create", () => {
    it("should create a restaurant", async () => {
      mockedRestaurantModel.findByName.mockResolvedValue(null);
      mockedRestaurantModel.create.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const result = await RestaurantService.create({ name: "Cafe" });

      expect(result).toEqual({ id: "1", name: "Cafe" });
      expect(mockedRestaurantModel.create).toHaveBeenCalledWith({ name: "Cafe" });
    });

    it("should throw if restaurant already exists", async () => {
      mockedRestaurantModel.findByName.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      await expect(RestaurantService.create({ name: "Cafe" })).rejects.toThrow(CustomError);
      expect(mockedRestaurantModel.create).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return a restaurant by id", async () => {
      mockedRestaurantModel.findById.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const result = await RestaurantService.getById({ id: "1" });

      expect(result).toEqual({ id: "1", name: "Cafe" });
    });

    it("should throw if restaurant not found", async () => {
      mockedRestaurantModel.findById.mockResolvedValue(null);

      await expect(RestaurantService.getById({ id: "1" })).rejects.toThrow(CustomError);
    });
  });

  describe("update", () => {
    it("should update a restaurant", async () => {
      mockedRestaurantModel.findById.mockResolvedValue({ id: "1", name: "Cafe" } as any);
      mockedRestaurantModel.findByName.mockResolvedValue(null);
      mockedRestaurantModel.update.mockResolvedValue({ id: "1", name: "New Cafe" } as any);

      const result = await RestaurantService.update({ id: "1", name: "New Cafe" });

      expect(result).toEqual({ id: "1", name: "New Cafe" });
      expect(mockedRestaurantModel.update).toHaveBeenCalledWith("1", { name: "New Cafe" });
    });

    it("should throw if restaurant not found", async () => {
      mockedRestaurantModel.findById.mockResolvedValue(null);

      await expect(RestaurantService.update({ id: "1", name: "New Cafe" })).rejects.toThrow(
        CustomError,
      );
    });

    it("should throw if another restaurant already uses the name", async () => {
      mockedRestaurantModel.findById.mockResolvedValue({ id: "1", name: "Cafe" } as any);
      mockedRestaurantModel.findByName.mockResolvedValue({ id: "2", name: "New Cafe" } as any);

      await expect(RestaurantService.update({ id: "1", name: "New Cafe" })).rejects.toThrow(
        CustomError,
      );
      expect(mockedRestaurantModel.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should delete a restaurant", async () => {
      mockedRestaurantModel.findById.mockResolvedValue({ id: "1", name: "Cafe" } as any);
      mockedRestaurantModel.delete.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const result = await RestaurantService.remove({ id: "1" });

      expect(result).toEqual({ id: "1", name: "Cafe" });
      expect(mockedRestaurantModel.delete).toHaveBeenCalledWith("1");
    });

    it("should throw if restaurant not found", async () => {
      mockedRestaurantModel.findById.mockResolvedValue(null);

      await expect(RestaurantService.remove({ id: "1" })).rejects.toThrow(CustomError);
    });
  });
});