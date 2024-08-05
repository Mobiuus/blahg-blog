import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";

let posts = Object.values(import.meta.glob("../posts/*.md", { eager: true }));
posts = posts.sort(
    (a, b) =>
        new Date(b.frontmatter.updated || b.frontmatter.added || new Date()).valueOf() -
        new Date(a.frontmatter.updated || a.frontmatter.added || new Date()).valueOf()
);

export const GET = () =>
    rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: import.meta.env.SITE,
        items: posts.map((post) => {
            const pubDate = post.frontmatter.added ? new Date(post.frontmatter.added) : new Date();
            return {
                link: `/post/${post.frontmatter.slug}`,
                title: post.frontmatter.title || 'Untitled',
                pubDate,
                description: post.frontmatter.description || '',
                content: post.compiledContent(),
                customData: post.frontmatter.updated ? `<updated>${post.frontmatter.updated}</updated>` : '',
            };
        }),
    });