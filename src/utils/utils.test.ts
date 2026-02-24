import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { getPosts } from "./utils";

// Mock the file system
vi.mock("fs");
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("Not found");
  }),
}));

describe("MDX Utilities", () => {
  const mockMDXContent = `---
title: "Test Post"
publishedAt: "2026-02-24"
summary: "A test post"
image: "/test.jpg"
images:
  - "/image1.jpg"
  - "/image2.jpg"
tag: "testing"
team: []
---

This is the post content.`;

  const mockMDXContentWithTeam = `---
title: "Collaboration Post"
publishedAt: "2026-02-24"
summary: "A post with team"
images: []
team:
  - name: "John Doe"
    role: "Designer"
    avatar: "/john.jpg"
    linkedIn: "https://linkedin.com/in/johndoe"
---

Team post content.`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPosts", () => {
    it("should return empty array when directory is empty", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue([]);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const result = getPosts(["src", "app", "blog", "posts"]);
      expect(result).toEqual([]);
    });

    it("should filter only .mdx files", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue([
        "post1.mdx",
        "post2.mdx",
        "README.md",
        ".DS_Store",
        "folder",
      ] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("post1");
      expect(result[1].slug).toBe("post2");
    });

    it("should extract metadata from frontmatter", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue(["test-post.mdx"] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      expect(result).toHaveLength(1);

      const post = result[0];
      expect(post.metadata.title).toBe("Test Post");
      expect(post.metadata.publishedAt).toBe("2026-02-24");
      expect(post.metadata.summary).toBe("A test post");
      expect(post.metadata.image).toBe("/test.jpg");
      expect(post.metadata.tag).toBe("testing");
    });

    it("should extract images array from frontmatter", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue(["test-post.mdx"] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      const post = result[0];
      expect(post.metadata.images).toEqual(["/image1.jpg", "/image2.jpg"]);
    });

    it("should extract team array from frontmatter", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue(["collab-post.mdx"] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContentWithTeam);

      const result = getPosts(["src", "app", "blog", "posts"]);
      const post = result[0];
      expect(post.metadata.team).toHaveLength(1);
      expect(post.metadata.team[0].name).toBe("John Doe");
      expect(post.metadata.team[0].role).toBe("Designer");
    });

    it("should extract content body separately from frontmatter", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue(["test-post.mdx"] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      const post = result[0];
      expect(post.content).toContain("This is the post content.");
      expect(post.content).not.toContain("title:");
    });

    it("should generate slug from filename without extension", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue([
        "my-first-post.mdx",
        "another-post.mdx",
      ] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      expect(result[0].slug).toBe("my-first-post");
      expect(result[1].slug).toBe("another-post");
    });

    it("should handle default empty arrays for optional metadata", () => {
      const minimalMDX = `---
title: "Minimal Post"
publishedAt: "2026-02-24"
summary: "Minimal"
---

Content here.`;

      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue(["minimal.mdx"] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(minimalMDX);

      const result = getPosts(["src", "app", "blog", "posts"]);
      const post = result[0];
      expect(post.metadata.images).toEqual([]);
      expect(post.metadata.team).toEqual([]);
      expect(post.metadata.image).toBe("");
      // Note: tag defaults to [] when not specified in frontmatter
      expect(post.metadata.tag).toEqual([]);
    });

    it("should throw when directory does not exist", () => {
      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(false);

      expect(() => getPosts(["nonexistent", "path"])).toThrow();
    });

    it("should use custom path array correctly", () => {
      const customPath = ["custom", "content", "posts"];
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue([]);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      getPosts(customPath);

      // Verify the path was constructed correctly
      expect(mockExistsSync).toHaveBeenCalled();
      expect(mockReaddirSync).toHaveBeenCalled();
    });

    it("should return multiple posts with all metadata intact", () => {
      const mockReaddirSync = vi.mocked(fs.readdirSync);
      mockReaddirSync.mockReturnValue([
        "post1.mdx",
        "post2.mdx",
        "post3.mdx",
      ] as any);

      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const mockReadFileSync = vi.mocked(fs.readFileSync);
      mockReadFileSync.mockReturnValue(mockMDXContent);

      const result = getPosts(["src", "app", "blog", "posts"]);
      expect(result).toHaveLength(3);
      result.forEach((post, index) => {
        expect(post.slug).toBe(`post${index + 1}`);
        expect(post.metadata.title).toBe("Test Post");
        expect(post.content).toBeDefined();
      });
    });
  });
});
