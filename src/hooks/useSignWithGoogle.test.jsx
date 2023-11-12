import { useNavigate } from "react-router-dom";

import { renderHook, act } from "@testing-library/react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import useSignInWithGoogle from "./useSignInWithGoogle";
import useStore from "../../src/useStore";

import { CONFIG } from "../constants/config";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../useStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
  }),
);

describe("useSignInWithGoogle", () => {
  const mockUser = {
    user: {
      email: "test@example.com",
      photoURL: "http://example.com/photo.jpg",
    },
  };

  const mockSetUser = jest.fn();
  const mockNavigate = jest.fn();

  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  let result;

  beforeEach(() => {
    useStore.mockReturnValue({ setUser: mockSetUser });
    useNavigate.mockReturnValue(mockNavigate);
    signInWithPopup.mockResolvedValue(mockUser);

    const hook = renderHook(() => useSignInWithGoogle());
    result = hook.result;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully sign in with Google and navigates to /create", async () => {
    await act(async () => {
      await result.current();
    });

    expect(fetch).toHaveBeenCalledWith(`${CONFIG.BACKEND_SERVER_URL}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: mockUser.user.email }),
    });
    expect(signInWithPopup).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith({
      email: mockUser.user.email,
      photoURL: mockUser.user.photoURL,
    });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });

  test("should navigate to /create after successful sign in", async () => {
    await act(async () => {
      await result.current();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/create");
  });

  test("should handle errors during the sign-in process and logs the error", async () => {
    const error = new Error("Sign-in failed");
    signInWithPopup.mockRejectedValue(error);

    await act(async () => {
      await result.current();
    });

    expect(signInWithPopup).toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("에러 발생", error);

    consoleSpy.mockRestore();
  });
});
