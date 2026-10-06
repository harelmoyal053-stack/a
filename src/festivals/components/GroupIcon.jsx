import { Car, Flag, MessageCircle, Tent, Ticket, UserRound } from 'lucide-react'

const ICONS = { MessageCircle, Flag, Car, Tent, Ticket, UserRound }

export default function GroupIcon({ name, size = 20, className }) {
  const Icon = ICONS[name]
  return <Icon size={size} className={className} />
}
