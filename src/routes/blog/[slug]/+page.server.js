import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogDirectory = path.join(process.cwd(), 'src/lib/blog');

// Fetch a single blog post by slug
const getBlogPostBySlug = (slug) => {
    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return null;  // Handle the case where the file is not found
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return {
        meta: data,
        content: htmlContent,
    };
};

// The load function for the dynamic route
export const load = async ({ params }) => {
    const { slug } = params;  // Get the slug from the route parameters
    const post = getBlogPostBySlug(slug);

    if (!post) {
        throw new Error('Post not found');
    }

    return {
        post
    };
};