import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const template = `---
title: 'Hello, World!'
publishedAt: '2023-01-01'
summary: 'This is your first blog post.'
---

Hello, World!`;

const info = `import me from '../app/placeholder.jpg';

export const name = 'Ramanathan A';
export const avatar = me;
export const about = () => {
  return (
    <>
    Hello, I am a passionate DevOps enthusiast with a strong desire to learn and grow in the field. I am actively seeking new job opportunities to apply my skills and knowledge to real-world projects. With a solid foundation in DevOps principles and practices, I am confident in my ability to contribute to any team and help drive success. Let's connect and see how we can collaborate!
    </>
  );
};
export const bio = () => {
  return (
    <>
    Outside of my professional pursuits, I enjoy spending time with my daughter and unwinding with some video games or YouTube videos. Additionally, I have a passion for travel and love to explore new places whenever I have the opportunity. Whether it's discovering hidden gems in my own city or venturing to far-off destinations, I find joy in experiencing different cultures and perspectives. Overall, I believe in maintaining a healthy work-life balance and pursuing diverse interests to stay inspired and motivated.
    </>
  );
};
`;

const about = `export default function AboutPage() {
  return (
    <section>
      <h1 className="font-bold text-3xl font-serif">About Me</h1>
      <p className="my-5 text-neutral-800 dark:text-neutral-200">
      I've always been fascinated by the intersection of software development, IT operations, and quality assurance, and how these areas can work together to drive efficiency, speed, and innovation.
      </p>
    </section>
  );
}
`;

const deleteFolderRecursive = async (path) => {
  const stat = await fs.stat(path);
  if (stat.isDirectory()) {
    const files = await fs.readdir(path);
    await Promise.all(
      files.map((file) => deleteFolderRecursive(`${path}/${file}`))
    );
    await fs.rmdir(path);
  } else {
    await fs.unlink(path);
  }
};

(async () => {
  dotenv.config();

  if (process.env.IS_TEMPLATE === 'false') {
    // This means it's not the template, it's my legit site
    // I orderride the env variable for my site. This means that when
    // folks clone this repo for the first time, it will delete my personal content
    return;
  }

  const libDir = path.join(process.cwd(), 'lib');
  const contentDir = path.join(process.cwd(), 'content');
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const aboutDir = path.join(process.cwd(), 'app', 'about');

  await deleteFolderRecursive(contentDir);
  await deleteFolderRecursive(imagesDir);
  await fs.mkdir(contentDir);
  await fs.writeFile(path.join(contentDir, 'hello-world.mdx'), template);
  await fs.writeFile(path.join(libDir, 'info.tsx'), info);
  await fs.writeFile(path.join(aboutDir, 'page.tsx'), about);
})();
