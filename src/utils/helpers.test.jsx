import {
  createNewRoom,
  deleteRoom,
  fetchUserRooms,
  uploadImageToServer,
} from "./helpers";

import { CONFIG } from "../constants/config";

global.fetch = jest.fn();

const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  fetch.mockClear();
});

describe("API functions", () => {
  const mockUser = {
    email: "test@example.com",
  };

  test("should send correct request and handle response", async () => {
    const text_id = "123";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ data: { room: { textId: text_id } } }),
    });

    await createNewRoom(text_id, mockUser);

    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.BACKEND_SERVER_URL}/users/${mockUser.email}/createRoom`,
      expect.any(Object),
    );
  });

  test("should send correct DELETE request", async () => {
    const roomId = "123";
    await deleteRoom(roomId, mockUser.email);

    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.BACKEND_SERVER_URL}/users/${mockUser.email}/deleteRooms/${roomId}`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  test("should fetch and process rooms correctly", async () => {
    const mockRooms = [{ id: "1", name: "Room1" }];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockRooms),
    });

    const setRooms = jest.fn();
    await fetchUserRooms(mockUser, setRooms);

    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.BACKEND_SERVER_URL}/users/${mockUser.email}/getRooms`,
    );
    expect(setRooms).toHaveBeenCalledWith(mockRooms);
  });

  test("should send correct request", async () => {
    const base64String = "base64TestString";
    await uploadImageToServer(base64String, mockUser);

    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.BACKEND_SERVER_URL}/users/${mockUser.email}/upload`,
      expect.any(Object),
    );
  });
});
