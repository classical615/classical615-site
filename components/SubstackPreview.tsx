"use client";

import { useEffect, useState } from "react";

type Post = {
  title: string;
  link: string;
  date: string;
  snippet: string;
};

export function SubstackPreview() {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch("/api/substack")
      .then((res) => res.json())
      .then((data) => setPost(data.post ?? null))
      .catch(() => setPost(null));
  }, []);

  if (!post) return null;

  return (
    <section className="bg-purple-pale border-b-4 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-widish text-red font-semibold mb-2">Latest from Classically Curious</p>
        <a href={post.link} target="_blank" rel="noreferrer" className="hover:text-red transition-colors">
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">{post.title}</h2>
        </a>
        {post.date && <p className="mt-1 text-sm text-muted">{post.date}</p>}
        <p className="mt-3 font-body text-ink/80 max-w-3xl">{post.snippet}</p>
        <a href={post.link} target="_blank" rel="noreferrer" className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-widish text-red hover:text-ink transition-colors">Read on Substack ↗</a>
      </div>
    </section>
  );
}
