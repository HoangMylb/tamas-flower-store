"use client";

import {useLayoutEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MotionReveal({children}: {children: React.ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".hero-copy > *", {opacity: 0, y: 22, duration: .72, stagger: .09, ease: "power3.out", clearProps: "transform,opacity"});
      const groups = gsap.utils.toArray<HTMLElement>(".section-heading, .categories, .products-editorial, .occasion-links, .story > *, .custom > *, .insta-grid, .contact-section > *, .listing-head, .catalog-search, .filters, .product-grid, .detail, .occasion-hero, .occasion-advice, .price-guide, .about-editorial-copy, .about-hero-collage, .about-chapter, .about-pause, .about-closing, .about-contact, .contact-page, .map-area");
      groups.forEach((group) => {
        gsap.from(group, {opacity: 0, y: 24, duration: .65, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: {trigger: group, start: "top 88%", once: true}});
      });
    }, root);
    return () => context.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
