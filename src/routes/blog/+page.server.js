import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogDirectory = path.join(process.cwd(), 'src/lib/blog');

const getAllBlogPosts = () => {
    const fileNames = fs.readdirSync(blogDirectory);
    const allPosts = fileNames.map(fileName => {
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const htmlContent = marked(content);
      return {
        fileName,
        meta: data,
        content: htmlContent,
        slug: data.slug 
      };
    });
    return allPosts;
  }

export const load = async () => {
  const posts = getAllBlogPosts();
  return {
    posts
  };
};