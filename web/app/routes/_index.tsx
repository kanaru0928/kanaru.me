export function meta() {
  return [
    { title: "kanaru.me" },
    { name: "description", content: "Welcome to kanaru.me!" },
  ];
}

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">kanaru</h1>
          <p className="py-6">
            Web Developer & Tech Enthusiast
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/kanaru0928" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://x.com/Kanaru49570357" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
