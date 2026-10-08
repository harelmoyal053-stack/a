import EventCard from './EventCard'

// Carousel card.
export default function EventSlide({ festival, onOpen }) {
  return <EventCard festival={festival} onOpen={onOpen} className="snap-start shrink-0 w-[46%] sm:w-56" />
}
