
"use client"

import * as React from "react"
import { type EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

type CarouselApi = EmblaCarouselType | null

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  children: React.ReactNode
  className?: string
  autoplay?: boolean
  interval?: number
}

export function Carousel({
  opts,
  plugins,
  orientation = "horizontal",
  setApi,
  children,
  className,
  autoplay = false,
  interval = 5000,
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )

  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setApi?.(api)
    
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }
    
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    
    setScrollSnaps(api.scrollSnapList())
    
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, setApi])

  React.useEffect(() => {
    if (!api || !autoplay) return

    const intervalId = setInterval(() => {
      if (selectedIndex === scrollSnaps.length - 1) {
        api.scrollTo(0)
      } else {
        api.scrollNext()
      }
    }, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [api, autoplay, interval, selectedIndex, scrollSnaps.length])

  return (
    <div
      ref={carouselRef}
      className={className}
    >
      {children}
    </div>
  )
}

interface CarouselContentProps {
  children: React.ReactNode
  className?: string
}

export function CarouselContent({
  children,
  className,
}: CarouselContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

interface CarouselItemProps {
  children: React.ReactNode
  className?: string
}

export function CarouselItem({
  children,
  className,
}: CarouselItemProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={className}
    >
      {children}
    </div>
  )
}
