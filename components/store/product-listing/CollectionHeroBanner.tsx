"use client";

interface CollectionHeroBannerProps {
  title: string;
  descriptor: string;
  breadcrumb: string;
}

export function CollectionHeroBanner({
  title,
  descriptor,
  breadcrumb,
}: CollectionHeroBannerProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-75 md:h-120 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80&fit=crop)",
            filter: "brightness(0.4)",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-evol-light-grey opacity-50" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 md:mb-8 text-sm md:text-sm tracking-wide text-white text-opacity-50 font-sans">
            {breadcrumb}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-3 md:mb-4 leading-tight max-w-2xl">
            {title}
          </h1>

          {/* Descriptor */}
          <p className="font-body text-sm md:text-base text-white text-opacity-60 max-w-xl">
            {descriptor}
          </p>
        </div>
      </div>
    </div>
  );
}
