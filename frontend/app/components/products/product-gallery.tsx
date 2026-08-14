import { useState } from "react";
import { ToggleButton } from "@heroui/react/toggle-button";

import { productImageSrcSet } from "~/lib/responsive-images";

export function ProductGallery({ images, productName }: { images: readonly string[]; productName: string }) {
  const gallery = images.length > 0 ? images : ["/images/generator-hero.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage =
    gallery[selectedIndex] ?? gallery[0] ?? "/images/generator-hero.svg";

  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
        <img
          alt={`Representative generator for ${productName}, view ${selectedIndex + 1} of ${gallery.length}`}
          className="h-full w-full object-contain"
          decoding="async"
          fetchPriority="high"
          height={720}
          src={selectedImage}
          srcSet={productImageSrcSet(selectedImage)}
          sizes="(min-width: 1280px) 608px, (min-width: 1024px) 48vw, calc(100vw - 2rem)"
          width={1280}
        />
      </div>
      <p className="mt-2 text-sm text-slate-500">Representative image; supplied configuration may differ.</p>

      {gallery.length > 1 ? (
        <div aria-label={`${productName} gallery`} className="mt-4 flex gap-3" role="group">
          {gallery.map((image, index) => (
            <ToggleButton
              aria-label={`Show ${productName} image ${index + 1}`}
              className={`min-h-14 min-w-20 overflow-hidden rounded-md border-2 bg-slate-100 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                selectedIndex === index ? "border-teal-900" : "border-slate-300"
              }`}
              isSelected={selectedIndex === index}
              key={`${image}-${index}`}
              onPress={() => setSelectedIndex(index)}
              variant="ghost"
            >
              <img
                alt=""
                className="h-12 w-16 object-cover"
                height={48}
                loading="lazy"
                decoding="async"
                src={image}
                srcSet={productImageSrcSet(image)}
                sizes="64px"
                width={64}
              />
            </ToggleButton>
          ))}
        </div>
      ) : null}
    </div>
  );
}
