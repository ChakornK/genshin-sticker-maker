import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@modyfi/vite-plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    yaml(),
    tailwindcss(),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404"],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
    {
      name: "meta-tags",
      transformIndexHtml(html) {
        return ((
          html: string,
          {
            title,
            description,
            image,
          }: { title: string; description: string; image: string }
        ) => {
          const metaHtml = `
		        <title>${title}</title>
		        <meta property="og:description" content="${description}">
		        <meta property="og:title" content="${title}">
		        <meta property="og:image" content="${image}">
		        <meta name="description" content="${description}">
		        <meta name="twitter:title" content="${title}">
		        <meta name="twitter:description" content="${description}">
		        <meta name="twitter:card" content="summary">
		        <meta name="twitter:image" content="${image}">`;
          return html.replace(/(?<=<head>)/, metaHtml);
        })(html, {
          title: "Genshin Sticker Maker",
          description: "Create stickers with Genshin characters",
          image: `${process.env.VITE_RESOURCE_BASE_URL || ""}/favicon.png`,
        });
      },
    },
  ],
});
