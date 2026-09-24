"use client";

import Image from "next/image";
import {useRef, useState} from "react";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

function Chevron({direction}:{direction:"previous"|"next"}) {
  const previous = direction === "previous";
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={previous ? "M14.5 5 7.5 12l7 7" : "m9.5 5 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function ProductGallery({images,name}:ProductGalleryProps) {
  const gallery = images.slice(0,5);
  const [activeIndex,setActiveIndex] = useState(0);
  const swipeStart = useRef<number | null>(null);
  const activeImage = gallery[activeIndex];
  const select = (index:number) => setActiveIndex((index + gallery.length) % gallery.length);
  const move = (amount:number) => select(activeIndex + amount);
  const onKeyDown = (event:React.KeyboardEvent<HTMLDivElement>) => {
    if(event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if(event.key === "ArrowRight") { event.preventDefault(); move(1); }
  };

  return <div className={styles.gallery} aria-label={`Ảnh của ${name}`} onKeyDown={onKeyDown} tabIndex={0}>
    <div className={styles.main} onTouchStart={(event)=>{swipeStart.current=event.changedTouches[0]?.clientX ?? null;}} onTouchEnd={(event)=>{const start=swipeStart.current;const end=event.changedTouches[0]?.clientX;if(start!==null&&end!==undefined&&Math.abs(end-start)>40)move(end<start?1:-1);swipeStart.current=null;}}>
      <Image src={activeImage} alt={`${name} — góc chụp ${activeIndex+1} trên ${gallery.length}`} fill priority sizes="(max-width: 800px) 100vw, 44vw"/>
      {gallery.length > 1 && <>
        <button className={`${styles.control} ${styles.previous}`} type="button" aria-label="Xem ảnh trước" onClick={()=>move(-1)}><Chevron direction="previous"/></button>
        <button className={`${styles.control} ${styles.next}`} type="button" aria-label="Xem ảnh tiếp theo" onClick={()=>move(1)}><Chevron direction="next"/></button>
        <p className={styles.count} aria-live="polite">{activeIndex+1} / {gallery.length}</p>
      </>}
    </div>
    {gallery.length > 1 && <div className={styles.thumbnails} aria-label="Chọn góc chụp">
      {gallery.map((image,index)=><button type="button" className={index===activeIndex?styles.active:""} onClick={()=>select(index)} aria-label={`Xem góc chụp ${index+1}`} aria-current={index===activeIndex?"true":undefined} key={image}>
        <Image src={image} alt="" fill sizes="96px"/>
      </button>)}
    </div>}
  </div>;
}
