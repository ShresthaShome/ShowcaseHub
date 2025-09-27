"use client";

import { appHook } from "@/context/AppProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isLoading, authToken } = appHook();

  useEffect(() => {
    if (authToken) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, authToken]);

  return (
    <>
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to ShowcaseHub</h1>
          <p className="lead">Build amazing things with Next.js & Bootstrap</p>
          <Link href="/auth" className="btn btn-light btn-lg mt-3">
            Get Started
          </Link>
        </div>
      </section>

      <section className="container text-center my-5">
        <h2 className="fw-bold">Awesome Features</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <Image src="/file.svg" alt="Feature 1" width={60} height={60} />
            <h4 className="mt-3">Fast Performance</h4>
            <p>Optimized for speed and efficiency.</p>
          </div>
          <div className="col-md-4">
            <Image src="/window.svg" alt="Feature 2" width={60} height={60} />
            <h4 className="mt-3">User Friendly</h4>
            <p>Intuitive and easy-to-use design.</p>
          </div>
          <div className="col-md-4">
            <Image src="/globe.svg" alt="Feature 3" width={60} height={60} />
            <h4 className="mt-3">SEO Ready</h4>
            <p>Boost your search rankings with SEO.</p>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-light text-center py-4">
        <p className="mb-0">
          Copyright © 2025 Shrestha Shome Ullas. All rights reserved.
        </p>
      </footer>
    </>
  );
}
