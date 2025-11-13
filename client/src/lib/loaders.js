import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

// Helper to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Loader for a single post
export const singlePageLoader = async ({ request, params }) => {
  const { id } = params;

  // Validate the ID before making API request
  if (!isValidObjectId(id)) {
    throw new Response("Invalid post ID", { status: 400 });
  }

  try {
    const res = await apiRequest("/posts/" + id);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch single post:", error);
    throw new Response("Failed to load post", { status: 500 });
  }
};

// Loader for list of posts
export const listPageLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const query = url.search ? url.search : "";

  try {
    const postPromise = apiRequest("/posts" + query);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Response("Failed to load posts", { status: 500 });
  }
};

// Loader for user profile (posts + chats)
export const profilePageLoader = async () => {
  try {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    throw new Response("Failed to load profile", { status: 500 });
  }
};
