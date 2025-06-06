// Types
import { RequestProps } from "./types";
import axios, { AxiosResponse } from "axios";

// Config
import { API_URL } from "@/config/api";
import { getFarcasterToken } from "@/shared/utils/auth";

/**
 * Default headers for the requests.
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Asynchronously sends a request to the server.
 * @param path The endpoint path to which the request is sent.
 * @param props The configuration options for the request, including method, headers, and body.
 * @returns A promise that resolves with the server's response.
 * @template T The expected type of the response data.
 */
export async function request<T>(
  path: string,
  {
    method,
    baseUrl = null,
    body = undefined,
    params = null,
    headers = {},
  }: RequestProps
): Promise<T> {
  console.log(`🚀 Making ${method} request to ${path}`);
  console.log("THE BODY IS", body);

  const url = baseUrl ?? API_URL;
  const fullUrl = new URL(`${url}${path}`);

  if (params) {
    console.log("Adding query params:", params);
    Object.keys(params).forEach((key) =>
      fullUrl.searchParams.append(key, params[key])
    );
  }

  // Get the Farcaster token
  const farcasterToken = getFarcasterToken();
  console.log("Farcaster token present:", !!farcasterToken);

  const config: RequestInit = {
    method: method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
      // Add the Farcaster token if it exists
      ...(farcasterToken && { Authorization: `Bearer ${farcasterToken}` }),
    },
    credentials: "include",
    ...(body && {
      body: JSON.stringify(body),
    }),
  };

  console.log("Request config:", {
    url: fullUrl.toString(),
    method: config.method,
    headers: config.headers,
    hasBody: !!config.body,
    body: config.body,
  });

  try {
    console.log("Sending request...");
    const response = await fetch(fullUrl.toString(), config);

    if (!response.ok) {
      console.error("Request failed:", response.status, response.statusText);
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("Request successful, parsing response...");
    const data: T = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Request error:", error);

    throw error;
  }
}

/**
 * Function to send a POST request with file data to the server.
 * @param {string} path - The path of the request.
 * @param {T} formData - The form data to be sent in the request.
 * @returns {Promise<R>} - The response from the server.
 */
export async function requestWithFile<T, R>(
  method: RequestProps["method"],
  path: string,
  formData: T
): Promise<R> {
  const { data: response }: AxiosResponse<{ data: R }> = await axios({
    method,
    url: API_URL + path,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return response.data;
}

/**
 * Function to download a buffer from the server using Axios.
 * @param {string} path - The path of the request.
 * @param {RequestProps} props - The properties of the request including method, baseUrl, and headers.
 * @returns {Promise<ArrayBuffer>} - The response from the server as an ArrayBuffer.
 */
export async function downloadBuffer(
  path: string,
  { method, baseUrl = null, headers = {} }: RequestProps
): Promise<{ file: ArrayBuffer; type: string }> {
  const url = baseUrl ?? API_URL;
  const fullUrl = `${url}${path}`;

  try {
    const response = await axios({
      method: method,
      url: fullUrl,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      responseType: "arraybuffer",
      withCredentials: true,
    });

    const contentType = response.headers["content-type"];

    return {
      file: response.data,
      type: contentType,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 500) {
        throw new Error(error.response.statusText);
      }
      throw new Error(
        `Request failed with status code: ${error.response.status}`
      );
    } else {
      throw error;
    }
  }
}
