'use client'

import {
  DollarSign, Users, TrendingUp, Bell, Share2,
  ShoppingBag, BarChart2, Target, ArrowLeftRight,
  Star, Clock, Heart,
} from 'lucide-react'

const G = '#C9A96E'

export function CategoryIconStyles() {
  return (
    <style>{`
      @keyframes ci-float { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-6px)} }
      @keyframes ci-pulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.12);opacity:1} }
      @keyframes ci-bell  { 0%,100%{transform:rotate(0)} 20%{transform:rotate(15deg)} 40%{transform:rotate(-12deg)} 60%{transform:rotate(7deg)} 80%{transform:rotate(-4deg)} }
      @keyframes ci-beat  { 0%,100%{transform:scale(1)} 20%{transform:scale(1.22)} 40%{transform:scale(1)} 60%{transform:scale(1.12)} }
      @keyframes ci-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes ci-lr    { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
    `}</style>
  )
}

type IconWrapProps = { children: React.ReactNode; anim: string; origin?: string }

function Wrap({ children, anim, origin = 'center' }: IconWrapProps) {
  return (
    <div style={{ color: G, animation: anim, transformOrigin: origin, display: 'flex' }}>
      {children}
    </div>
  )
}

const S = 34  // icon size
const SW = 1.5 // stroke width

export function CategoryIcon({ name }: { name: string }) {
  switch (name) {
    case 'Revenue':
      return <Wrap anim="ci-pulse 2.5s ease-in-out infinite"><DollarSign size={S} strokeWidth={SW} /></Wrap>

    case 'Subscribers':
      return <Wrap anim="ci-float 3s ease-in-out infinite"><Users size={S} strokeWidth={SW} /></Wrap>

    case 'Growth':
      return <Wrap anim="ci-float 2.8s ease-in-out infinite"><TrendingUp size={S} strokeWidth={SW} /></Wrap>

    case 'Alerts':
      return <Wrap anim="ci-bell 2.4s ease-in-out infinite" origin="top center"><Bell size={S} strokeWidth={SW} /></Wrap>

    case 'Social':
      return <Wrap anim="ci-pulse 2.2s ease-in-out infinite"><Share2 size={S} strokeWidth={SW} /></Wrap>

    case 'E-Commerce':
      return <Wrap anim="ci-float 3.2s ease-in-out infinite"><ShoppingBag size={S} strokeWidth={SW} /></Wrap>

    case 'Analytics':
      return <Wrap anim="ci-pulse 2s ease-in-out infinite"><BarChart2 size={S} strokeWidth={SW} /></Wrap>

    case 'Challenges':
      return <Wrap anim="ci-pulse 2.6s ease-in-out infinite"><Target size={S} strokeWidth={SW} /></Wrap>

    case 'Comparisons':
      return <Wrap anim="ci-lr 2s ease-in-out infinite"><ArrowLeftRight size={S} strokeWidth={SW} /></Wrap>

    case 'Ratings':
      return <Wrap anim="ci-pulse 2.4s ease-in-out infinite"><Star size={S} strokeWidth={SW} /></Wrap>

    case 'Timers':
      return <Wrap anim="ci-spin 6s linear infinite"><Clock size={S} strokeWidth={SW} /></Wrap>

    case 'Reactions':
      return <Wrap anim="ci-beat 1.6s ease-in-out infinite"><Heart size={S} strokeWidth={SW} /></Wrap>

    default:
      return null
  }
}
